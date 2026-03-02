'use client';

import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';
import { useSiteSettings } from '@/lib/SiteSettingsContext';

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form gönderildi:', formData);
    alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div>
      {/* Hero Section with Video */}
      <section className="bg-[#0a0a0a] text-white py-28 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-[#0a0a0a]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-6 py-2 bg-[#C5A059]/20 backdrop-blur-sm rounded-full border border-[#C5A059]/30 mb-6">
            <span className="text-[#C5A059] font-semibold">7/24 Size Yakınız</span>
          </div>
          <h1 className="text-6xl font-bold mb-6">İletişim</h1>
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Bizimle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">İletişim Bilgileri</h2>
                <p className="text-gray-600 mb-8">
                  Size en iyi şekilde hizmet verebilmek için her zaman ulaşılabilir durumdayız.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20 hover:shadow-[#C5A059]/30 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-black text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Adres</h3>
                      <p className="text-gray-400">{settings.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20 hover:shadow-[#C5A059]/30 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-black text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Telefon</h3>
                      <p className="text-gray-400">{settings.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20 hover:shadow-[#C5A059]/30 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-black text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">E-posta</h3>
                      <p className="text-gray-400">{settings.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20 hover:shadow-[#C5A059]/30 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-black text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Çalışma Saatleri</h3>
                      <p className="text-gray-400">{settings.workingDays}: {settings.workdayStart} - {settings.workdayEnd}</p>
                      <p className="text-gray-400">Hafta sonu: {settings.weekendStart} - {settings.weekendEnd}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#C5A059]/20">
                <h3 className="font-bold text-white mb-4">Sosyal Medya</h3>
                <div className="flex gap-4">
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center text-black hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 hover:scale-110"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center text-black hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 hover:scale-110"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center text-black hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 hover:scale-110"
                  >
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 border border-[#C5A059]/20">
              <h2 className="text-2xl font-bold text-white mb-6">Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Adınız Soyadınız"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="email@ornek.com"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="0500 000 00 00"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Konu</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="Mesaj konusu"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Mesajınız</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder="Mesajınızı buraya yazın..."
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C5A059] text-black px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300"
                >
                  Mesajı Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Konum</h2>
          <div className="bg-[#1a1a1a] rounded-2xl shadow-xl overflow-hidden border border-[#C5A059]/20">
            <div className="w-full h-96 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-6xl text-[#C5A059] mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">{settings.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Google Maps entegrasyonu için harita API'si eklenecek
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
