// ReferralDashboard.tsx
'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/TranslationProvider';
import { formatCurrency, formatDate } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  referralCode?: string | null;
  rewardBalance?: number | null;
}

interface ReferredUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt: Date;
  firstPurchase?: boolean | null;
}

interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  status: string;
  bonusAmount: number;
  createdAt: Date;
  completedAt?: Date | null;
  referred: ReferredUser;
}

interface ReferralDashboardProps {
  user: User | null;
  referrals: Referral[];
  totalEarned: number;
  referralLink: string;
  bonusAmount: number;
}

export default function ReferralDashboard({ 
  user, 
  referrals, 
  totalEarned, 
  referralLink,
  bonusAmount 
}: ReferralDashboardProps) {
  const { t, locale } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  // Referans bağlantısını kopyala
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };
  
  if (!user) {
    return (
      <div className="p-6 text-center bg-gray-100 rounded-lg dark:bg-gray-800">
        <p>{t('referralLoginRequired')}</p>
        <Link href={`/${locale}/login`} className="mt-4 btn-primary">
          {t('login')}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Referans Özeti Kartı */}
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">{t('referralSummary')}</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900">
            <p className="text-sm text-blue-600 dark:text-blue-300">{t('totalReferrals')}</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">{referrals.length}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900">
            <p className="text-sm text-green-600 dark:text-green-300">{t('totalEarned')}</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-200">
              {formatCurrency(totalEarned, 'USD', locale)}
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg dark:bg-purple-900">
            <p className="text-sm text-purple-600 dark:text-purple-300">{t('currentBalance')}</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
              {formatCurrency(user.rewardBalance || 0, 'USD', locale)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Referans Linki */}
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">{t('yourReferralLink')}</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          {t('referralLinkDescription', { amount: formatCurrency(bonusAmount, 'USD', locale) })}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 p-2 overflow-hidden font-mono text-sm bg-gray-100 rounded dark:bg-gray-700 text-ellipsis whitespace-nowrap">
            {referralLink}
          </div>
          <button
            onClick={copyReferralLink}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>
      
      {/* Sosyal Paylaşım */}
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">{t('shareWithFriends')}</h2>
        
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(t('shareMessage', { link: referralLink }))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 space-x-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            <span>WhatsApp</span>
          </a>
          
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(t('shareMessage', { link: '' }))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            <span>Telegram</span>
          </a>
          
          <a
            href={`mailto:?subject=${encodeURIComponent(t('emailSubject'))}&body=${encodeURIComponent(t('shareMessage', { link: referralLink }))}`}
            className="flex items-center px-4 py-2 space-x-2 text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            <span>Email</span>
          </a>
          
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t('shareMessage', { link: referralLink }))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-400 rounded hover:bg-blue-500"
          >
            <span>Twitter</span>
          </a>
        </div>
      </div>
      
      {/* Referans Listesi */}
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">{t('yourReferrals')}</h2>
        
        {referrals.length === 0 ? (
          <div className="p-4 text-center bg-gray-50 rounded-lg dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-300">{t('noReferralsYet')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">{t('user')}</th>
                  <th className="p-3 text-left">{t('date')}</th>
                  <th className="p-3 text-left">{t('status')}</th>
                  <th className="p-3 text-right">{t('bonus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full">
                          {referral.referred.image ? (
                            <Image
                              src={referral.referred.image}
                              alt={referral.referred.name || 'User'}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-white bg-blue-500">
                              {(referral.referred.name || referral.referred.email || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {referral.referred.name || t('anonymousUser')}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {referral.referred.email || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-500 dark:text-gray-400">
                      {formatDate(referral.createdAt, locale)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          referral.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {referral.status === 'completed' ? t('completed') : t('pending')}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {referral.status === 'completed' ? (
                        <span className="text-green-600 dark:text-green-400">
                          {formatCurrency(referral.bonusAmount, 'USD', locale)}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          {formatCurrency(0, 'USD', locale)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Nasıl Çalışır */}
      <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-semibold">{t('howItWorks')}</h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-full">1</div>
            <h3 className="mb-2 text-lg font-medium">{t('shareYourLink')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('shareYourLinkDescription')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-full">2</div>
            <h3 className="mb-2 text-lg font-medium">{t('friendSignsUp')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('friendSignsUpDescription')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white bg-blue-600 rounded-full">3</div>
            <h3 className="mb-2 text-lg font-medium">{t('earnRewards')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('earnRewardsDescription', { amount: formatCurrency(bonusAmount, 'USD', locale) })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
