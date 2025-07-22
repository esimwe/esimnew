import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import Link from 'next/link';
import Image from 'next/image';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'esim');
  
  return {
    title: `${translations.esimPageTitle || 'eSIM Plans'} | eSIM Store`,
    description: translations.esimPageDescription || 'Browse our selection of eSIM plans for your travels',
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
    popular: true
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
    popular: false
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
    popular: true
  },
  {
    id: 'asia-1',
    title: 'Asia Connect',
    region: 'asia',
    dataAmount: '8GB',
    validity: '15 days',
    price: 27.99,
    coverage: '25 Asian countries',
    image: '/images/asia-map.jpg',
    popular: false
  },
  {
    id: 'latam-1',
    title: 'Latin America',
    region: 'latin-america',
    dataAmount: '3GB',
    validity: '7 days',
    price: 14.99,
    coverage: '18 countries',
    image: '/images/latam-map.jpg',
    popular: false
  },
  {
    id: 'mena-1',
    title: 'Middle East & Africa',
    region: 'mena',
    dataAmount: '4GB',
    validity: '14 days',
    price: 22.99,
    coverage: '30 countries',
    image: '/images/mena-map.jpg',
    popular: false
  }
];

// Filtre bileşeni
function FilterBar({ translations, locale }: { translations: any, locale: string }) {
  const regions = [
    { id: 'all', label: translations.allRegions || 'All Regions' },
    { id: 'global', label: translations.global || 'Global' },
    { id: 'europe', label: translations.europe || 'Europe' },
    { id: 'usa', label: translations.usa || 'USA' },
    { id: 'asia', label: translations.asia || 'Asia' },
    { id: 'latin-america', label: translations.latinAmerica || 'Latin America' },
    { id: 'mena', label: translations.mena || 'Middle East & Africa' },
  ];
  
  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">{translations.filterByRegion || 'Filter by Region'}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {regions.map(region => (
              <Link 
                key={region.id} 
                href={region.id === 'all' ? `/${locale}/esim` : `/${locale}/esim?region=${region.id}`}
                className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-900"
              >
                {region.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.sortBy || 'Sort by'}
            </label>
            <select 
              id="sort" 
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="price-asc">{translations.priceLowToHigh || 'Price: Low to High'}</option>
              <option value="price-desc">{translations.priceHighToLow || 'Price: High to Low'}</option>
              <option value="data-asc">{translations.dataLowToHigh || 'Data: Low to High'}</option>
              <option value="data-desc">{translations.dataHighToLow || 'Data: High to Low'}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// eSIM Kartı bileşeni
function EsimCard({ 
  product, 
  translations, 
  locale 
}: { 
  product: typeof mockEsimProducts[0], 
  translations: any,
  locale: string
}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
      {product.popular && (
        <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
          {translations.popular || 'Popular'}
        </div>
      )}
      
      <div className="h-40 overflow-hidden">
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400">{product.region.toUpperCase()} Map</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        
        <div className="flex justify-between mb-3">
          <div className="text-gray-600 dark:text-gray-300">{translations.data || 'Data'}</div>
          <div className="font-medium">{product.dataAmount}</div>
        </div>
        
        <div className="flex justify-between mb-3">
          <div className="text-gray-600 dark:text-gray-300">{translations.validity || 'Validity'}</div>
          <div className="font-medium">{product.validity}</div>
        </div>
        
        <div className="flex justify-between mb-3">
          <div className="text-gray-600 dark:text-gray-300">{translations.coverage || 'Coverage'}</div>
          <div className="font-medium">{product.coverage}</div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
          <Link 
            href={`/${locale}/esim/${product.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {translations.viewDetails || 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
}

// Server component
export default async function EsimPage({ params, searchParams }: { params: { locale: string }, searchParams: { region?: string } }) {
  const { locale } = params;
  const region = searchParams.region;
  
  const translations = await getTranslations(locale, 'esim');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Bölgeye göre filtreleme (gerçek projede API'den gelecek)
  const filteredProducts = region 
    ? mockEsimProducts.filter(product => product.region === region) 
    : mockEsimProducts;
    
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {region 
            ? translations[`region_${region}`] || `${region.charAt(0).toUpperCase() + region.slice(1)} eSIMs`
            : translations.esimPageTitle || 'Browse eSIM Plans'}
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {translations.esimPageDescription || 
            'Choose the perfect eSIM data plan for your next trip. Instant delivery, easy setup.'}
        </p>
        
        <FilterBar translations={translations} locale={locale} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <EsimCard 
              key={product.id} 
              product={product} 
              translations={translations}
              locale={locale}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {translations.noProductsFound || 'No products found for this region'}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {translations.tryDifferentRegion || 'Try selecting a different region or view all eSIMs'}
            </p>
            <Link 
              href={`/${locale}/esim`}
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md"
            >
              {translations.viewAllEsims || 'View All eSIMs'}
            </Link>
          </div>
        )}
      </div>
    </TranslationProvider>
  );
}
