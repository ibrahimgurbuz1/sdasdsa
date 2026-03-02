'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaCheckCircle, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

interface CompletedService {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  staff: string;
  price: number;
}

export default function MyServicesPage() {
  const [email, setEmail] = useState('');
  const [showSearch, setShowSearch] = useState(true);
  const [services, setServices] = useState<CompletedService[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) {
      alert('Lütfen email adresinizi girin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/appointments?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Randevular yüklenemedi');
      }
      const data = await response.json();
      
      // Tamamlanan hizmetleri filtrele
      const completed = data
        .filter((apt: any) => apt.status === 'completed')
        .map((apt: any) => ({
          id: apt.id,
          customerName: apt.customerName,
          service: apt.service?.name || 'Bilinmiyor',
          date: apt.date,
          time: apt.time || 'Belirtilmedi',
          staff: apt.staff?.name || 'Atanmadı',
          price: apt.service?.price || 0,
        }));

      setServices(completed);
      if (completed.length === 0) {
        alert('Henüz tamamlanan hizmet bulunamadı');
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Randevular yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setShowSearch(true);
    setServices([]);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-br from-[#C5A059] to-[#E8D4A8] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-black text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Tamamlanan Hizmetlerim</h1>
          <p className="text-gray-400">Alınan ve tamamlanan güzellik hizmetlerinizi görmek için email adresinizi girin</p>
        </div>

        {showSearch ? (
          // Arama Formu
          <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-8 border border-[#C5A059]/20 animate-fadeIn">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Email Adresiniz</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C5A059]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="ornek@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#C5A059] to-[#E8D4A8] text-black rounded-xl font-bold hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaSearch />
                {loading ? 'Aranıyor...' : 'Tamamlanan Hizmetleri Göster'}
              </button>
            </div>
          </div>
        ) : (
          // Sonuçlar
          <div className="animate-fadeIn">
            <button
              onClick={handleBackToSearch}
              className="mb-6 px-6 py-2 border-2 border-[#C5A059]/30 text-[#C5A059] rounded-xl font-semibold hover:bg-[#C5A059]/10 transition-colors"
            >
              ← Farklı Email ile Ara
            </button>

            {services.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-[#0a0a0a] rounded-xl border border-[#C5A059]/20 p-4 mb-6">
                  <p className="text-[#C5A059] font-semibold text-center">
                    {services.length} tamamlanan hizmet bulundu
                  </p>
                </div>

                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-bold text-[#C5A059] mb-3">{service.service}</h3>
                        <div className="space-y-2 text-gray-300">
                          <div className="flex items-center gap-3">
                            <FaUser className="text-[#C5A059]" />
                            <span><strong>Müşteri:</strong> {service.customerName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaUser className="text-[#C5A059]" />
                            <span><strong>Uzman:</strong> {service.staff}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="space-y-2 text-gray-300">
                          <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-[#C5A059]" />
                            <span suppressHydrationWarning>
                              <strong>Tarih:</strong> {new Date(service.date).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <FaClock className="text-[#C5A059]" />
                            <span><strong>Saat:</strong> {service.time}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-[#C5A059]">₺{service.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#C5A059]/20 p-12 text-center">
                <FaCheckCircle className="text-4xl text-[#C5A059] mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">Henüz tamamlanan hizmet bulunmamaktadır</p>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="mt-12 bg-[#0a0a0a] rounded-xl border border-[#C5A059]/20 p-6">
          <p className="text-gray-400 text-sm text-center">
            Tamamlanan hizmetleriniz bu sayfada görüntülenir. Hizmetiniz tamamlandığında otomatik olarak burada listelenecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
