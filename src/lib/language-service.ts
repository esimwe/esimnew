import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Dil hizmetleri için yardımcı fonksiyonlar
 */
export const languageService = {
  /**
   * Tüm aktif dilleri getirir
   * @returns Aktif dillerin listesi
   */
  async getActiveLanguages() {
    try {
      return await prisma.language.findMany({
        where: { isActive: true },
        orderBy: [
          { isDefault: 'desc' },
          { name: 'asc' }
        ]
      });
    } catch (error) {
      console.error('Error fetching active languages:', error);
      return [];
    }
  },

  /**
   * Varsayılan dil kodunu getirir
   * @returns Varsayılan dil kodu
   */
  async getDefaultLanguageCode() {
    try {
      const defaultLang = await prisma.language.findFirst({
        where: { isDefault: true }
      });
      
      if (defaultLang) {
        return defaultLang.code;
      }
      
      // Varsayılan dil bulunamazsa sistem ayarlarından kontrol et
      const settings = await prisma.systemSettings.findFirst();
      return settings?.defaultLocale || 'en';
    } catch (error) {
      console.error('Error fetching default language:', error);
      return 'en';
    }
  },

  /**
   * Belirli bir dil için statik çevirileri yükler
   * @param languageCode Dil kodu
   * @param namespace Çeviri alanı (common, checkout vb.)
   * @returns Çeviri nesnesi
   */
  async getTranslations(languageCode: string, namespace = 'common') {
    try {
      const translations = await prisma.staticTranslation.findMany({
        where: {
          languageCode,
          namespace
        }
      });
      
      // Anahtar-değer formatına dönüştür
      return translations.reduce((result, item) => {
        result[item.key] = item.value;
        return result;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error(`Error fetching translations for ${languageCode}/${namespace}:`, error);
      return {};
    }
  },

  /**
   * Ürün çevirilerini getir
   * @param productId Ürün ID
   * @param languageCode Dil kodu
   * @returns Çevrilmiş ürün verileri
   */
  async getProductTranslation(productId: number, languageCode: string) {
    try {
      return await prisma.productTranslation.findUnique({
        where: {
          productId_languageCode: {
            productId,
            languageCode
          }
        }
      });
    } catch (error) {
      console.error(`Error fetching product translation for ${productId} in ${languageCode}:`, error);
      return null;
    }
  },

  /**
   * Ülke çevirilerini getir
   * @param countryId Ülke ID
   * @param languageCode Dil kodu
   * @returns Çevrilmiş ülke verileri
   */
  async getCountryTranslation(countryId: number, languageCode: string) {
    try {
      return await prisma.countryTranslation.findUnique({
        where: {
          countryId_languageCode: {
            countryId,
            languageCode
          }
        }
      });
    } catch (error) {
      console.error(`Error fetching country translation for ${countryId} in ${languageCode}:`, error);
      return null;
    }
  },

  /**
   * Dil ekle veya güncelle
   * @param languageData Dil verileri
   * @returns Eklenen veya güncellenen dil
   */
  async upsertLanguage(languageData: {
    code: string;
    name: string;
    nativeName: string;
    isActive?: boolean;
    isDefault?: boolean;
    rtl?: boolean;
    flagIcon?: string;
  }) {
    try {
      // Eğer yeni dil varsayılan olarak işaretlenirse, diğer varsayılan dili kaldır
      if (languageData.isDefault) {
        await prisma.language.updateMany({
          where: { isDefault: true },
          data: { isDefault: false }
        });
      }
      
      return await prisma.language.upsert({
        where: { code: languageData.code },
        update: languageData,
        create: languageData
      });
    } catch (error) {
      console.error(`Error upserting language ${languageData.code}:`, error);
      throw error;
    }
  },

  /**
   * Çeviri ekle veya güncelle
   * @param translationData Çeviri verileri
   * @returns Eklenen veya güncellenen çeviri
   */
  async upsertTranslation(translationData: {
    languageCode: string;
    namespace: string;
    key: string;
    value: string;
  }) {
    try {
      return await prisma.staticTranslation.upsert({
        where: {
          languageCode_namespace_key: {
            languageCode: translationData.languageCode,
            namespace: translationData.namespace,
            key: translationData.key
          }
        },
        update: { value: translationData.value },
        create: translationData
      });
    } catch (error) {
      console.error(`Error upserting translation ${translationData.key}:`, error);
      throw error;
    }
  },

  /**
   * Toplu çeviri içe aktarma
   * @param languageCode Dil kodu
   * @param namespace Alan adı
   * @param translations Çeviriler nesnesi
   */
  async importTranslations(
    languageCode: string,
    namespace: string,
    translations: Record<string, string>
  ) {
    try {
      const operations = Object.entries(translations).map(([key, value]) => {
        return prisma.staticTranslation.upsert({
          where: {
            languageCode_namespace_key: {
              languageCode,
              namespace,
              key
            }
          },
          update: { value },
          create: {
            languageCode,
            namespace,
            key,
            value
          }
        });
      });
      
      await prisma.$transaction(operations);
      return { success: true, count: operations.length };
    } catch (error) {
      console.error(`Error importing translations for ${languageCode}/${namespace}:`, error);
      throw error;
    }
  },

  /**
   * Tüm desteklenen dilleri ve bölgeleri getirir
   * @returns Desteklenen diller ve bölgeler nesnesi
   */
  async getSupportedLocales() {
    try {
      const languages = await prisma.language.findMany({
        where: { isActive: true },
        select: {
          code: true,
          name: true,
          nativeName: true,
          rtl: true,
          flagIcon: true
        },
        orderBy: [
          { isDefault: 'desc' },
          { name: 'asc' }
        ]
      });
      
      return languages;
    } catch (error) {
      console.error('Error fetching supported locales:', error);
      return [];
    }
  }
};

export default languageService;
