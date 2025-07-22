import React from 'react';
import { getTranslations } from '@/i18n';
import { TranslationProvider } from '@/components/TranslationProvider';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';

// Metadata generator
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await getTranslations(params.locale, 'checkout');
  
  return {
    title: `${translations.checkoutPageTitle || 'Checkout'} | eSIM Store`,
    description: translations.checkoutPageDescription || 'Complete your purchase securely',
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

// Ödeme Özeti Bileşeni
function OrderSummary({ 
  cartItems, 
  translations 
}: { 
  cartItems: { product: typeof mockEsimProducts[0], quantity: number }[],
  translations: any
}) {
  // Hesaplamalar
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1; // %10 vergi örneği
  const total = subtotal + tax;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        {translations.orderSummary || 'Order Summary'}
      </h3>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {cartItems.map(item => (
          <div key={item.product.id} className="py-3 flex justify-between">
            <div>
              <div className="font-medium">{item.product.title} x{item.quantity}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {item.product.dataAmount} • {item.product.validity}
              </div>
            </div>
            <div className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{translations.subtotal || 'Subtotal'}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{translations.tax || 'Tax'}</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2 text-lg">
          <span>{translations.total || 'Total'}</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// Müşteri Bilgileri Formu
function CustomerInfoForm({ translations }: { translations: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        {translations.customerInformation || 'Customer Information'}
      </h3>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.firstName || 'First Name'}*
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.lastName || 'Last Name'}*
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {translations.email || 'Email Address'}*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {translations.emailDescription || 'Your eSIM will be delivered to this email address'}
          </p>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {translations.phone || 'Phone Number'}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </form>
    </div>
  );
}

// Ödeme Formu
function PaymentForm({ translations }: { translations: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        {translations.payment || 'Payment Method'}
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <button 
            className="px-4 py-2 border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-md font-medium"
          >
            {translations.creditCard || 'Credit Card'}
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium"
          >
            PayPal
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.cardNumber || 'Card Number'}*
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.expiryDate || 'Expiry Date'}*
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {translations.securityCode || 'Security Code (CVV)'}*
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {translations.nameOnCard || 'Name on Card'}*
            </label>
            <input
              type="text"
              id="nameOnCard"
              name="nameOnCard"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Satın Alma Düğmesi ve Şartlar
function PlaceOrderSection({ translations }: { translations: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="termsAccepted"
          name="termsAccepted"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="termsAccepted" className="text-sm text-gray-700 dark:text-gray-300">
          {translations.termsCheckbox || 'I have read and agree to the'}{' '}
          <Link href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
            {translations.termsAndConditions || 'Terms and Conditions'}
          </Link>{' '}
          {translations.andThe || 'and the'}{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
            {translations.privacyPolicy || 'Privacy Policy'}
          </Link>
        </label>
      </div>
      
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {translations.placeOrder || 'Place Order'}
      </button>
      
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {translations.securePayment || 'Your payment information is secure. We use industry standard encryption to protect your data.'}
      </p>
      
      <div className="flex justify-center space-x-4 text-sm">
        <Link href="/help/payment" className="text-blue-600 hover:underline dark:text-blue-400">
          {translations.paymentHelp || 'Need help with payment?'}
        </Link>
        <Link href="/help/esim-setup" className="text-blue-600 hover:underline dark:text-blue-400">
          {translations.howToSetupEsim || 'How to set up your eSIM'}
        </Link>
      </div>
    </div>
  );
}

// Server component
export default async function CheckoutPage({ params, searchParams }: { params: { locale: string }, searchParams: { product?: string } }) {
  const { locale } = params;
  const productId = searchParams.product;
  
  const translations = await getTranslations(locale, 'checkout');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Oturum durumunu kontrol et
  const session = await getServerSession(authOptions);
  
  // Sepet verisini al (gerçek projede veritabanından gelebilir)
  const cartCookie = cookies().get('cart');
  let cartItems: { productId: string, quantity: number }[] = [];
  
  // Eğer URL'den bir ürün belirtilmişse, doğrudan onu kullan (Hızlı satın alma)
  if (productId) {
    const product = mockEsimProducts.find(p => p.id === productId);
    if (product) {
      cartItems = [{ productId, quantity: 1 }];
    }
  }
  // Değilse, sepetteki ürünleri kullan
  else if (cartCookie?.value) {
    try {
      cartItems = JSON.parse(cartCookie.value);
    } catch (e) {
      console.error('Failed to parse cart cookie:', e);
    }
  }
  
  // Sepet boşsa, sepet sayfasına yönlendir
  if (cartItems.length === 0) {
    redirect(`/${locale}/cart`);
  }
  
  // Ürünleri sepetteki öğelerle eşleştir
  const cartProducts = cartItems
    .map(item => {
      const product = mockEsimProducts.find(p => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(item => item !== null) as { product: typeof mockEsimProducts[0], quantity: number }[];
  
  // Sepet boşsa, sepet sayfasına yönlendir
  if (cartProducts.length === 0) {
    redirect(`/${locale}/cart`);
  }
  
  return (
    <TranslationProvider locale={locale} messages={{ ...translations, ...commonTranslations }}>
      <div className="container max-w-7xl px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8">{translations.checkoutPageTitle || 'Checkout'}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CustomerInfoForm translations={translations} />
            <PaymentForm translations={translations} />
            <PlaceOrderSection translations={translations} />
          </div>
          
          <div>
            <OrderSummary cartItems={cartProducts} translations={translations} />
          </div>
        </div>
      </div>
    </TranslationProvider>
  );
}
