import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from '@/i18n';
import { extractLocaleFromPathname } from '@/i18n';

function getLocaleFromHeaders(request: NextRequest): string {
  // Accept-Language başlığını al
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  // Negotiator ile dil tercihini belirle
  let languages: string[] = [];
  try {
    languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  } catch (error) {
    console.error('Negotiator error:', error);
    return defaultLocale;
  }

  try {
    // Tercih edilen dili locale listesinden eşleştir
    return matchLocale(languages, locales, defaultLocale);
  } catch (error) {
    console.error('matchLocale error:', error);
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Admin paneli ve API rotalarını yoksay
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.includes('.') // Statik dosyaları atla (favicon.ico, vs.)
  ) {
    return NextResponse.next();
  }

  // Mevcut URL'den dil kodunu çıkar
  const { locale, pathname: pathnameWithoutLocale } = extractLocaleFromPathname(pathname);
  
  // Eğer URL'de bir dil kodu yoksa veya geçersizse
  if (!locale || !locales.includes(locale)) {
    // Kullanıcının tercih ettiği dili belirle
    let detectedLocale = getLocaleFromHeaders(request);
    
    // Çerezden tercihi kontrol et (eğer kullanıcı daha önce seçmiş ise)
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (localeCookie && locales.includes(localeCookie)) {
      detectedLocale = localeCookie;
    }
    
    // Doğru dil kodu ile yeni URL oluştur
    const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
    
    // Eğer bu bir GET isteği ise yönlendir
    if (request.method.toLowerCase() === 'get') {
      return NextResponse.redirect(newUrl);
    }
    
    // Değilse, isteği dil kodlu rotaya yeniden yazma
    return NextResponse.rewrite(newUrl);
  }
  
  // Dil kodu zaten URL'de varsa, isteğe devam et
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Tüm yolları eşleştir ama aşağıdakileri hariç tut
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
