import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'admin');
  
  return {
    title: `${translations.adminLoginPageTitle || 'Admin Login'} | eSIM Store`,
    description: translations.adminLoginPageDescription || 'Admin login for eSIM Store',
  };
}

// Artık client component'ı kullanıyoruz

// Admin Authentication Requirements bilgisi
function AdminRequirements({ translations }: { translations: any }) {
  return (
    <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md">
      <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
        {translations.adminRequirements || 'Administrator Requirements'}
      </h3>
      <div className="mt-2 text-sm text-indigo-700 dark:text-indigo-400">
        <p>
          {translations.adminRequirementsDescription || 
            'This area is restricted to authorized personnel only. If you are not an administrator, please return to the main site.'}
        </p>
      </div>
    </div>
  );
}

// Server component
export default async function AdminLoginPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = await getTranslations(locale, 'admin');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Oturum durumunu kontrol et
  const session = await getServerSession(authOptions);
  
  // Kullanıcı zaten giriş yapmışsa ve admin rolü varsa, admin paneline yönlendir
  if (session && session.user && session.user.role === 'ADMIN') {
    redirect(`/${locale}/admin/dashboard`);
  }
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <AdminLoginForm locale={locale} translations={translations} />
          <AdminRequirements translations={translations} />
        </div>
      </div>
    </TranslationProvider>
  );
}
