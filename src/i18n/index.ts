// React 18 için cache fonksiyonu
function clientCache<T>(fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T> {
  const cache = new Map();
  
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
}

const cache = clientCache;
import { languageService } from '@/lib/language-service';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Desteklenen diller
// Not: Bu liste dinamik olarak veritabanından gelecek, ancak başlangıç için statik tanımlıyoruz
export const defaultLocale = 'en';
export const locales = ['en', 'es', 'fr', 'it', 'de', 'tr', 'ru', 'ar', 'zh', 'ja', 'ko'];

// Çevirilerin önbelleğe alınmasını sağlayan fonksiyon
export const getTranslations = cache(async (locale: string, namespace = 'common') => {
  try {
    // Varsayılan dil için çevirileri al
    const defaultTranslations = await languageService.getTranslations(defaultLocale, namespace);
    
    // Eğer seçilen dil varsayılan dil değilse, o dildeki çevirileri de al
    let translations = defaultTranslations;
    if (locale !== defaultLocale) {
      const localeTranslations = await languageService.getTranslations(locale, namespace);
      
      // Varsayılan çevirilerle birleştir (çevrilmemiş metinler için fallback)
      translations = { ...defaultTranslations, ...localeTranslations };
    }
    
    return translations;
  } catch (error) {
    console.error(`Error loading translations for ${locale}/${namespace}:`, error);
    return {};
  }
});

// İstek başlıklarından tercih edilen dili tespit etme
export function getLocaleFromHeaders(headers: Headers): string {
  // Accept-Language başlığını al
  const acceptLanguage = headers.get('accept-language');
  
  if (!acceptLanguage) return defaultLocale;
  
  // Negotiator ile dil tercihini belirle
  const languages = new Negotiator({
    headers: {
      'accept-language': acceptLanguage,
    },
  }).languages();
  
  return match(languages, locales, defaultLocale);
}

// URL'den dil parametresini çıkarma
export function extractLocaleFromPathname(pathname: string): {
  locale: string;
  pathname: string;
} {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  
  if (segments.length > 1 && locales.includes(maybeLocale)) {
    return {
      locale: maybeLocale,
      pathname: `/${segments.slice(2).join('/')}`,
    };
  }
  
  return {
    locale: defaultLocale,
    pathname,
  };
}

// Çeviriler için yardımcı fonksiyonlar
export function translate(
  messages: Record<string, string>,
  key: string,
  params?: Record<string, string | number>
): string {
  let text = messages[key] || key;
  
  // Parametreleri yerleştir
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    });
  }
  
  return text;
}

// Dinamik olarak desteklenen dilleri veritabanından alma
export async function getSupportedLocales() {
  try {
    const languages = await languageService.getSupportedLocales();
    return languages.map(lang => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      rtl: lang.rtl || false,
      flagIcon: lang.flagIcon
    }));
  } catch (error) {
    console.error('Error fetching supported locales:', error);
    // Fallback: temel dilleri statik olarak döndür
    return [
      { code: 'en', name: 'English', nativeName: 'English', rtl: false },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },
      { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
      { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
      { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
    ];
  }
}

// URL'ye dil parametresi ekleme
export function localizeUrl(url: string, locale: string): string {
  if (!url) return `/${locale}`;
  
  // URL'nin başında / olup olmadığını kontrol et
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  // Eğer URL zaten bir dil kodu ile başlıyorsa, onu değiştir
  const segments = normalizedUrl.split('/').filter(Boolean);
  
  if (segments.length > 0 && locales.includes(segments[0])) {
    return `/${locale}${normalizedUrl.substring(segments[0].length + 1)}`;
  }
  
  // Aksi takdirde URL'nin başına dil kodunu ekle
  return `/${locale}${normalizedUrl}`;
}
