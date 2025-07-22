import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
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

// Login bileşeni
function LoginForm({ locale, translations }: { locale: string; translations: any }) {
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {translations.signIn || 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {translations.or || 'Or'}{' '}
          <Link 
            href={`/${locale}/register`} 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {translations.createAccount || 'create a new account'}
          </Link>
        </p>
      </div>
      
      <form className="mt-8 space-y-6" action="/api/auth/signin/credentials" method="POST">
        <input type="hidden" name="callbackUrl" value={`/${locale}`} />
        <input type="hidden" name="remember" value="true" />
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={translations.password || 'Password'}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              {translations.rememberMe || 'Remember me'}
            </label>
          </div>

          <div className="text-sm">
            <Link
              href={`/${locale}/forgot-password`}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {translations.forgotPassword || 'Forgot your password?'}
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {translations.signIn || 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">
              {translations.orContinueWith || 'Or continue with'}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <div>
            <button
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
