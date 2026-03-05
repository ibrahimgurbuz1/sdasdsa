# Hostinger'a ZIP ile Deploy Talimatları

## ÖNEMLİ: Bu adımları sırayla takip edin!

### 1. Hostinger phpMyAdmin'e Gir
- Hostinger Panel → Databases → phpMyAdmin
- Yeni database oluştur: `demir_beauty`
- Database user oluştur: `demir_user` (şifre belirle)

### 2. Veritabanını Import Et
- phpMyAdmin'de `demir_beauty` database'i seç
- **Import** sekmesine git
- `mysql_import.sql` dosyasını seç
- **Go** butonuna tıkla
- ✅ Tüm tablolar ve veriler oluşturulacak

Admin Giriş Bilgileri:
- Email: admin@demir.com
- Şifre: admin123

### 3. ZIP Dosyasını Hostinger'a Yükle
- Hostinger Panel → File Manager
- `public_html` klasörüne git
- **Upload** → `sdasdsa.zip` dosyasını yükle
- ZIP'e sağ tıkla → **Extract** seç
- `demir-salon` diye klasör oluşacak

### 4. .env Dosyasını Düzenle
File Manager'da `demir-salon/.env` aç ve düzenle:

```
DATABASE_URL="mysql://demir_user:BURAYA_ŞIFRE@localhost:3306/demir_beauty"
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="mailer@codiasoft.com"
SMTP_PASSWORD="159753Pl**"
SMTP_FROM_NAME="Demir Güzellik Merkezi"
NODE_ENV="production"
```

**ÖNEMLİ:** `BURAYA_ŞIFRE` kısmını phpMyAdmin'de oluşturduğunuz şifre ile değiştirin!

### 5. Hostinger Terminal'i Aç (En Önemli Adım)

**Hostinger Panel'de Terminal bul:**
- Seçenek A: **Advanced** → **Terminal**
- Seçenek B: **SSH Access** → **Enable SSH** → Web Terminal butonu
- Seçenek C: cPanel → **Terminal**

Terminal'de şu komutları çalıştır:

```bash
# Klasöre git
cd public_html/demir-salon

# Dependencies kur (eğer ZIP'te yoksa)
npm install

# Build et (eğer .next/ klasörü yoksa)
npm run build

# PM2 ile başlat
npm install -g pm2
pm2 start npm --name "demir-salon" -- start
pm2 save
pm2 startup

# Çalıştığını kontrol et
pm2 logs demir-salon
```

### 6. Domain Ayarları

File Manager'da `public_html/.htaccess` oluştur:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/demir-salon
RewriteRule ^(.*)$ /demir-salon/$1 [L]

# Proxy to Node.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### 7. Test Et

Tarayıcıda aç:
```
http://codiasof.com
```

Admin paneline giriş:
```
http://codiasof.com/admin/login
Email: admin@demir.com
Şifre: admin123
```

---

## Sorun Giderme

### Terminal Bulamıyorum
- Hostinger'ın Shared Hosting planında terminal olmayabilir
- VPS planına upgrade yapın veya Vercel'e deploy edin

### PM2 Kurmuyor
```bash
# Alternatif: Screen ile başlat
screen -S demir
npm start
# Ctrl+A sonra D ile çık
```

### Database Bağlantı Hatası
- `.env` dosyasındaki MySQL bilgilerini kontrol et
- phpMyAdmin'de user'ın yetkilerini kontrol et

### Port 3000 Çalışmıyor
- Hostinger Panel → Domain → Port Yönlendirme
- 80 → 3000 yönlendirmesi ekle

---

## Alternatif: Vercel Deploy (Tavsiye)

Eğer Hostinger'da terminal yoksa:

```bash
# Lokal bilgisayarınızda:
npm install -g vercel
vercel login
vercel

# MySQL Database için:
# Vercel → Dashboard → Storage → MySQL (PlanetScale)
```

Vercel otomatik deploy yapar, daha hızlı ve güvenilirdir.
