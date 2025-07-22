import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'auth');
  
  return {
    title: `${translations.registerPageTitle || 'Create Account'} | eSIM Store`,
    description: translations.registerPageDescription || 'Create a new account to manage your eSIMs and orders',
  };
}

// Artık client component'ı kullanıyoruz

// Referans Kodu Giriş Bileşeni
function ReferralCodeInput({ translations }: { translations: any }) {
  return (
    <div className="mt-8 max-w-md mx-auto">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {translations.haveReferralCode || 'Have a referral code?'}
        </h3>
        <div className="flex">
          <input
            type="text"
            placeholder={translations.enterReferralCode || 'Enter referral code'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
          >
            {translations.apply || 'Apply'}
          </button>
        </div>
        <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">
          {translations.referralBenefits || 'Get 10% off your first purchase when you use a referral code'}
        </p>
      </div>
    </div>
  );
}

// Server component
export default async function RegisterPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = await getTranslations(locale, 'auth');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Oturum durumunu kontrol et
  const session = await getServerSession(authOptions);
  
  // Kullanıcı zaten giriş yapmışsa, anasayfaya yönlendir
  if (session) {
    redirect(`/${locale}`);
  }
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <RegisterForm locale={locale} translations={translations} />
        </div>
        
        <ReferralCodeInput translations={translations} />
      </div>
    </TranslationProvider>
  );
}
