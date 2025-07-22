import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string, id: string } }) {
  const { locale, id } = params;
  const translations = await getTranslations(locale, 'esim');
  
  // Gerçek uygulamada bu veriyi API'den alacağız
  const product = mockEsimProducts.find(p => p.id === id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  
  return {
    title: `${product.title} | eSIM Store`,
    description: `${product.dataAmount} data for ${product.coverage}. Valid for ${product.validity}.`,
  };
}

// Mock veri (gerçek projede API'den gelecek)
const mockEsimProducts = [
  {
    id: 'global-1',
    title: 'Global Traveller',
    region: 'global',
    dataAmount: '5GB',
    validity: '30 days',
    price: 29.99,
    coverage: '190+ countries',
    image: '/images/global-map.jpg',
    popular: true,
    description: 'Perfect for worldwide travel. Stay connected across 190+ countries with our Global Traveller eSIM plan.',
    countries: ['USA', 'UK', 'France', 'Germany', 'Japan', 'Australia', 'Brazil', 'South Africa', 'India', 'Canada', '180+ more'],
    features: [
      'Data speed up to 4G/LTE',
      'Simple QR code activation',
      'Compatible with eSIM-enabled devices',
      'Instant delivery via email',
      'No contracts or hidden fees',
      'Multiple device support'
    ]
  },
  {
    id: 'europe-1',
    title: 'Europe Explorer',
    region: 'europe',
    dataAmount: '10GB',
    validity: '15 days',
    price: 19.99,
    coverage: 'All EU countries',
    image: '/images/europe-map.jpg',
    popular: false,
    description: 'Explore Europe without worrying about connectivity. Works seamlessly across all EU countries plus UK, Switzerland, and Norway.',
    countries: ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'UK', 'Switzerland', 'Norway'],
    features: [
      'Data speed up to 4G/LTE',
      'Simple QR code activation',
      'Compatible with eSIM-enabled devices',
      'Instant delivery via email',
      'No contracts or hidden fees',
      'EU roaming included'
    ]
  },
  {
    id: 'usa-1',
    title: 'USA Unlimited',
    region: 'usa',
    dataAmount: 'Unlimited',
    validity: '10 days',
    price: 24.99,
    coverage: 'USA + Canada',
    image: '/images/usa-map.jpg',
    popular: true,
    description: 'Unlimited data for your USA and Canada trip. Never worry about running out of data again with our truly unlimited plan.',
    countries: ['United States', 'Canada'],
    features: [
      'Truly unlimited data',
      'Data speed up to 4G/LTE',
      'Simple QR code activation',
      'Compatible with eSIM-enabled devices',
      'Instant delivery via email',
      'No throttling after usage limits'
    ]
  }
];

// Ürün Detay Ana Bileşeni
function ProductDetail({ 
  product, 
  translations, 
  locale 
}: { 
  product: typeof mockEsimProducts[0], 
  translations: any,
  locale: string
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Sol Kolon - Görsel ve Özellikler */}
      <div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center mb-6">
          <span className="text-gray-500 dark:text-gray-400 text-lg">{product.region.toUpperCase()} Map</span>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{translations.features || 'Features'}</h3>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">{translations.countries || 'Countries Covered'}</h3>
          <div className="flex flex-wrap gap-2">
            {product.countries.map((country, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sağ Kolon - Ürün Bilgileri ve Satın Alma */}
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{product.title}</h1>
            {product.popular && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {translations.popular || 'Popular'}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium">{translations.region || 'Region'}</span>
              <span>{product.region.charAt(0).toUpperCase() + product.region.slice(1)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium">{translations.data || 'Data'}</span>
              <span>{product.dataAmount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium">{translations.validity || 'Validity'}</span>
              <span>{product.validity}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium">{translations.coverage || 'Coverage'}</span>
              <span>{product.coverage}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {translations.taxIncluded || 'Tax included'}
            </div>
          </div>
          
          <Link 
            href={`/${locale}/cart/add?product=${product.id}`}
            className="w-full block py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors mb-3"
          >
            {translations.addToCart || 'Add to Cart'}
          </Link>
          
          <Link 
            href={`/${locale}/checkout?product=${product.id}`}
            className="w-full block py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg transition-colors"
          >
            {translations.buyNow || 'Buy Now'}
          </Link>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            {translations.howToUse || 'How to Use Your eSIM'}
          </h3>
          <ol className="space-y-3 text-blue-700 dark:text-blue-300">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>{translations.howToUseStep1 || 'Purchase your eSIM plan'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>{translations.howToUseStep2 || 'Receive activation QR code via email'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>{translations.howToUseStep3 || 'Scan the QR code with your phone'}</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>{translations.howToUseStep4 || 'Activate your eSIM when you arrive at your destination'}</span>
            </li>
          </ol>
          <div className="mt-4">
            <Link 
              href={`/${locale}/help/esim-setup`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {translations.learnMore || 'Learn more about eSIM setup'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// İlgili Ürünler Bileşeni
function RelatedProducts({ 
  currentProductId, 
  translations, 
  locale 
}: { 
  currentProductId: string, 
  translations: any, 
  locale: string 
}) {
  const relatedProducts = mockEsimProducts
    .filter(p => p.id !== currentProductId)
    .slice(0, 3);
    
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{translations.relatedProducts || 'You might also like'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">{product.region.toUpperCase()} Map</span>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold">{product.title}</h3>
              <div className="flex justify-between mt-2 mb-3">
                <span>{product.dataAmount}</span>
                <span className="font-medium">${product.price.toFixed(2)}</span>
              </div>
              
              <Link 
                href={`/${locale}/esim/${product.id}`}
                className="w-full block py-2 text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                {translations.viewDetails || 'View Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Server component
export default async function EsimDetailPage({ params }: { params: { locale: string, id: string } }) {
  const { locale, id } = params;
  
  const translations = await getTranslations(locale, 'esim');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Ürünü bul (gerçek uygulamada API'den gelecek)
  const product = mockEsimProducts.find(p => p.id === id);
  
  // Ürün bulunamadıysa 404
  if (!product) {
    notFound();
  }
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <div className="mb-6">
          <Link href={`/${locale}/esim`} className="text-blue-600 hover:underline flex items-center">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {translations.backToAllEsims || 'Back to all eSIMs'}
          </Link>
        </div>
        
        <ProductDetail product={product} translations={translations} locale={locale} />
        
        <RelatedProducts currentProductId={id} translations={translations} locale={locale} />
      </div>
    </TranslationProvider>
  );
}
