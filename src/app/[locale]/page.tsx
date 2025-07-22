import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import Link from 'next/link';
import Image from 'next/image';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'home');
  
  return {
    title: `${translations.homePageTitle || 'Home'} | eSIM Store`,
    description: translations.homePageDescription || 'Buy eSIMs for your travels around the world',
  };
}

// Ana sayfa bileşeni
export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = await getTranslations(locale, 'home');
  const commonTranslations = await getTranslations(locale, 'common');
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {translations.heroTitle || 'Travel Globally, Connect Locally'}
              </h1>
              <p className="text-xl mb-8">
                {translations.heroSubtitle || 'Stay connected in 190+ countries with our affordable eSIM plans'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={`/${locale}/esim`}
                  className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors text-center"
                >
                  {translations.exploreEsims || 'Explore eSIMs'}
                </Link>
                <Link 
                  href={`/${locale}/how-it-works`}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-center"
                >
                  {translations.howItWorks || 'How it Works'}
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="bg-blue-50 p-4 rounded flex items-center justify-center">
                  <span className="text-8xl">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translations.featuredPlans || 'Featured eSIM Plans'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Global Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h3 className="text-xl font-bold">Global Traveller</h3>
                <p className="text-sm opacity-90">190+ countries coverage</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-gray-500">Data</p>
                    <p className="text-lg font-semibold">5GB</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Validity</p>
                    <p className="text-lg font-semibold">30 days</p>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <p className="text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-blue-600">$29.99</p>
                </div>
                <Link 
                  href={`/${locale}/esim/global-1`}
                  className="block w-full py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {translations.viewDetails || 'View Details'}
                </Link>
              </div>
            </div>
            
            {/* Europe Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <h3 className="text-xl font-bold">Europe Explorer</h3>
                <p className="text-sm opacity-90">All EU countries + UK</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-gray-500">Data</p>
                    <p className="text-lg font-semibold">10GB</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Validity</p>
                    <p className="text-lg font-semibold">15 days</p>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <p className="text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-green-600">$19.99</p>
                </div>
                <Link 
                  href={`/${locale}/esim/europe-1`}
                  className="block w-full py-2 text-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {translations.viewDetails || 'View Details'}
                </Link>
              </div>
            </div>
            
            {/* USA Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-purple-600 text-white p-4">
                <h3 className="text-xl font-bold">USA Unlimited</h3>
                <p className="text-sm opacity-90">USA & Canada coverage</p>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-gray-500">Data</p>
                    <p className="text-lg font-semibold">Unlimited</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Validity</p>
                    <p className="text-lg font-semibold">10 days</p>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <p className="text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-purple-600">$24.99</p>
                </div>
                <Link 
                  href={`/${locale}/esim/usa-1`}
                  className="block w-full py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {translations.viewDetails || 'View Details'}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              href={`/${locale}/esim`}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              {translations.viewAllPlans || 'View All Plans'}
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translations.howItWorks || 'How It Works'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{translations.buyEsim || 'Buy an eSIM'}</h3>
              <p className="text-gray-600">
                {translations.buyEsimDescription || 'Choose from our range of data plans and complete your purchase'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{translations.scanQr || 'Scan QR Code'}</h3>
              <p className="text-gray-600">
                {translations.scanQrDescription || 'Scan the QR code to install the eSIM profile on your device'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{translations.connect || 'Connect'}</h3>
              <p className="text-gray-600">
                {translations.connectDescription || 'Activate your eSIM when you arrive at your destination and enjoy staying connected'}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {translations.testimonials || 'What Our Customers Say'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center mr-4">
                  JS
                </div>
                <div>
                  <h4 className="font-bold">John S.</h4>
                  <p className="text-sm text-gray-500">London, UK</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Used the Global Traveller eSIM across 4 countries in Asia. Setup was easy and connection was reliable throughout my trip."
              </p>
              <div className="flex mt-3 text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full text-white flex items-center justify-center mr-4">
                  ML
                </div>
                <div>
                  <h4 className="font-bold">Maria L.</h4>
                  <p className="text-sm text-gray-500">Barcelona, Spain</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The Europe Explorer eSIM saved me so much money compared to roaming charges. Will definitely use again for my next trip!"
              </p>
              <div className="flex mt-3 text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full text-white flex items-center justify-center mr-4">
                  DK
                </div>
                <div>
                  <h4 className="font-bold">David K.</h4>
                  <p className="text-sm text-gray-500">Sydney, Australia</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Customer service was excellent when I needed help setting up my eSIM. Highly recommend for hassle-free connectivity!"
              </p>
              <div className="flex mt-3 text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {translations.readyToConnect || 'Ready to Stay Connected on Your Next Trip?'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {translations.ctaSubtitle || 'Join thousands of travelers who trust our eSIM service for reliable global connectivity'}
          </p>
          <Link 
            href={`/${locale}/esim`}
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors inline-block"
          >
            {translations.getYourEsim || 'Get Your eSIM Now'}
          </Link>
        </div>
      </section>
    </TranslationProvider>
  );
}
