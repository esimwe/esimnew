/**
 * Auth Actions Helper Functions
 * 
 * Bu dosya, authentication işlemleri için yardımcı fonksiyonlar içerir.
 */

/**
 * Signln fonksiyonu (NextAuth client-only signIn'in server tarafı alternatifi)
 * Server component'larda ve Server Action'larda kullanılabilir.
 */
export async function signIn(provider: string, credentials?: any) {
  // Server actions için bu fonksiyon sadece session oluşturmaz, 
  // bunun yerine login sonrası yönlendirme mantığını içerir.
  
  // Bu bir wrapper fonksiyondur, çünkü next-auth/react içindeki signIn
  // client tarafında çalışır ve server tarafında çalışmaz.
  
  // Bu dummy fonksiyon sadece interface olarak çalışır
  // Gerçek mantık auth-actions.ts içerisindedir.
  return credentials;
}
