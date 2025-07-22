import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import Link from 'next/link';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'home');
  
  return {
    title: `${translations.homePageTitle || 'Home'} | eSIM Store`,
    description: translations.homePageDescription || 'Buy eSIMs for your travels around the world',
  };
}

// Server component
export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = await getTranslations(locale, 'home');
  const commonTranslations = await getTranslations(locale, 'common');
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center">
          {translations.homePageTitle || 'Welcome to eSIM Store'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">
              {translations.homeHeroTitle || 'Travel Anywhere with Instant Mobile Connectivity'}
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {translations.homeHeroDescription || 'Get connected instantly with our eSIM service. No physical SIM card needed, just scan and connect in over 190+ countries worldwide.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href={`/${locale}/esim`} 
                className="px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {translations.browseEsims || 'Browse eSIMs'}
              </Link>
              <Link 
                href={`/${locale}/referral`} 
                className="px-5 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {translations.referralProgram || 'Referral Program'}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">{translations.imagePlaceholder || 'Hero Image'}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {translations.featuredDestinations || 'Popular Destinations'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['USA', 'Europe', 'Asia', 'Global'].map((region) => (
              <Link 
                key={region} 
                href={`/${locale}/esim/${region.toLowerCase()}`}
                className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded mb-2 flex items-center justify-center">
                  <span className="text-gray-400">{region}</span>
                </div>
                <p>{translations[`region_${region.toLowerCase()}`] || region}</p>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {translations.howItWorks || 'How It Works'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-full">1</div>
              <h3 className="mb-2 text-lg font-medium">
                {translations.step1Title || 'Choose Your eSIM'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {translations.step1Desc || 'Select from our range of eSIMs for your destination'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-full">2</div>
              <h3 className="mb-2 text-lg font-medium">
                {translations.step2Title || 'Purchase & Download'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {translations.step2Desc || 'Pay securely and get your eSIM instantly'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-full">3</div>
              <h3 className="mb-2 text-lg font-medium">
                {translations.step3Title || 'Scan & Connect'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {translations.step3Desc || 'Scan the QR code with your phone and start using data'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </TranslationProvider>
  );
}
