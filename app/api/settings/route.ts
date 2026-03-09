import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Varsayılan ayarlar
const defaultSettings = {
  // Genel Bilgiler
  siteName: 'Demir Güzellik Merkezi',
  siteSlogan: 'Güzelliğiniz, Bizim İşimiz',
  siteDescription: '15 yıllık deneyimimiz ve uzman kadromuzla, size özel güzellik ve bakım hizmetleri sunuyoruz.',
  phone: '0312 123 45 67',
  email: 'info@demirguzelllik.com',
  address: 'Ankara, Türkiye',
  
  // Çalışma Saatleri
  workdayStart: '09:00',
  workdayEnd: '19:00',
  weekendStart: '10:00',
  weekendEnd: '18:00',
  workingDays: 'Pzt-Cmt',
  
  // Sosyal Medya
  instagram: 'https://instagram.com/demirguzelllik',
  facebook: 'https://facebook.com/demirguzelllik',
  whatsapp: '905551234567',
  
  // Tema Renkleri
  primaryColor: '#C5A059',
  secondaryColor: '#0a0a0a',
  
  // Logo
  logoUrl: '',
  faviconUrl: '',
  
  // Hero Bölümü
  heroTitle: 'Güzelliğiniz',
  heroTitleHighlight: 'Bizim İşimiz',
  heroVideoUrl: '/videos/hero-video.mp4',
  
  // Footer
  footerText: '© 2024 Demir Güzellik Merkezi. Tüm hakları saklıdır.',
  
  // SEO
  metaTitle: 'Demir Güzellik Merkezi | Ankara Güzellik Salonu',
  metaDescription: 'Ankara\'nın en iyi güzellik merkezi. Saç, cilt bakımı, makyaj, tırnak bakımı ve daha fazlası.',
  metaKeywords: 'güzellik salonu, kuaför, cilt bakımı, makyaj, ankara',
  
  // E-posta Ayarları
  emailNotifications: 'true',
  smsNotifications: 'false',
  appointmentReminders: 'true',
  
  // Fiyatlandırma
  currency: 'TRY',
  taxRate: '18',
};

// Tüm ayarları getir
export async function GET() {
  try {
    const settings = await (prisma as any).siteSettings.findMany();
    
    // Ayarları key-value formatına dönüştür
    const settingsMap: Record<string, string> = {};
    settings.forEach((s: { key: string; value: string }) => {
      settingsMap[s.key] = s.value;
    });
    
    // Varsayılan ayarları birleştir (eksik olanları tamamla)
    const mergedSettings = { ...defaultSettings, ...settingsMap };
    
    return NextResponse.json(mergedSettings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Ayarları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Ayarlar getirilemedi' },
      { status: 500 }
    );
  }
}

// Ayarları güncelle veya oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Boş obje kontrolü
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Güncellenecek ayar bulunamadı' },
        { status: 400 }
      );
    }
    
    // Her ayar için upsert işlemi yap
    const updates = Object.entries(body).map(([key, value]) =>
      (prisma as any).siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );
    
    await Promise.all(updates);
    
    return NextResponse.json({ success: true, message: 'Ayarlar başarıyla güncellendi' });
  } catch (error) {
    console.error('Ayarları güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Ayarlar güncellenemedi' },
      { status: 500 }
    );
  }
}

// Tek bir ayarı sil
export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();
    
    await (prisma as any).siteSettings.delete({
      where: { key },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ayar silme hatası:', error);
    return NextResponse.json(
      { error: 'Ayar silinemedi' },
      { status: 500 }
    );
  }
}
