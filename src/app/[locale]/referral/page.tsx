// Referral Program Page
import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import ReferralDashboard from '@/components/referral/ReferralDashboard';
import { languageService } from '@/lib/language-service';
import { referralService } from '@/lib/referral-service';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/prisma';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'referral');
  
  return {
    title: `${translations.referralPageTitle} | eSIM Store`,
    description: translations.referralPageDescription,
  };
}

// Server component
export default async function ReferralPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = await getTranslations(locale, 'referral');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Oturum bilgilerini kontrol et
  const session = await getServerSession(authOptions);
  
  // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/referral`);
  }
  
  // Kullanıcının referans bilgilerini getir
  const userId = session.user.id as string;
  const referralDataRaw = await referralService.getUserReferrals(userId);
  
  // Decimal tiplerini number'a çevir
  const referralData = {
    ...referralDataRaw,
    totalEarned: Number(referralDataRaw.totalEarned),
    referrals: referralDataRaw.referrals.map(ref => ({
      ...ref,
      bonusAmount: Number(ref.bonusAmount)
    }))
  };
  
  // Kullanıcının referans kodu yoksa oluştur
  if (!session.user.referralCode) {
    await referralService.assignReferralCode(userId);
  }
  
  // Güncel kullanıcı bilgilerini getir
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      referralCode: true,
      rewardBalance: true
    }
  });
  
  // Prisma'dan gelen Decimal tipini number'a dönüştür
  const user = userData ? {
    ...userData,
    rewardBalance: userData.rewardBalance ? Number(userData.rewardBalance) : null
  } : null;
  
  // Sistem ayarlarını getir
  const settingsData = await prisma.systemSettings.findFirst();
  
  // Decimal tipini number'a dönüştür
  const settings = settingsData ? {
    ...settingsData,
    referralBonusAmount: settingsData.referralBonusAmount ? Number(settingsData.referralBonusAmount) : 10.00,
    minimumWithdrawal: settingsData.minimumWithdrawal ? Number(settingsData.minimumWithdrawal) : 50.00
  } : null;
  
  // Mevcut sitenin tam URL'si
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="container max-w-5xl px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">{translations.referralPageTitle}</h1>
        
        <ReferralDashboard 
          user={user}
          referrals={referralData.referrals}
          totalEarned={referralData.totalEarned}
          referralLink={`${baseUrl}/register?ref=${user?.referralCode}`}
          bonusAmount={settings?.referralBonusAmount || 10}
        />
      </div>
    </TranslationProvider>
  );
}
