/**
 * Yardımcı fonksiyonlar
 */

/**
 * Belirli uzunlukta rastgele alfanümerik bir dize oluşturur
 * @param length Oluşturulacak rastgele dizenin uzunluğu
 * @returns Rastgele alfanümerik dize
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Tarihi formatlar
 * @param date Tarih nesnesi veya ISO tarih dizesi
 * @param locale Dil kodu
 * @returns Formatlanmış tarih dizesi
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Para birimini formatlar
 * @param amount Miktar
 * @param currency Para birimi kodu
 * @param locale Dil kodu
 * @returns Formatlanmış para birimi dizesi
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * İki tarih arasındaki gün sayısını hesaplar
 * @param startDate Başlangıç tarihi
 * @param endDate Bitiş tarihi
 * @returns Gün sayısı
 */
export function daysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const differenceInTime = end.getTime() - start.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
}

/**
 * Belirli bir tarihin bugünden kaç gün önce olduğunu hesaplar
 * @param date Tarih
 * @returns Gün sayısı
 */
export function daysAgo(date: Date | string): number {
  return daysBetween(typeof date === 'string' ? new Date(date) : date, new Date());
}

/**
 * Metni kısaltır (belirli uzunluktan sonra ... ekler)
 * @param text Kısaltılacak metin
 * @param maxLength Maksimum uzunluk
 * @returns Kısaltılmış metin
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Veri boyutunu formatlar (bytes -> KB, MB, GB)
 * @param bytes Bayt cinsinden boyut
 * @returns Formatlanmış boyut dizesi
 */
export function formatDataSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Parolanın güvenlik düzeyini kontrol eder
 * @param password Parola
 * @returns Güvenlik düzeyi (1-5)
 */
export function checkPasswordStrength(password: string): number {
  let strength = 0;
  
  // Uzunluk kontrolü
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Karakter türleri
  if (/[a-z]/.test(password)) strength += 1; // Küçük harf
  if (/[A-Z]/.test(password)) strength += 1; // Büyük harf
  if (/[0-9]/.test(password)) strength += 1; // Rakam
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // Özel karakter
  
  return Math.min(5, strength);
}

/**
 * E-posta adresinin geçerliliğini kontrol eder
 * @param email E-posta adresi
 * @returns Geçerli mi?
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Bir diziyi belirli bir özelliğe göre gruplar
 * @param array Dizi
 * @param key Gruplama anahtarı
 * @returns Gruplandırılmış nesneler
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Belirli bir özelliğe göre bir diziyi sıralar
 * @param array Sıralanacak dizi
 * @param key Sıralama anahtarı
 * @param direction Sıralama yönü (asc veya desc)
 * @returns Sıralanmış dizi
 */
export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  const sorted = [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
}

/**
 * URL parametrelerini analiz eder
 * @param url URL
 * @returns Parametre nesnesi
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params = new URLSearchParams(url.split('?')[1]);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * Belirli bir metni HTML olarak güvenli hale getirir
 * @param html HTML içeren metin
 * @returns Güvenli metin
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
