# Yüzücü Performans Takip Uygulaması

Yüzme kulüplerinin sporcularının yarış performanslarını takip etme, görselleştirme ve baraj değerlendirmesi yapma uygulaması.

## Başlangıç

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

### Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.local` dosyası oluşturun ve Supabase bilgilerinizi ekleyin:
```bash
cp .env.local.example .env.local
```

3. Supabase migration dosyalarını çalıştırın (supabase/ klasöründeki README'ye bakın)

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

### Giriş Bilgileri

Şifre: `2025`

## Özellikler

- Sporcu yönetimi (ekleme, düzenleme, listeleme)
- Yarış derecesi kaydetme ve takibi
- Performans grafikleri
- Baraj yönetimi (baraj değerlerini tanımlama ve düzenleme)
- Baraj değerlendirmeleri
- 25m ve 50m havuz tipi desteği
- 16 farklı yüzme stili

## Teknolojiler

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- Recharts
- React Hook Form + Zod

## Test

```bash
npm test
```

## Lisans

MIT
