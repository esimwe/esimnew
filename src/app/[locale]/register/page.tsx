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
    title: `${translations.registerPageTitle || 'Create Account'} | eSIM Store`,
    description: translations.registerPageDescription || 'Create a new account to manage your eSIMs and orders',
  };
}

// Kayıt Formu bileşeni
function RegisterForm({ locale, translations }: { locale: string; translations: any }) {
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {translations.createAccount || 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {translations.alreadyHaveAccount || 'Already have an account?'}{' '}
          <Link 
            href={`/${locale}/login`} 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            {translations.signIn || 'Sign in'}
          </Link>
        </p>
      </div>
      
      <form className="mt-8 space-y-6" action="#" method="POST">
        <div className="rounded-md shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.firstName || 'First Name'}*
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.lastName || 'Last Name'}*
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.emailAddress || 'Email address'}*
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.password || 'Password'}*
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {translations.passwordRequirements || 'Must be at least 8 characters with 1 uppercase, 1 number and 1 special character'}
            </p>
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.confirmPassword || 'Confirm Password'}*
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.phoneNumber || 'Phone Number'}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms-agree"
            name="termsAgree"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
          />
          <label htmlFor="terms-agree" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            {translations.agreeToTerms || 'I agree to the'}{' '}
            <Link href={`/${locale}/terms`} className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              {translations.termsAndConditions || 'Terms and Conditions'}
            </Link>{' '}
            {translations.andThe || 'and the'}{' '}
            <Link href={`/${locale}/privacy`} className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
              {translations.privacyPolicy || 'Privacy Policy'}
            </Link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {translations.createAccount || 'Create Account'}
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
          <button
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <span>Google</span>
          </button>
        </div>
      </div>
      
      <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        {translations.byCreatingAccount || 'By creating an account, you will receive eSIM updates and offers. You can opt out at any time.'}
      </div>
    </div>
  );
}

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
