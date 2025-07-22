import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

// Kök sayfa, tarayıcı dilini algılayarak veya varsayılan dili kullanarak yönlendirme yapar
// Bu sayfayı kullanıcılar doğrudan görmeyecek, otomatik olarak ilgili dil sayfasına yönlendirilecekler
export default function RootPage() {
  // Varsayılan olarak defaultLocale'e yönlendir
  // Gerçek yönlendirme işlemi middleware.ts dosyasında yapılır
  redirect(`/${defaultLocale}`);
  
  // Bu kısım hiçbir zaman çalışmayacak, sadece TypeScript/React gereksinimleri için
  return null;
}
