import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
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

// Admin Login Form bileşeni
function AdminLoginForm({ locale, translations }: { locale: string; translations: any }) {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          {translations.adminLogin || 'Admin Login'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {translations.adminLoginDescription || 'Sign in to the admin dashboard'}
        </p>
      </div>
      
      <form className="mt-8 space-y-6" action="#" method="POST">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              {translations.emailAddress || 'Email address'}
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={translations.emailAddress || 'Email address'}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              {translations.password || 'Password'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={translations.password || 'Password'}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            {translations.signIn || 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <Link 
          href={`/${locale}`} 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          {translations.backToWebsite || 'Back to website'}
        </Link>
      </div>
    </div>
  );
}

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
