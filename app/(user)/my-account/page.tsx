'use client';

import { FaCalendarAlt, FaUser, FaHistory, FaCog, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyAccount() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('appointments');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Henüz giriş yapmamış kullanıcı için varsayılan veri
      setUser({
        name: 'Ziyaretçi',
        email: 'email@ornek.com',
        phone: '0500 000 00 00'
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return null; // veya loading spinner
  }

  const upcomingAppointments = [
    { id: 1, service: 'Saç Kesimi', staff: 'Elif Kaya', date: '2026-02-20', time: '10:00', status: 'confirmed' },
    { id: 2, service: 'Manikür', staff: 'Zeynep Yıldız', date: '2026-02-25', time: '14:30', status: 'pending' },
  ];

  const pastAppointments = [
    { id: 3, service: 'Cilt Bakımı', staff: 'Fatma Şahin', date: '2026-02-10', time: '11:00', status: 'completed', rating: 5 },
    { id: 4, service: 'Saç Boyama', staff: 'Ayşe Demir', date: '2026-01-28', time: '09:30', status: 'completed', rating: 5 },
    { id: 5, service: 'Pedikür', staff: 'Zeynep Yıldız', date: '2026-01-15', time: '15:00', status: 'completed', rating: 4 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-950/50 text-green-400 border border-green-900/30';
      case 'pending': return 'bg-yellow-950/50 text-yellow-400 border border-yellow-900/30';
      case 'completed': return 'bg-blue-950/50 text-blue-400 border border-blue-900/30';
      case 'cancelled': return 'bg-red-950/50 text-red-400 border border-red-900/30';
      default: return 'bg-gray-800 text-gray-300 border border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Bekliyor';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-xl p-8 mb-8 text-white border border-[#C5A059]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-[#C5A059]/10 rounded-full flex items-center justify-center border border-[#C5A059]/30">
                <span className="text-[#C5A059] font-bold text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-400">{user.phone}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 px-6 py-3 rounded-xl transition-all text-[#C5A059] border border-[#C5A059]/30"
            >
              <FaSignOutAlt />
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-lg mb-8 overflow-hidden border border-[#C5A059]/20">
          <div className="flex border-b border-[#C5A059]/20 overflow-x-auto">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'appointments'
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              <FaCalendarAlt className="inline mr-2" />
              Randevularım
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              <FaHistory className="inline mr-2" />
              Geçmiş
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              <FaHeart className="inline mr-2" />
              Favoriler
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              <FaCog className="inline mr-2" />
              Ayarlar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-6">Yaklaşan Randevular</h2>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{appointment.service}</h3>
                        <p className="text-gray-400 mb-1">Personel: {appointment.staff}</p>
                        <p className="text-gray-400">
                          {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                        <button className="px-6 py-2 bg-red-950/50 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors font-semibold border border-red-900/30">
                          İptal Et
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && (
                  <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-12 text-center border border-[#C5A059]/20">
                    <FaCalendarAlt className="text-6xl text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Yaklaşan randevunuz bulunmuyor</p>
                    <a
                      href="/booking"
                      className="inline-block bg-[#C5A059] text-black px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300"
                    >
                      Yeni Randevu Al
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-6">Geçmiş Randevular</h2>
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{appointment.service}</h3>
                        <p className="text-gray-400 mb-1">Personel: {appointment.staff}</p>
                        <p className="text-gray-400">
                          {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-2xl ${
                              i < appointment.rating ? 'text-[#C5A059]' : 'text-gray-700'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-6">Favori Hizmetlerim</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Saç Kesimi', 'Cilt Bakımı', 'Manikür'].map((service, index) => (
                  <div
                    key={index}
                    className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 border border-[#C5A059]/20 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{service}</h3>
                        <p className="text-gray-400">Sık tercih ettiğiniz hizmet</p>
                      </div>
                      <FaHeart className="text-3xl text-[#C5A059]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-white mb-6">Hesap Ayarları</h2>
              <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-8 border border-[#C5A059]/20">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">E-posta</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Telefon</label>
                    <input
                      type="tel"
                      defaultValue={user.phone}
                      className="w-full px-4 py-3 bg-[#0a0a0a] border-2 border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#C5A059] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300"
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 border-2 border-[#C5A059]/30 rounded-xl font-semibold text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
