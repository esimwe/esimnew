'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import { translate as translateHelper, localizeUrl } from '@/i18n';

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
  setLocale: (newLocale: string) => void;
  isRtl: boolean;
}

interface TranslationProviderProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, string>;
  rtl?: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({
  children,
  locale,
  messages,
  rtl = false
}: TranslationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isRtl, setIsRtl] = useState(rtl);
  
  // Dil değiştirme fonksiyonu
  const setLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Çerez ayarla
    setCookie('NEXT_LOCALE', newLocale, { maxAge: 60 * 60 * 24 * 365 }); // 1 yıl
    
    // Mevcut URL'yi yeni dile göre yeniden oluştur
    const newPathname = localizeUrl(pathname || '/', newLocale);
    
    // Sayfayı yönlendir
    router.push(newPathname);
    router.refresh();
  };
  
  // Çeviri fonksiyonu
  const t = (key: string, params?: Record<string, string | number>): string => {
    return translateHelper(messages, key, params);
  };
  
  // RTL değişikliklerini takip et
  useEffect(() => {
    setIsRtl(rtl);
    
    // RTL için document sınıfını ayarla
    if (rtl) {
      document.documentElement.classList.add('rtl');
      document.body.dir = 'rtl';
    } else {
      document.documentElement.classList.remove('rtl');
      document.body.dir = 'ltr';
    }
  }, [rtl]);
  
  return (
    <TranslationContext.Provider value={{ t, locale, setLocale, isRtl }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook: Çeviri bağlamını kullanmak için
export function useTranslation() {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  return context;
}
