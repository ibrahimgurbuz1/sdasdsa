'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaSave, FaBell, FaClock, FaMoneyBillWave, FaPalette, FaGlobe, FaInstagram, FaFacebook, FaWhatsapp, FaSearch, FaSpinner, FaCheck } from 'react-icons/fa';

interface Settings {
  // Genel Bilgiler
  siteName: string;
  siteSlogan: string;
  siteDescription: string;
  phone: string;
  email: string;
  address: string;
  
  // Çalışma Saatleri
  workdayStart: string;
  workdayEnd: string;
  weekendStart: string;
  weekendEnd: string;
  workingDays: string;
  
  // Sosyal Medya
  instagram: string;
  facebook: string;
  whatsapp: string;
  
  // Tema Renkleri
  primaryColor: string;
  secondaryColor: string;
  
  // Logo
  logoUrl: string;
  faviconUrl: string;
  
  // Hero Bölümü
  heroTitle: string;
  heroTitleHighlight: string;
  heroVideoUrl: string;
  
  // Footer
  footerText: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // E-posta Ayarları
  emailNotifications: string;
  smsNotifications: string;
  appointmentReminders: string;
  
  // Fiyatlandırma
  currency: string;
  taxRate: string;
}

export default function Settings() {
  useAdminAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof Settings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const tabs = [
    { id: 'general', label: 'Genel', icon: FaGlobe },
    { id: 'hours', label: 'Çalışma Saatleri', icon: FaClock },
    { id: 'social', label: 'Sosyal Medya', icon: FaInstagram },
    { id: 'appearance', label: 'Görünüm', icon: FaPalette },
    { id: 'seo', label: 'SEO', icon: FaSearch },
    { id: 'notifications', label: 'Bildirimler', icon: FaBell },
    { id: 'finance', label: 'Finans', icon: FaMoneyBillWave },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="animate-spin text-4xl text-[#C5A059]" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Ayarlar yüklenemedi</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Site Ayarları</h1>
          <p className="text-gray-600">Sitenizin tüm ayarlarını buradan yönetin</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center disabled:opacity-50"
        >
          {saving ? (
            <FaSpinner className="animate-spin" />
          ) : saved ? (
            <FaCheck />
          ) : (
            <FaSave />
          )}
          {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C5A059]/10 text-[#C5A059] border-b-2 border-[#C5A059]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Genel Ayarlar */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Adı</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Slogan</label>
                <input
                  type="text"
                  value={settings.siteSlogan}
                  onChange={(e) => updateSetting('siteSlogan', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Açıklaması</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => updateSetting('address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
            </div>
          )}

          {/* Çalışma Saatleri */}
          {activeTab === 'hours' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hafta İçi Açılış</label>
                <input
                  type="time"
                  value={settings.workdayStart}
                  onChange={(e) => updateSetting('workdayStart', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hafta İçi Kapanış</label>
                <input
                  type="time"
                  value={settings.workdayEnd}
                  onChange={(e) => updateSetting('workdayEnd', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hafta Sonu Açılış</label>
                <input
                  type="time"
                  value={settings.weekendStart}
                  onChange={(e) => updateSetting('weekendStart', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hafta Sonu Kapanış</label>
                <input
                  type="time"
                  value={settings.weekendEnd}
                  onChange={(e) => updateSetting('weekendEnd', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Çalışma Günleri</label>
                <input
                  type="text"
                  value={settings.workingDays}
                  onChange={(e) => updateSetting('workingDays', e.target.value)}
                  placeholder="Örn: Pzt-Cmt"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
            </div>
          )}

          {/* Sosyal Medya */}
          {activeTab === 'social' && (
            <div className="grid grid-cols-1 gap-6 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-xl">
                  <FaInstagram className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={settings.instagram}
                    onChange={(e) => updateSetting('instagram', e.target.value)}
                    placeholder="https://instagram.com/kullaniciadi"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <FaFacebook className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={settings.facebook}
                    onChange={(e) => updateSetting('facebook', e.target.value)}
                    placeholder="https://facebook.com/sayfaadi"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Numarası</label>
                  <input
                    type="tel"
                    value={settings.whatsapp}
                    onChange={(e) => updateSetting('whatsapp', e.target.value)}
                    placeholder="905551234567"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Görünüm */}
          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ana Renk</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="w-16 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">İkincil Renk</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                    className="w-16 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Başlık</label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => updateSetting('heroTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Vurgu</label>
                <input
                  type="text"
                  value={settings.heroTitleHighlight}
                  onChange={(e) => updateSetting('heroTitleHighlight', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => updateSetting('logoUrl', e.target.value)}
                  placeholder="/images/logo.png"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Video URL</label>
                <input
                  type="text"
                  value={settings.heroVideoUrl}
                  onChange={(e) => updateSetting('heroVideoUrl', e.target.value)}
                  placeholder="/videos/hero-video.mp4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Metni</label>
                <input
                  type="text"
                  value={settings.footerText}
                  onChange={(e) => updateSetting('footerText', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="grid grid-cols-1 gap-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Başlık</label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => updateSetting('metaTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
                <p className="text-sm text-gray-500 mt-1">{settings.metaTitle.length}/60 karakter</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Açıklama</label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => updateSetting('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
                <p className="text-sm text-gray-500 mt-1">{settings.metaDescription.length}/160 karakter</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Anahtar Kelimeler</label>
                <input
                  type="text"
                  value={settings.metaKeywords}
                  onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                  placeholder="anahtar, kelime, listesi"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
            </div>
          )}

          {/* Bildirimler */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">E-posta Bildirimleri</h3>
                  <p className="text-sm text-gray-600">Randevu onayı, iptal ve hatırlatmalar için e-posta gönder</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications === 'true'}
                    onChange={(e) => updateSetting('emailNotifications', e.target.checked ? 'true' : 'false')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C5A059]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#C5A059] peer-checked:to-[#ad8345]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">SMS Bildirimleri</h3>
                  <p className="text-sm text-gray-600">Randevu hatırlatmaları için SMS gönder</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications === 'true'}
                    onChange={(e) => updateSetting('smsNotifications', e.target.checked ? 'true' : 'false')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C5A059]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#C5A059] peer-checked:to-[#ad8345]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Randevu Hatırlatıcıları</h3>
                  <p className="text-sm text-gray-600">Randevudan 1 gün önce müşteriye hatırlatma gönder</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appointmentReminders === 'true'}
                    onChange={(e) => updateSetting('appointmentReminders', e.target.checked ? 'true' : 'false')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C5A059]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#C5A059] peer-checked:to-[#ad8345]"></div>
                </label>
              </div>
            </div>
          )}

          {/* Finans */}
          {activeTab === 'finance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Para Birimi</label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                >
                  <option value="TRY">TRY - Türk Lirası</option>
                  <option value="USD">USD - Amerikan Doları</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">KDV Oranı (%)</label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => updateSetting('taxRate', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-transparent outline-none text-black"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-[#C5A059]/10 to-[#C5A059]/5 rounded-xl p-6 border border-[#C5A059]/20">
        <h3 className="text-lg font-bold text-gray-800 mb-2">💡 Bilgi</h3>
        <p className="text-gray-600 text-sm">
          Ayarlarınızda yaptığınız değişiklikler &quot;Değişiklikleri Kaydet&quot; butonuna bastığınızda kaydedilir. 
          Bazı değişiklikler (tema renkleri gibi) sayfayı yeniledikten sonra görünür olacaktır.
        </p>
      </div>
    </div>
  );
}
