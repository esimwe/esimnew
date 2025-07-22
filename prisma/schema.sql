-- eSIM Store Veritabanı Şeması (SQLite için optimize edilmiştir)
-- Turso veya herhangi bir SQLite tabanlı veritabanında kullanılabilir

-- Mevcut tabloları temizle (gerektiğinde)
PRAGMA foreign_keys = OFF;

-- Diller tablosu
CREATE TABLE IF NOT EXISTS "languages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "rtl" BOOLEAN NOT NULL DEFAULT false,
    "flagIcon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT UNIQUE,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "rewardBalance" DECIMAL(10, 2) DEFAULT 0,
    "referralCode" VARCHAR(8) UNIQUE,
    "referredBy" TEXT,
    "firstPurchase" BOOLEAN DEFAULT false,
    "verifyToken" TEXT,
    "verifyTokenExpiry" DATETIME,
    "membership" TEXT DEFAULT 'standard',
    "locale" TEXT DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Siparişler tablosu
CREATE TABLE IF NOT EXISTS "orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" TEXT,
    "orderid" TEXT UNIQUE,
    "orderstate" TEXT,
    "merchantid" TEXT,
    "externalid" TEXT,
    "currencycode" TEXT,
    "createdtime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedtime" DATETIME NOT NULL,
    "productid" TEXT,
    "productcategory" TEXT,
    "cost" DECIMAL(10, 2) NOT NULL,
    "title" TEXT,
    "provider" TEXT,
    "providerid" INTEGER,
    "providername" TEXT,
    "providerlogo" TEXT,
    "qrcode" TEXT,
    "phone" TEXT,
    "isrefundable" BOOLEAN DEFAULT false,
    "accesspointname" TEXT,
    "activationcode" TEXT,
    "smdpaddress" TEXT,
    "activationinstructions" VARCHAR(512),
    FOREIGN KEY ("userid") REFERENCES "users" ("id")
);

-- Referans tablosu
CREATE TABLE IF NOT EXISTS "referrals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "bonusAmount" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    FOREIGN KEY ("referrerId") REFERENCES "users" ("id"),
    FOREIGN KEY ("referredId") REFERENCES "users" ("id"),
    UNIQUE ("referrerId", "referredId")
);

-- Ödül geçmişi tablosu
CREATE TABLE IF NOT EXISTS "reward_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "description" TEXT,
    "balanceBefore" DECIMAL(10, 2) NOT NULL,
    "balanceAfter" DECIMAL(10, 2) NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin anahtarları tablosu
CREATE TABLE IF NOT EXISTS "admin_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "merchantId" TEXT,
    "apiKey" TEXT
);

-- Site başlık tablosu
CREATE TABLE IF NOT EXISTS "site_title" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT
);

-- Ülkeler tablosu
CREATE TABLE IF NOT EXISTS "countries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "region" TEXT,
    "flagUrl" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(50) DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Ürün kategorileri tablosu
CREATE TABLE IF NOT EXISTS "product_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "status" VARCHAR(50) DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sağlayıcılar tablosu
CREATE TABLE IF NOT EXISTS "providers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "apiEndpoint" TEXT,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "status" VARCHAR(50) DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "productId" TEXT NOT NULL UNIQUE,
    "providerId" INTEGER,
    "dataAmount" TEXT NOT NULL,
    "validityDays" INTEGER NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "discountPrice" DECIMAL(10, 2),
    "currencyCode" VARCHAR(3) DEFAULT 'USD',
    "countryId" INTEGER,
    "categoryId" INTEGER,
    "type" VARCHAR(50) DEFAULT 'country',
    "instructions" TEXT,
    "accessPointName" TEXT,
    "featured" BOOLEAN DEFAULT false,
    "status" VARCHAR(50) DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("providerId") REFERENCES "providers" ("id"),
    FOREIGN KEY ("countryId") REFERENCES "countries" ("id"),
    FOREIGN KEY ("categoryId") REFERENCES "product_categories" ("id")
);

-- Sistem ayarları tablosu
CREATE TABLE IF NOT EXISTS "system_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "referralBonusAmount" DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    "referralCodeLength" INTEGER NOT NULL DEFAULT 8,
    "minimumWithdrawal" DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    "defaultLocale" TEXT NOT NULL DEFAULT 'en',
    "updatedAt" DATETIME NOT NULL
);

