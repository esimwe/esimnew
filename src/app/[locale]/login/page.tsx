import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'auth');
  
  return {
    title: `${translations.loginPageTitle || 'Login'} | eSIM Store`,
    description: translations.loginPageDescription || 'Sign in to your eSIM Store account',
  };
}

// Artık client component'ı kullanıyoruz

// Admin giriş bağlantısı
function AdminLoginLink({ translations }: { translations: any }) {
  return (
    <div className="text-center mt-8">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {translations.areYouAdmin || 'Are you an administrator?'}{' '}
        <Link 
          href="/admin/login" 
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {translations.adminLogin || 'Admin login'}
        </Link>
      </p>
    </div>
  );
}

// Server component
export default async function LoginPage({ params }: { params: { locale: string } }) {
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
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <LoginForm locale={locale} translations={translations} />
          <AdminLoginLink translations={translations} />
        </div>
      </div>
    </TranslationProvider>
  );
}
