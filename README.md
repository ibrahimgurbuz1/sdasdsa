# # 💇‍♀️ Demir Güzellik Salonu - Yönetim Paneli

Modern ve gelişmiş bir güzellik salonu yönetim sistemi. Next.js 14, React, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## ✨ Özellikler

### 📊 Dashboard
- Gerçek zamanlı istatistikler ve grafikler
- Günlük/aylık gelir analizi
- Randevu durumu takibi
- Personel performans özeti

### 📅 Randevu Yönetimi
- Kapsamlı randevu takibi
- Randevu oluşturma ve düzenleme
- Durum yönetimi (Onaylandı, Bekliyor, Tamamlandı, İptal)
- Filtreleme ve arama özellikleri

### 💼 Hizmet Yönetimi
- Hizmet kategorileri
- Fiyat ve süre yönetimi
- Hizmet açıklamaları
- Görsel hizmet kartları

### 👥 Müşteri Yönetimi
- Detaylı müşteri profilleri
- Ziyaret geçmişi
- Harcama takibi
- Müşteri memnuniyet puanları

### 👨‍💼 Personel Yönetimi
- Çalışan profilleri
- Performans takibi
- Komisyon hesaplama
- Randevu sayısı ve gelir istatistikleri

### ⚙️ Ayarlar
- Genel salon ayarları
- Çalışma saatleri
- Fiyatlandırma yapılandırması
- Bildirim tercihleri
- Görünüm özelleştirme
- Güvenlik ayarları

## 🚀 Teknolojiler

- **Framework:** Next.js 14
- **UI Library:** React 18
- **Stil:** Tailwind CSS
- **Dil:** TypeScript
- **İkonlar:** React Icons
- **Grafikler:** Recharts
- **Tarih İşlemleri:** date-fns

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda açın:
```
http://localhost:3000
```

## 🏗️ Proje Yapısı

```
/
├── app/
│   ├── admin/
│   │   ├── appointments/     # Randevu yönetimi
│   │   ├── customers/        # Müşteri yönetimi
│   │   ├── dashboard/        # Ana dashboard
│   │   ├── services/         # Hizmet yönetimi
│   │   ├── staff/           # Personel yönetimi
│   │   ├── settings/        # Ayarlar
│   │   └── layout.tsx       # Admin layout
│   ├── globals.css          # Global stiller
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Ana sayfa
├── public/                  # Statik dosyalar
├── next.config.js          # Next.js yapılandırması
├── tailwind.config.ts      # Tailwind yapılandırması
├── tsconfig.json           # TypeScript yapılandırması
└── package.json            # Proje bağımlılıkları
```

## 🎨 Tasarım Özellikleri

- **Modern Gradient Tasarım:** Purple-pink gradient tema
- **Responsive:** Tüm cihazlarda mükemmel görünüm
- **Smooth Animations:** Profesyonel geçiş efektleri
- **Clean UI:** Minimalist ve kullanıcı dostu arayüz
- **Dark Mode Ready:** Koyu mod desteği hazır
- **Accessibility:** Erişilebilirlik standartlarına uygun

## 📱 Sayfa Yapısı

### Ana Sayfa
- Hero bölümü
- Hızlı erişim kartları
- Özellikler listesi

### Dashboard
- İstatistik kartları
- Gelir grafikleri
- Haftalık randevu analizi
- Hizmet dağılımı
- Son randevular

### Randevular
- Tablo görünümü
- Filtreleme ve arama
- Durum yönetimi
- Yeni randevu oluşturma

### Hizmetler
- Grid görünümü
- Kategori filtreleme
- Hizmet kartları
- Fiyat ve süre bilgileri

### Müşteriler
- Müşteri kartları
- Detaylı profiller
- Harcama analizi
- İletişim bilgileri

### Personel
- Çalışan kartları
- Performans metrikleri
- Komisyon hesaplama
- Durum takibi

### Ayarlar
- Genel ayarlar
- Çalışma saatleri
- Fiyatlandırma
- Bildirimler
- Görünüm
- Güvenlik

## 🔧 Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Lint kontrolü
npm run lint
```

## 🌟 Gelecek Özellikler

- [ ] Veritabanı entegrasyonu
- [ ] Kullanıcı kimlik doğrulama
- [ ] Email/SMS bildirimleri
- [ ] Online randevu sistemi (müşteri tarafı)
- [ ] Ödeme entegrasyonu
- [ ] Envanter yönetimi
- [ ] Raporlama modülü
- [ ] Multi-language desteği
- [ ] Mobile app

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

Demir Güzellik Salonu için özel olarak geliştirilmiştir.

---

**Not:** Bu bir demo projesidir. Production kullanımı için backend entegrasyonu ve güvenlik önlemleri eklenmelidir.
dadada
