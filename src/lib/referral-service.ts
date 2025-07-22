import { PrismaClient } from '@prisma/client';
import { generateRandomString } from '@/utils/helpers';

const prisma = new PrismaClient();

/**
 * Referans sistemi için servis fonksiyonları
 */
export const referralService = {
  /**
   * Yeni bir kullanıcı için benzersiz referans kodu oluşturur
   * @returns Benzersiz bir referans kodu
   */
  async generateUniqueReferralCode(): Promise<string> {
    // Sistem ayarlarından referans kodu uzunluğunu al
    const settings = await prisma.systemSettings.findFirst();
    const codeLength = settings?.referralCodeLength || 8;
    
    let isUnique = false;
    let referralCode = '';
    
    // Benzersiz bir kod oluşturana kadar dene
    while (!isUnique) {
      referralCode = generateRandomString(codeLength);
      
      // Kod veritabanında var mı kontrol et
      const existingUser = await prisma.user.findFirst({
        where: { referralCode }
      });
      
      if (!existingUser) {
        isUnique = true;
      }
    }
    
    return referralCode;
  },
  
  /**
   * Bir kullanıcıya referans kodu atar
   * @param userId Kullanıcı ID'si
   */
  async assignReferralCode(userId: string): Promise<string> {
    const code = await this.generateUniqueReferralCode();
    
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: code }
    });
    
    return code;
  },
  
  /**
   * Referans kodunu kullanarak bir kullanıcının kaydolmasını işler
   * @param referralCode Davet eden kullanıcının referans kodu
   * @param newUserId Yeni kaydolan kullanıcının ID'si
   */
  async processReferral(referralCode: string, newUserId: string): Promise<boolean> {
    try {
      // Referans kodu olan kullanıcıyı bul
      const referrer = await prisma.user.findFirst({
        where: { referralCode }
      });
      
      if (!referrer) {
        return false;
      }
      
      // Yeni kullanıcıyı güncelle
      await prisma.user.update({
        where: { id: newUserId },
        data: { referredBy: referrer.id }
      });
      
      // Referans ilişkisini kaydet
      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredId: newUserId,
          status: 'pending'
        }
      });
      
      return true;
    } catch (error) {
      console.error('Process referral error:', error);
      return false;
    }
  },
  
  /**
   * Kullanıcının ilk satın alımından sonra referans bonusunu işler
   * @param userId Kullanıcı ID'si
   */
  async completeReferralProcess(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user || !user.referredBy || user.firstPurchase) {
        return;
      }
      
      // Sistem ayarlarından bonus miktarını al
      const settings = await prisma.systemSettings.findFirst();
      const bonusAmount = settings?.referralBonusAmount || 10.00;
      
      // Referans veren kullanıcıyı bul
      const referrer = await prisma.user.findUnique({
        where: { id: user.referredBy }
      });
      
      if (!referrer) {
        return;
      }
      
      // Referral kaydını güncelle
      await prisma.referral.updateMany({
        where: {
          referrerId: referrer.id,
          referredId: userId,
          status: 'pending'
        },
        data: {
          status: 'completed',
          bonusAmount,
          completedAt: new Date()
        }
      });
      
      // Referans veren kullanıcının bakiyesini güncelle
      const newBalance = (referrer.rewardBalance || 0) + bonusAmount;
      
      await prisma.user.update({
        where: { id: referrer.id },
        data: { rewardBalance: newBalance }
      });
      
      // Referans veren kullanıcı için ödül geçmişi kaydı oluştur
      await prisma.rewardHistory.create({
        data: {
          userId: referrer.id,
          type: 'referral',
          amount: bonusAmount,
          description: `${user.name || user.email} kullanıcısını davet ettiğiniz için bonus`,
          balanceBefore: referrer.rewardBalance || 0,
          balanceAfter: newBalance
        }
      });
      
      // Yeni kullanıcının ilk satın alımını tamamlandı olarak işaretle
      await prisma.user.update({
        where: { id: userId },
        data: { firstPurchase: true }
      });
    } catch (error) {
      console.error('Complete referral process error:', error);
    }
  },
  
  /**
   * Bir kullanıcının referans ettiği tüm kullanıcıları listeler
   * @param userId Kullanıcı ID'si
   * @returns Referans edilen kullanıcıların listesi ve toplam bonus miktarı
   */
  async getUserReferrals(userId: string) {
    try {
      const referrals = await prisma.referral.findMany({
        where: { referrerId: userId },
        include: {
          referred: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
              firstPurchase: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      // Toplam kazanılan bonus miktarını hesapla
      const totalEarned = await prisma.referral.aggregate({
        where: {
          referrerId: userId,
          status: 'completed'
        },
        _sum: { bonusAmount: true }
      });
      
      return {
        referrals,
        totalEarned: totalEarned._sum.bonusAmount || 0
      };
    } catch (error) {
      console.error('Get user referrals error:', error);
      return { referrals: [], totalEarned: 0 };
    }
  },
  
  /**
   * Bakiye işlemlerini yapar (harcama veya ekleme)
   * @param userId Kullanıcı ID'si
   * @param amount İşlem miktarı (Negatif değer bakiyeyi azaltır)
   * @param type İşlem türü (purchase, referral, bonus)
   * @param description İşlem açıklaması
   */
  async processBalanceTransaction(
    userId: string,
    amount: number,
    type: 'purchase' | 'referral' | 'bonus',
    description: string
  ): Promise<boolean> {
    try {
      // Kullanıcıyı bul
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return false;
      }
      
      const currentBalance = user.rewardBalance || 0;
      
      // İşlem sonrası yeni bakiye (Çıkarma işlemi için negatif değer verilmeli)
      const newBalance = currentBalance + amount;
      
      // Harcama işleminde bakiye yetersizse
      if (newBalance < 0) {
        return false;
      }
      
      // Kullanıcı bakiyesini güncelle
      await prisma.user.update({
        where: { id: userId },
        data: { rewardBalance: newBalance }
      });
      
      // İşlem kaydı oluştur
      await prisma.rewardHistory.create({
        data: {
          userId,
          type,
          amount,
          description,
          balanceBefore: currentBalance,
          balanceAfter: newBalance
        }
      });
      
      return true;
    } catch (error) {
      console.error('Process balance transaction error:', error);
      return false;
    }
  }
};

export default referralService;
