# eSIM Store Platform

Modern eSIM satış platformu - Telco-vision.co API entegrasyonu ile

## Proje Özellikleri

- 📱 eSIM ürünlerinin listesi ve satışı
- 🌐 Çoklu dil desteği (i18n)
- 💰 Referans sistemi - arkadaş davet programı
- 🛒 Sepet ve ödeme işlemleri
- 👤 Kullanıcı hesapları ve yönetimi
- 📊 Admin paneli ve istatistikler
- 🎨 Modern ve duyarlı arayüz (Tailwind CSS)
- 🔒 Güvenli kimlik doğrulama (NextAuth.js)

## Teknolojiler

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Veritabanı**: PostgreSQL
- **Kimlik Doğrulama**: NextAuth.js
- **API Entegrasyonu**: Telco-vision.co API
- **Dil Desteği**: i18n, URL tabanlı dil parametreleri

## Kurulum

### Gereksinimler

- Node.js 18.0 veya üzeri
- PostgreSQL veritabanı
- Telco-vision.co API anahtarı

### Adımlar

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/esim-store.git
   cd esim-store
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Çevre değişkenlerini ayarlayın:
   `.env` dosyasını düzenleyin:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/esimdb"
   NEXTAUTH_SECRET="secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   TELCO_VISION_API_KEY="your-api-key"
   TELCO_VISION_API_URL="https://api.telco-vision.co"
   ```

4. Veritabanı şemasını oluşturun:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

6. Tarayıcınızda `http://localhost:3000` adresine gidin.

## Proje Yapısı

```
clean-esim/
├── public/             # Statik dosyalar
├── prisma/
│   └── schema.prisma   # Veritabanı modeli
├── src/
│   ├── app/
│   │   ├── [locale]/   # Dil bazlı sayfalar
│   │   │   ├── admin/  # Yönetici arayüzü
│   │   │   ├── esim/   # eSIM sayfaları
│   │   │   ├── cart/   # Sepet sayfaları
│   │   │   └── ...     # Diğer sayfalar
│   │   ├── layout.tsx  # Ana layout
│   │   ├── globals.css # Global stiller
│   │   └── page.tsx    # Kök sayfa
│   ├── components/     # UI bileşenleri
│   ├── i18n/           # Dil sistemi
│   ├── lib/            # Yardımcı kütüphaneler
│   ├── middleware.ts   # Next.js middleware
│   └── utils/          # Yardımcı fonksiyonlar
└── ...                 # Yapılandırma dosyaları
```

## Sayfalar

- `/[locale]` - Ana sayfa
- `/[locale]/esim` - eSIM listesi
- `/[locale]/esim/[id]` - eSIM detay sayfası
- `/[locale]/cart` - Alışveriş sepeti
- `/[locale]/checkout` - Ödeme sayfası
- `/[locale]/login` - Kullanıcı girişi
- `/[locale]/register` - Kullanıcı kaydı
- `/[locale]/referral` - Referans programı
- `/[locale]/admin/login` - Admin girişi
- `/[locale]/admin/dashboard` - Admin panosu
- `/[locale]/admin/users` - Kullanıcı yönetimi
- `/[locale]/admin/orders` - Sipariş yönetimi
- `/[locale]/admin/translations` - Çeviri yönetimi
- `/[locale]/admin/settings` - Sistem ayarları

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni özellik dalı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Dalınızı push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

Proje Sahibi - [E-posta adresiniz](mailto:emailiniz@example.com)

Proje Linki: [https://github.com/KULLANICI_ADINIZ/esim-store](https://github.com/KULLANICI_ADINIZ/esim-store)
