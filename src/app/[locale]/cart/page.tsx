import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import Link from 'next/link';
import { cookies } from 'next/headers';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'cart');
  
  return {
    title: `${translations.cartPageTitle || 'Shopping Cart'} | eSIM Store`,
    description: translations.cartPageDescription || 'View and manage items in your shopping cart',
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
  }
];

// Boş Sepet Bileşeni
function EmptyCart({ translations, locale }: { translations: any, locale: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-2">{translations.emptyCart || 'Your cart is empty'}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {translations.emptyCartDescription || 'Looks like you haven\'t added any eSIMs to your cart yet.'}
      </p>
      <Link 
        href={`/${locale}/esim`}
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {translations.browseEsims || 'Browse eSIMs'}
      </Link>
    </div>
  );
}

// Sepet Ürünü Satırı Bileşeni
function CartItemRow({ 
  product, 
  quantity, 
  translations,
  locale
}: { 
  product: typeof mockEsimProducts[0], 
  quantity: number,
  translations: any,
  locale: string
}) {
  return (
    <div className="flex flex-col md:flex-row items-center py-6 border-b border-gray-200 dark:border-gray-700">
      <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded mr-4">
          <span className="text-gray-500 dark:text-gray-400 text-xs">{product.region.toUpperCase()}</span>
        </div>
        <div>
          <h3 className="font-medium">{product.title}</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {product.dataAmount} • {product.validity}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {product.coverage}
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/5 flex justify-center mb-4 md:mb-0">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
          <button 
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={translations.decreaseQuantity || 'Decrease quantity'}
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            min="1"
            max="10"
            readOnly
            className="w-12 text-center border-x border-gray-300 dark:border-gray-600 py-1 bg-transparent"
          />
          <button 
            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={translations.increaseQuantity || 'Increase quantity'}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="w-full md:w-1/5 flex justify-center mb-4 md:mb-0">
        <span className="font-semibold">${(product.price * quantity).toFixed(2)}</span>
      </div>
      
      <div className="w-full md:w-1/5 flex justify-center">
        <button 
          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          aria-label={translations.removeItem || 'Remove item'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Sepet Özeti Bileşeni
function CartSummary({ 
  subtotal, 
  translations,
  locale 
}: { 
  subtotal: number, 
  translations: any,
  locale: string
}) {
  // Vergiler ve toplam hesaplama (gerçek projede backend'den gelecek)
  const tax = subtotal * 0.1; // %10 vergi örneği
  const total = subtotal + tax;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{translations.orderSummary || 'Order Summary'}</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{translations.subtotal || 'Subtotal'}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{translations.tax || 'Tax'}</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>{translations.total || 'Total'}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Link 
        href={`/${locale}/checkout`}
        className="w-full block py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors"
      >
        {translations.proceedToCheckout || 'Proceed to Checkout'}
      </Link>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>{translations.secureCheckout || 'Secure checkout powered by Stripe'}</p>
        <div className="flex justify-center mt-2 space-x-2">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>Amex</span>
          <span>PayPal</span>
        </div>
      </div>
    </div>
  );
}

// Sepet İçeriği Bileşeni
function CartContent({ 
  cartItems, 
  translations,
  locale 
}: { 
  cartItems: { productId: string, quantity: number }[], 
  translations: any,
  locale: string
}) {
  // Ürünleri sepete göre filtrele ve sepet öğeleriyle eşleştir
  const cartProducts = cartItems.map(item => {
    const product = mockEsimProducts.find(p => p.id === item.productId);
    return { product, quantity: item.quantity };
  }).filter(item => item.product); // Ürün bulunamazsa filtrele
  
  // Ara toplam hesapla
  const subtotal = cartProducts.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);
  
  if (cartProducts.length === 0) {
    return <EmptyCart translations={translations} locale={locale} />;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">{translations.shoppingCart || 'Shopping Cart'}</h2>
          </div>
          
          <div className="hidden md:flex text-sm text-gray-600 dark:text-gray-400 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="w-2/5">{translations.product || 'Product'}</div>
            <div className="w-1/5 text-center">{translations.quantity || 'Quantity'}</div>
            <div className="w-1/5 text-center">{translations.price || 'Price'}</div>
            <div className="w-1/5 text-center">{translations.actions || 'Actions'}</div>
          </div>
          
          <div className="px-6">
            {cartProducts.map(item => (
              <CartItemRow 
                key={item.product?.id} 
                product={item.product!} 
                quantity={item.quantity} 
                translations={translations}
                locale={locale}
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href={`/${locale}/esim`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {translations.continueShopping || 'Continue Shopping'}
            </Link>
            
            <button 
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {translations.updateCart || 'Update Cart'}
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <CartSummary subtotal={subtotal} translations={translations} locale={locale} />
      </div>
    </div>
  );
}

// Server component
export default async function CartPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  const translations = await getTranslations(locale, 'cart');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Çerezlerden sepet verisini al (gerçek projede veritabanından gelebilir)
  const cartCookie = cookies().get('cart');
  let cartItems: { productId: string, quantity: number }[] = [];
  
  if (cartCookie?.value) {
    try {
      cartItems = JSON.parse(cartCookie.value);
    } catch (e) {
      console.error('Failed to parse cart cookie:', e);
    }
  }
  
  // Örnek sepet öğeleri (gerçek bir sepet cookie yoksa)
  if (cartItems.length === 0) {
    cartItems = [
      { productId: 'global-1', quantity: 1 },
      { productId: 'europe-1', quantity: 2 }
    ];
  }
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8">{translations.cartPageTitle || 'Your Shopping Cart'}</h1>
        <CartContent cartItems={cartItems} translations={translations} locale={locale} />
      </div>
    </TranslationProvider>
  );
}
