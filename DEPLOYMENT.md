# GitHub ve Vercel Deployment Rehberi

Bu rehber, eSIM Store projesini GitHub'a yüklemek ve Vercel'de deploy etmek için gereken adımları açıklar.

## GitHub'a Yükleme

### 1. GitHub'da Yeni Repo Oluşturma

1. [GitHub](https://github.com/) hesabınıza giriş yapın
2. Sağ üst köşedeki "+" işaretine tıklayın ve "New repository" seçin
3. Repository ismi olarak "esim-store" girin
4. Açıklama ekleyin: "Modern eSIM satış platformu"
5. Repo'yu "Public" olarak ayarlayın
6. "Initialize this repository with a README" seçeneğini işaretlemeyin
7. "Create repository" düğmesine tıklayın

### 2. Yerel Projeyi GitHub'a Yükleme

GitHub repo'nuzu oluşturduktan sonra, komut satırında aşağıdaki komutları çalıştırın:

```bash
# clean-esim klasörüne gidin
cd C:\Users\black\Desktop\clean-esim

# Git repo'sunu başlatın
git init

# Tüm dosyaları staging area'ya ekleyin
git add .

# İlk commit'i oluşturun
git commit -m "Initial commit"

# GitHub repo'nuzu uzak repo olarak ekleyin (KULLANICI_ADINIZ kısmını GitHub kullanıcı adınızla değiştirin)
git remote add origin https://github.com/KULLANICI_ADINIZ/esim-store.git

# Yerel repo'nuzu GitHub'a push edin
git push -u origin main
```

Not: Eğer main branch yerine master branch kullanıyorsanız, son komutu `git push -u origin master` olarak değiştirin.

## Vercel'de Deploy Etme

### 1. Vercel Hesabı Oluşturma

1. [Vercel](https://vercel.com/) web sitesine gidin
2. GitHub hesabınızla oturum açın

### 2. Yeni Proje Oluşturma

1. Vercel Dashboard'dan "New Project" butonuna tıklayın
2. "Import Git Repository" bölümünden GitHub hesabınızı seçin
3. GitHub repo'larınız listelenecektir, "esim-store" repo'sunu seçin
4. Proje ayarlarında:
   - Framework Preset olarak "Next.js" seçin
   - Build komutunu varsayılan (`next build`) olarak bırakın
   - Root Directory olarak varsayılan (`.`) olarak bırakın

### 3. Çevre Değişkenlerini Ayarlama

"Environment Variables" bölümünde aşağıdaki değişkenleri ekleyin:

```
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=a_random_string_for_nextauth
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
TELCO_VISION_API_KEY=your_api_key
TELCO_VISION_API_URL=https://api.telco-vision.co
```

### 4. Deploy Etme

1. Tüm ayarlar tamamlandıktan sonra "Deploy" düğmesine tıklayın
2. Vercel, projenizi build edecek ve deploy edecek
3. Deploy tamamlandığında, projenizi görüntülemek için verilen URL'yi kullanabilirsiniz

### 5. Özel Alan Adı Ekleme (İsteğe Bağlı)

1. Vercel Dashboard'da projenizi seçin
2. "Settings" > "Domains" bölümüne gidin
3. Özel alan adınızı ekleyin ve DNS ayarlarını yapılandırın

## Otomatik Deploy Ayarları

Varsayılan olarak, Vercel GitHub repo'nuzdaki her değişikliği otomatik olarak deploy eder:

- `main` branch'e push edilen her commit otomatik olarak production ortamına deploy edilir
- Pull Request'ler için önizleme ortamları oluşturulur

## Sorun Giderme

- **Build Hataları**: Vercel Dashboard'da "Deployments" bölümünden build loglarını kontrol edin
- **API Hataları**: Vercel Dashboard'da "Logs" bölümünden runtime loglarını inceleyin
- **Çevre Değişkenleri Sorunları**: "Settings" > "Environment Variables" bölümünden çevre değişkenlerinin doğru ayarlandığından emin olun

## Yararlı Kaynaklar

- [Vercel Dokümantasyonu](https://vercel.com/docs)
- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [GitHub Dokümantasyonu](https://docs.github.com/en)
