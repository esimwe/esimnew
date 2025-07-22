import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Dilleri oluştur
  const english = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      isActive: true,
      isDefault: true,
      flagIcon: '🇬🇧',
    },
  });

  const turkish = await prisma.language.upsert({
    where: { code: 'tr' },
    update: {},
    create: {
      code: 'tr',
      name: 'Turkish',
      nativeName: 'Türkçe',
      isActive: true,
      isDefault: false,
      flagIcon: '🇹🇷',
    },
  });

  // Admin kullanıcısı oluştur
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      membership: 'admin',
      referralCode: 'ADMIN123',
      locale: 'en',
    },
  });

  // Test kullanıcısı oluştur
  const testPassword = await hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: testPassword,
      membership: 'standard',
      referralCode: 'TEST1234',
      locale: 'en',
    },
  });

  // Sistem ayarlarını oluştur
  const settings = await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      referralBonusAmount: 10.00,
      referralCodeLength: 8,
      minimumWithdrawal: 50.00,
      defaultLocale: 'en',
    },
  });

  // Ülkeleri oluştur
  const global = await prisma.country.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Global',
      code: 'GL',
      region: 'global',
      isPopular: true,
      translations: {
        create: [
          {
            languageCode: 'en',
            name: 'Global',
          },
          {
            languageCode: 'tr',
            name: 'Global',
          },
        ],
      },
    },
  });

  const europe = await prisma.country.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Europe',
      code: 'EU',
      region: 'europe',
      isPopular: true,
      translations: {
        create: [
          {
            languageCode: 'en',
            name: 'Europe',
          },
          {
            languageCode: 'tr',
            name: 'Avrupa',
          },
        ],
      },
    },
  });

  const usa = await prisma.country.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'USA',
      code: 'US',
      region: 'americas',
      isPopular: true,
      translations: {
        create: [
          {
            languageCode: 'en',
            name: 'United States',
          },
          {
            languageCode: 'tr',
            name: 'Amerika Birleşik Devletleri',
          },
        ],
      },
    },
  });

  // Kategorileri oluştur
  const travelCategory = await prisma.productCategory.upsert({
    where: { slug: 'travel' },
    update: {},
    create: {
      name: 'Travel',
      slug: 'travel',
      translations: {
        create: [
          {
            languageCode: 'en',
            name: 'Travel',
          },
          {
            languageCode: 'tr',
            name: 'Seyahat',
          },
        ],
      },
    },
  });

  // Sağlayıcıları oluştur
  const provider = await prisma.provider.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Telco Vision',
      logo: '/images/telco-vision-logo.png',
      apiEndpoint: 'https://api.telco-vision.co/v1',
      status: 'active',
    },
  });

  // Ürünleri oluştur
  const globalEsim = await prisma.product.upsert({
    where: { productId: 'global-1' },
    update: {},
    create: {
      title: 'Global Traveller',
      description: 'Perfect for worldwide travel. Stay connected across 190+ countries with our Global Traveller eSIM plan.',
      productId: 'global-1',
      providerId: provider.id,
      dataAmount: '5GB',
      validityDays: 30,
      price: 29.99,
      currencyCode: 'USD',
      countryId: global.id,
      categoryId: travelCategory.id,
      type: 'global',
      featured: true,
      status: 'active',
      translations: {
        create: [
          {
            languageCode: 'en',
            title: 'Global Traveller',
            description: 'Perfect for worldwide travel. Stay connected across 190+ countries with our Global Traveller eSIM plan.',
          },
          {
            languageCode: 'tr',
            title: 'Global Gezgin',
            description: 'Dünya çapında seyahat için mükemmel. Global Gezgin eSIM planımızla 190+ ülkede bağlantıda kalın.',
          },
        ],
      },
    },
  });

  const europeEsim = await prisma.product.upsert({
    where: { productId: 'europe-1' },
    update: {},
    create: {
      title: 'Europe Explorer',
      description: 'Explore Europe without worrying about connectivity. Works seamlessly across all EU countries plus UK, Switzerland, and Norway.',
      productId: 'europe-1',
      providerId: provider.id,
      dataAmount: '10GB',
      validityDays: 15,
      price: 19.99,
      currencyCode: 'USD',
      countryId: europe.id,
      categoryId: travelCategory.id,
      type: 'regional',
      featured: true,
      status: 'active',
      translations: {
        create: [
          {
            languageCode: 'en',
            title: 'Europe Explorer',
            description: 'Explore Europe without worrying about connectivity. Works seamlessly across all EU countries plus UK, Switzerland, and Norway.',
          },
          {
            languageCode: 'tr',
            title: 'Avrupa Kaşifi',
            description: 'Bağlantı endişesi olmadan Avrupa\'yı keşfedin. Tüm AB ülkeleri, Birleşik Krallık, İsviçre ve Norveç\'te sorunsuz çalışır.',
          },
        ],
      },
    },
  });

  const usaEsim = await prisma.product.upsert({
    where: { productId: 'usa-1' },
    update: {},
    create: {
      title: 'USA Unlimited',
      description: 'Unlimited data for your USA and Canada trip. Never worry about running out of data again with our truly unlimited plan.',
      productId: 'usa-1',
      providerId: provider.id,
      dataAmount: 'Unlimited',
      validityDays: 10,
      price: 24.99,
      currencyCode: 'USD',
      countryId: usa.id,
      categoryId: travelCategory.id,
      type: 'country',
      featured: true,
      status: 'active',
      translations: {
        create: [
          {
            languageCode: 'en',
            title: 'USA Unlimited',
            description: 'Unlimited data for your USA and Canada trip. Never worry about running out of data again with our truly unlimited plan.',
          },
          {
            languageCode: 'tr',
            title: 'ABD Sınırsız',
            description: 'ABD ve Kanada seyahatiniz için sınırsız veri. Gerçekten sınırsız planımızla verinin bitmesi konusunda endişelenmeyin.',
          },
        ],
      },
    },
  });

  // Çevirileri oluştur
  // SQLite, createMany ile skipDuplicates'i desteklemediği için tek tek ekleyelim
  const translations = [
    // Genel çeviriler
    { languageCode: 'en', namespace: 'common', key: 'home', value: 'Home' },
    { languageCode: 'tr', namespace: 'common', key: 'home', value: 'Ana Sayfa' },
    { languageCode: 'en', namespace: 'common', key: 'esims', value: 'eSIMs' },
    { languageCode: 'tr', namespace: 'common', key: 'esims', value: 'eSIM\'ler' },
    { languageCode: 'en', namespace: 'common', key: 'login', value: 'Login' },
    { languageCode: 'tr', namespace: 'common', key: 'login', value: 'Giriş Yap' },
    { languageCode: 'en', namespace: 'common', key: 'register', value: 'Register' },
    { languageCode: 'tr', namespace: 'common', key: 'register', value: 'Kayıt Ol' },
    { languageCode: 'en', namespace: 'common', key: 'logout', value: 'Logout' },
    { languageCode: 'tr', namespace: 'common', key: 'logout', value: 'Çıkış Yap' },
    { languageCode: 'en', namespace: 'common', key: 'cart', value: 'Cart' },
    { languageCode: 'tr', namespace: 'common', key: 'cart', value: 'Sepet' },
    
    // eSIM sayfası için çeviriler
    { languageCode: 'en', namespace: 'esim', key: 'esimPageTitle', value: 'Browse eSIM Plans' },
    { languageCode: 'tr', namespace: 'esim', key: 'esimPageTitle', value: 'eSIM Planlarına Göz Atın' },
    { languageCode: 'en', namespace: 'esim', key: 'viewDetails', value: 'View Details' },
    { languageCode: 'tr', namespace: 'esim', key: 'viewDetails', value: 'Detayları Gör' },
    
    // Sepet sayfası için çeviriler
    { languageCode: 'en', namespace: 'cart', key: 'cartPageTitle', value: 'Your Shopping Cart' },
    { languageCode: 'tr', namespace: 'cart', key: 'cartPageTitle', value: 'Alışveriş Sepetiniz' },
    { languageCode: 'en', namespace: 'cart', key: 'proceedToCheckout', value: 'Proceed to Checkout' },
    { languageCode: 'tr', namespace: 'cart', key: 'proceedToCheckout', value: 'Ödemeye Geç' },
  ];

  // Her çeviriyi tek tek ekle
  for (const translation of translations) {
    await prisma.staticTranslation.upsert({
      where: {
        languageCode_namespace_key: {
          languageCode: translation.languageCode,
          namespace: translation.namespace,
          key: translation.key
        }
      },
      update: { value: translation.value },
      create: translation
    });
  }

  console.log('Seed verileri başarıyla eklendi');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
