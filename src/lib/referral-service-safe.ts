import { PrismaClient } from '@prisma/client';
import { generateRandomString } from '@/utils/helpers';

const prisma = new PrismaClient();

/**
 * Referans sistemi için güvenli servis fonksiyonları
 * Hata durumlarını ele alacak şekilde iyileştirilmiştir
 */
export const referralServiceSafe = {
  /**
   * Yeni bir kullanıcı için benzersiz referans kodu oluşturur - hata yönetimi ile
   * @returns Benzersiz bir referans kodu veya null (hata durumunda)
   */
  async generateUniqueReferralCode(): Promise<string | null> {
    try {
      // Sistem ayarlarından referans kodu uzunluğunu al
      // Bulamazsa varsayılan değer kullan
      let codeLength = 8; // Varsayılan değer
      
      try {
        const settings = await prisma.systemSettings.findFirst();
        if (settings?.referralCodeLength) {
          codeLength = settings.referralCodeLength;
        }
      } catch (error) {
        console.warn('SystemSettings tablosuna erişilemiyor, varsayılan kod uzunluğu kullanılıyor.');
        // Varsayılan değeri kullanmaya devam et
      }
      
      let isUnique = false;
      let referralCode = '';
      let attempts = 0;
      const maxAttempts = 10; // Sonsuz döngü riskini önlemek için
      
      // Benzersiz bir kod oluşturana kadar dene (sınırlı sayıda deneme)
      while (!isUnique && attempts < maxAttempts) {
        attempts++;
        referralCode = generateRandomString(codeLength);
        
        try {
          // Kod veritabanında var mı kontrol et
          const existingUser = await prisma.user.findFirst({
            where: { referralCode }
          });
          
          if (!existingUser) {
            isUnique = true;
          }
        } catch (error) {
          console.error('Referral kodu kontrolü sırasında hata:', error);
          // Son üretilen kodu döndür, veritabanı hatası nedeniyle kontrol edilemedi
          return referralCode;
        }
      }
      
      if (attempts >= maxAttempts) {
        console.warn('Maksimum deneme sayısına ulaşıldı, son üretilen kod kullanılacak.');
      }
      
      return referralCode;
    } catch (error) {
      console.error('Referral kodu oluşturma hatası:', error);
      return null;
    }
  },
  
  /**
   * Bir kullanıcıya referans kodu atar - hata yönetimi ile
   * @param userId Kullanıcı ID'si
   * @returns Atanan referans kodu veya null (hata durumunda)
   */
  async assignReferralCode(userId: string): Promise<string | null> {
    try {
      const code = await this.generateUniqueReferralCode();
      
      if (!code) {
        console.error('Referral kodu oluşturulamadı');
        return null;
      }
      
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code }
      });
      
      return code;
    } catch (error) {
      console.error('Referral kodu atama hatası:', error);
      return null;
    }
  }
};

export default referralServiceSafe;
