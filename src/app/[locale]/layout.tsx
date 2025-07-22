import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getSupportedLocales } from '@/i18n';

// Locale bazlı layout için metadata oluşturucu
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'common');
  
  return {
    title: {
      template: `%s | ${translations.siteTitle || 'eSIM Store'}`,
      default: translations.siteTitle || 'eSIM Store',
    },
    description: translations.siteDescription || 'Buy eSIMs for your travels around the world',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const translations = await getTranslations(locale, 'common');
  const supportedLocales = await getSupportedLocales();
  
  // Dil seçeneklerini hazırla
  const languageOptions = supportedLocales.map(lang => ({
    value: lang.code,
    label: lang.nativeName,
    flag: 'flagIcon' in lang ? lang.flagIcon || undefined : undefined
  }));
  
  return (
    <TranslationProvider locale={locale} messages={translations}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/${locale}`} className="text-2xl font-bold text-blue-600 flex items-center">
            <span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-2 text-white">e</span>
            <span>eSIM Store</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {translations.home || 'Home'}
            </Link>
            <Link href={`/${locale}/esim`} className="hover:text-blue-600">
              {translations.esims || 'eSIMs'}
            </Link>
            <Link href={`/${locale}/referral`} className="hover:text-blue-600">
              {translations.referral || 'Referral'}
            </Link>
            <Link href={`/${locale}/support`} className="hover:text-blue-600">
              {translations.support || 'Support'}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher 
              options={languageOptions} 
              variant="dropdown" 
              className="hidden md:block" 
            />
            
            <Link 
              href={`/${locale}/login`} 
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
            >
              {translations.login || 'Login'}
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{translations.aboutUs || 'About Us'}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {translations.footerAboutText || 'We provide affordable eSIM solutions for travelers worldwide.'}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{translations.quickLinks || 'Quick Links'}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/about`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                    {translations.aboutUs || 'About Us'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/faq`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                    {translations.faq || 'FAQ'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/terms`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                    {translations.terms || 'Terms & Conditions'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/privacy`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
                    {translations.privacy || 'Privacy Policy'}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{translations.contact || 'Contact'}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Email: support@esimstore.com
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {translations.operatingHours || 'Operating Hours'}: 24/7
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{translations.languages || 'Languages'}</h3>
              <LanguageSwitcher 
                options={languageOptions} 
                variant="menu" 
              />
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} eSIM Store. {translations.allRightsReserved || 'All Rights Reserved'}.
            </p>
          </div>
        </div>
      </footer>
    </TranslationProvider>
  );
}
