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
    title: `${translations.dashboard || 'Dashboard'} | Admin | eSIM Store`,
    description: translations.adminDashboardDescription || 'Admin dashboard for eSIM Store',
  };
}

// İstatistik Kartı bileşeni
function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  isPositive 
}: { 
  title: string; 
  value: string | number; 
  change?: string | number; 
  icon: string; 
  isPositive?: boolean 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          
          {change && (
            <div className={`flex items-center mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-sm font-medium">
                {isPositive ? '+' : ''}{change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
          <span className="text-blue-600 dark:text-blue-300 text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// Son İşlemler bileşeni
function RecentTransactions({ translations }: { translations: any }) {
  // Bu örnek için mock veri
  const transactions = [
    { id: 1, user: 'user@example.com', amount: '$45.00', date: '2025-07-22', status: 'completed' },
    { id: 2, user: 'another@example.com', amount: '$29.99', date: '2025-07-21', status: 'pending' },
    { id: 3, user: 'third@example.com', amount: '$75.50', date: '2025-07-20', status: 'completed' },
    { id: 4, user: 'fourth@example.com', amount: '$120.00', date: '2025-07-19', status: 'completed' },
    { id: 5, user: 'fifth@example.com', amount: '$15.99', date: '2025-07-18', status: 'refunded' },
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {translations.recentTransactions || 'Recent Transactions'}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translations.user || 'User'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translations.amount || 'Amount'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translations.date || 'Date'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translations.status || 'Status'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          href="/admin/orders" 
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {translations.viewAllTransactions || 'View all transactions'} →
        </Link>
      </div>
    </div>
  );
}

// Admin Panel Sidebar
function AdminSidebar({ locale, translations }: { locale: string, translations: any }) {
  const menuItems = [
    { title: translations.dashboard || 'Dashboard', href: `/${locale}/admin/dashboard`, icon: '📊', active: true },
    { title: translations.users || 'Users', href: `/${locale}/admin/users`, icon: '👥' },
    { title: translations.orders || 'Orders', href: `/${locale}/admin/orders`, icon: '🛒' },
    { title: translations.products || 'Products', href: `/${locale}/admin/products`, icon: '📱' },
    { title: translations.translations || 'Translations', href: `/${locale}/admin/translations`, icon: '🌐' },
    { title: translations.settings || 'Settings', href: `/${locale}/admin/settings`, icon: '⚙️' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-indigo-800 text-white overflow-y-auto">
      <div className="p-6 border-b border-indigo-700">
        <h2 className="text-2xl font-bold">eSIM Admin</h2>
      </div>
      
      <nav className="mt-5">
        <div className="px-4 py-2 text-xs text-indigo-300 uppercase tracking-wider">
          {translations.mainMenu || 'Main Menu'}
        </div>
        <ul className="mt-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`block px-4 py-3 ${item.active 
                  ? 'bg-indigo-900 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700'}`}
              >
                <span className="inline-block w-6">{item.icon}</span> {item.title}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="px-4 py-2 mt-6 text-xs text-indigo-300 uppercase tracking-wider">
          {translations.account || 'Account'}
        </div>
        <ul className="mt-2">
          <li>
            <Link 
              href={`/${locale}`}
              className="block px-4 py-3 text-indigo-100 hover:bg-indigo-700"
            >
              <span className="inline-block w-6">🏠</span> {translations.backToSite || 'Back to Site'}
            </Link>
          </li>
          <li>
            <Link 
              href={`/${locale}/api/auth/signout`}
              className="block px-4 py-3 text-indigo-100 hover:bg-indigo-700"
            >
              <span className="inline-block w-6">🚪</span> {translations.logout || 'Logout'}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

// Server component
export default async function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const translations = await getTranslations(locale, 'admin');
  const commonTranslations = await getTranslations(locale, 'common');
  
  // Oturum durumunu kontrol et
  const session = await getServerSession(authOptions);
  
  // Kullanıcı giriş yapmamışsa veya admin rolü yoksa, admin giriş sayfasına yönlendir
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/admin/login`);
  }
  
  return (
    <>
      <AdminSidebar locale={locale} translations={translations} />
      
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {translations.dashboard || 'Dashboard'}
          </h1>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">
              {session.user.name || session.user.email}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title={translations.totalSales || 'Total Sales'} 
            value="$12,345.67" 
            change="12.5%" 
            icon="💰" 
            isPositive={true} 
          />
          <StatCard 
            title={translations.activeUsers || 'Active Users'} 
            value="1,234" 
            change="8.2%" 
            icon="👥" 
            isPositive={true} 
          />
          <StatCard 
            title={translations.newOrders || 'New Orders'} 
            value="28" 
            change="5" 
            icon="🛒" 
            isPositive={true} 
          />
          <StatCard 
            title={translations.conversionRate || 'Conversion Rate'} 
            value="3.2%" 
            change="0.5%" 
            icon="📊" 
            isPositive={false} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions translations={translations} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {translations.quickActions || 'Quick Actions'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <Link 
                href={`/${locale}/admin/users/create`}
                className="block w-full py-2 px-4 rounded text-center bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {translations.addNewUser || 'Add New User'}
              </Link>
              <Link 
                href={`/${locale}/admin/products/create`}
                className="block w-full py-2 px-4 rounded text-center bg-green-600 text-white hover:bg-green-700"
              >
                {translations.addNewProduct || 'Add New Product'}
              </Link>
              <Link 
                href={`/${locale}/admin/settings/system`}
                className="block w-full py-2 px-4 rounded text-center bg-gray-600 text-white hover:bg-gray-700"
              >
                {translations.systemSettings || 'System Settings'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
