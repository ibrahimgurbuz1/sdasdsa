'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
  siteName: string;
  siteSlogan: string;
  siteDescription: string;
  phone: string;
  email: string;
  address: string;
  workdayStart: string;
  workdayEnd: string;
  weekendStart: string;
  weekendEnd: string;
  workingDays: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroVideoUrl: string;
  footerText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  emailNotifications: string;
  smsNotifications: string;
  appointmentReminders: string;
  currency: string;
  taxRate: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Demir Güzellik Merkezi',
  siteSlogan: 'Güzelliğiniz, Bizim İşimiz',
  siteDescription: '15 yıllık deneyimimiz ve uzman kadromuzla, size özel güzellik ve bakım hizmetleri sunuyoruz.',
  phone: '0312 123 45 67',
  email: 'info@demirguzelllik.com',
  address: 'Ankara, Türkiye',
  workdayStart: '09:00',
  workdayEnd: '19:00',
  weekendStart: '10:00',
  weekendEnd: '18:00',
  workingDays: 'Pzt-Cmt',
  instagram: 'https://instagram.com/demirguzelllik',
  facebook: 'https://facebook.com/demirguzelllik',
  whatsapp: '905551234567',
  primaryColor: '#C5A059',
  secondaryColor: '#0a0a0a',
  logoUrl: '',
  faviconUrl: '',
  heroTitle: 'Güzelliğiniz',
  heroTitleHighlight: 'Bizim İşimiz',
  heroVideoUrl: '/videos/hero-video.mp4',
  footerText: '© 2024 Demir Güzellik Merkezi. Tüm hakları saklıdır.',
  metaTitle: 'Demir Güzellik Merkezi | Ankara Güzellik Salonu',
  metaDescription: 'Ankara\'nın en iyi güzellik merkezi. Saç, cilt bakımı, makyaj, tırnak bakımı ve daha fazlası.',
  metaKeywords: 'güzellik salonu, kuaför, cilt bakımı, makyaj, ankara',
  emailNotifications: 'true',
  smsNotifications: 'false',
  appointmentReminders: 'true',
  currency: 'TRY',
  taxRate: '18',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refetch: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refetch: () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Her 2 saniyede bir ayarları kontrol et (admin değişikliklerini anında yansıt)
    const interval = setInterval(fetchSettings, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