-- Çeviri tabloları
CREATE TABLE IF NOT EXISTS "country_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "countryId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("languageCode") REFERENCES "languages" ("code") ON DELETE CASCADE,
    UNIQUE ("countryId", "languageCode")
);

CREATE TABLE IF NOT EXISTS "product_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("languageCode") REFERENCES "languages" ("code") ON DELETE CASCADE,
    UNIQUE ("productId", "languageCode")
);

CREATE TABLE IF NOT EXISTS "category_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    FOREIGN KEY ("categoryId") REFERENCES "product_categories" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("languageCode") REFERENCES "languages" ("code") ON DELETE CASCADE,
    UNIQUE ("categoryId", "languageCode")
);

CREATE TABLE IF NOT EXISTS "static_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "languageCode" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    FOREIGN KEY ("languageCode") REFERENCES "languages" ("code") ON DELETE CASCADE,
    UNIQUE ("languageCode", "namespace", "key")
);

-- Örnek veri girişleri
-- Diller
INSERT INTO "languages" ("id", "code", "name", "nativeName", "isActive", "isDefault", "rtl", "flagIcon", "createdAt", "updatedAt") 
VALUES 
('clm1a3b5600001', 'en', 'English', 'English', true, true, false, '🇬🇧', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clm1a3b5600002', 'tr', 'Turkish', 'Türkçe', true, false, false, '🇹🇷', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Admin kullanıcısı (şifre: admin123)
INSERT INTO "users" ("id", "name", "email", "password", "membership", "referralCode", "locale", "createdAt", "updatedAt")
VALUES
('clm1a3b5600003', 'Admin User', 'admin@example.com', '$2b$10$qiRmxMWYL4jL.Xf1bVG9m.j7EIJy0PU1O6BnEP9h1MlWl.SfPvAwa', 'admin', 'ADMIN123', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Test kullanıcısı (şifre: password123)
INSERT INTO "users" ("id", "name", "email", "password", "membership", "referralCode", "locale", "createdAt", "updatedAt")
VALUES
('clm1a3b5600004', 'Test User', 'user@example.com', '$2b$10$XFpDFJf4N.fB6GACL9aFN.HFrn1UYOUbK/xUEWN8vRfISLnGaRC7W', 'standard', 'TEST1234', 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sistem ayarları
INSERT INTO "system_settings" ("id", "referralBonusAmount", "referralCodeLength", "minimumWithdrawal", "defaultLocale", "updatedAt")
VALUES
(1, 10.00, 8, 50.00, 'en', CURRENT_TIMESTAMP);

-- Ülkeler
INSERT INTO "countries" ("id", "name", "code", "region", "isPopular", "createdAt", "updatedAt")
VALUES
(1, 'Global', 'GL', 'global', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Europe', 'EU', 'europe', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'USA', 'US', 'americas', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Ülke çevirileri
INSERT INTO "country_translations" ("id", "countryId", "languageCode", "name")
VALUES
('clm1a3b5600005', 1, 'en', 'Global'),
('clm1a3b5600006', 1, 'tr', 'Global'),
('clm1a3b5600007', 2, 'en', 'Europe'),
('clm1a3b5600008', 2, 'tr', 'Avrupa'),
('clm1a3b5600009', 3, 'en', 'United States'),
('clm1a3b5600010', 3, 'tr', 'Amerika Birleşik Devletleri');

-- Kategoriler
INSERT INTO "product_categories" ("id", "name", "slug", "createdAt")
VALUES
(1, 'Travel', 'travel', CURRENT_TIMESTAMP);

-- Kategori çevirileri
INSERT INTO "category_translations" ("id", "categoryId", "languageCode", "name")
VALUES
('clm1a3b5600011', 1, 'en', 'Travel'),
('clm1a3b5600012', 1, 'tr', 'Seyahat');

-- Sağlayıcılar
INSERT INTO "providers" ("id", "name", "logo", "apiEndpoint", "status", "createdAt")
VALUES
(1, 'Telco Vision', '/images/telco-vision-logo.png', 'https://api.telco-vision.co/v1', 'active', CURRENT_TIMESTAMP);

-- Ürünler
INSERT INTO "products" ("id", "title", "description", "productId", "providerId", "dataAmount", "validityDays", 
                       "price", "currencyCode", "countryId", "categoryId", "type", "featured", "status", "createdAt", "updatedAt")
VALUES
(1, 'Global Traveller', 'Perfect for worldwide travel. Stay connected across 190+ countries with our Global Traveller eSIM plan.', 
   'global-1', 1, '5GB', 30, 29.99, 'USD', 1, 1, 'global', true, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   
(2, 'Europe Explorer', 'Explore Europe without worrying about connectivity. Works seamlessly across all EU countries plus UK, Switzerland, and Norway.', 
   'europe-1', 1, '10GB', 15, 19.99, 'USD', 2, 1, 'regional', true, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   
(3, 'USA Unlimited', 'Unlimited data for your USA and Canada trip. Never worry about running out of data again with our truly unlimited plan.', 
   'usa-1', 1, 'Unlimited', 10, 24.99, 'USD', 3, 1, 'country', true, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Ürün çevirileri
INSERT INTO "product_translations" ("id", "productId", "languageCode", "title", "description")
VALUES
('clm1a3b5600013', 1, 'en', 'Global Traveller', 'Perfect for worldwide travel. Stay connected across 190+ countries with our Global Traveller eSIM plan.'),
('clm1a3b5600014', 1, 'tr', 'Global Gezgin', 'Dünya çapında seyahat için mükemmel. Global Gezgin eSIM planımızla 190+ ülkede bağlantıda kalın.'),
('clm1a3b5600015', 2, 'en', 'Europe Explorer', 'Explore Europe without worrying about connectivity. Works seamlessly across all EU countries plus UK, Switzerland, and Norway.'),
('clm1a3b5600016', 2, 'tr', 'Avrupa Kaşifi', 'Bağlantı endişesi olmadan Avrupa''yı keşfedin. Tüm AB ülkeleri, Birleşik Krallık, İsviçre ve Norveç''te sorunsuz çalışır.'),
('clm1a3b5600017', 3, 'en', 'USA Unlimited', 'Unlimited data for your USA and Canada trip. Never worry about running out of data again with our truly unlimited plan.'),
('clm1a3b5600018', 3, 'tr', 'ABD Sınırsız', 'ABD ve Kanada seyahatiniz için sınırsız veri. Gerçekten sınırsız planımızla verinin bitmesi konusunda endişelenmeyin.');

-- Statik çeviriler
INSERT INTO "static_translations" ("id", "languageCode", "namespace", "key", "value")
VALUES
-- Genel çeviriler
('clm1a3b5600019', 'en', 'common', 'home', 'Home'),
('clm1a3b5600020', 'tr', 'common', 'home', 'Ana Sayfa'),
('clm1a3b5600021', 'en', 'common', 'esims', 'eSIMs'),
('clm1a3b5600022', 'tr', 'common', 'esims', 'eSIM''ler'),
('clm1a3b5600023', 'en', 'common', 'login', 'Login'),
('clm1a3b5600024', 'tr', 'common', 'login', 'Giriş Yap'),
('clm1a3b5600025', 'en', 'common', 'register', 'Register'),
('clm1a3b5600026', 'tr', 'common', 'register', 'Kayıt Ol'),
('clm1a3b5600027', 'en', 'common', 'logout', 'Logout'),
('clm1a3b5600028', 'tr', 'common', 'logout', 'Çıkış Yap'),
('clm1a3b5600029', 'en', 'common', 'cart', 'Cart'),
('clm1a3b5600030', 'tr', 'common', 'cart', 'Sepet'),

-- eSIM sayfası için çeviriler
('clm1a3b5600031', 'en', 'esim', 'esimPageTitle', 'Browse eSIM Plans'),
('clm1a3b5600032', 'tr', 'esim', 'esimPageTitle', 'eSIM Planlarına Göz Atın'),
('clm1a3b5600033', 'en', 'esim', 'viewDetails', 'View Details'),
('clm1a3b5600034', 'tr', 'esim', 'viewDetails', 'Detayları Gör'),

-- Sepet sayfası için çeviriler
('clm1a3b5600035', 'en', 'cart', 'cartPageTitle', 'Your Shopping Cart'),
('clm1a3b5600036', 'tr', 'cart', 'cartPageTitle', 'Alışveriş Sepetiniz'),
('clm1a3b5600037', 'en', 'cart', 'proceedToCheckout', 'Proceed to Checkout'),
('clm1a3b5600038', 'tr', 'cart', 'proceedToCheckout', 'Ödemeye Geç');

-- Dış anahtar kısıtlamalarını yeniden etkinleştir
PRAGMA foreign_keys = ON;

-- Veritabanı oluşturma işlemi tamamlandı
SELECT 'eSIM Store veritabanı başarıyla oluşturuldu!' as result;
