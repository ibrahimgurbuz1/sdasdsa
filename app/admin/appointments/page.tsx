'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaCalendarPlus, FaSearch, FaFilter, FaClock, FaUser, FaCheck, FaTimes, FaEllipsisV, FaSpinner } from 'react-icons/fa';

type Appointment = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: { id: string; name: string; price: number } | null;
  staff: { id: string; name: string } | null;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
};

export default function Appointments() {
  useAdminAuth(); // Protected route
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();

    // Verileri her 10 saniyede bir güncelle (anında yansıması için)
    const interval = setInterval(() => {
      fetchAppointments(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Randevular yüklenemedi:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appointmentId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Randevu güncellenemedi');
      }

      // Listeyi yenile
      fetchAppointments(false);
    } catch (error) {
      console.error('Hata:', error);
      alert('Randevu güncellenirken hata oluştu');
    }
  };

  // Sadece pending (bekleyen) randevuları göster
  const filteredAppointments = appointments
    .filter(apt => apt.status === 'pending')
    .filter(apt => {
      const matchesSearch = apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date).toDateString();
    const today = new Date().toDateString();
    return aptDate === today;
  });

  const pendingCount = appointments.filter(apt => apt.status === 'pending').length;
  const completedCount = appointments.filter(apt => apt.status === 'completed').length;
  const totalRevenue = appointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + (apt.service?.price || 0), 0);

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  
  const stats = [
    { label: 'Beklenecek Randevular', value: pendingAppointments.toString(), color: 'from-yellow-500 to-yellow-600' },
    { label: 'Onaylandı', value: appointments.filter(apt => apt.status === 'confirmed').length.toString(), color: 'from-[#C5A059] to-[#C5A059]' },
    { label: 'Tamamlanan', value: completedCount.toString(), color: 'from-green-500 to-green-600' },
    { label: 'Toplam Gelir', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, color: 'from-[#ad8345] to-[#ad8345]', suppressHydration: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-[#C5A059] mx-auto mb-4" />
          <p className="text-gray-600">Randevular yükleniyor...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Bekliyor';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Randevular</h1>
          <p className="text-gray-600">Tüm randevularınızı yönetin ({appointments.length} randevu)</p>
        </div>
        <button
          onClick={() => setShowNewAppointment(true)}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <FaCalendarPlus />
          Yeni Randevu
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p 
              className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              suppressHydrationWarning={stat.suppressHydration}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri veya hizmet ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black cursor-pointer"
            >
              <option value="all">Filtrele</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#C5A059]/10 to-[#C5A059]/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Hizmet
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Personel
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Saat
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ücret
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold mr-3">
                          {appointment.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{appointment.customerName}</div>
                          <div className="text-xs text-gray-500">{appointment.customerEmail}</div>
                          <div className="text-xs text-gray-500">{appointment.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {appointment.service?.name || 'Bilinmiyor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {appointment.staff?.name || 'Atanmadı'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700" suppressHydrationWarning>
                      {new Date(appointment.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                      ₺{appointment.service?.price || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                          title="Onayla"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="İptal"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    {searchTerm || filterStatus !== 'all' ? 'Arama kriterlerine uygun randevu bulunamadı' : 'Henüz randevu yok'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewAppointment(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Yeni Randevu</h2>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Müşteri</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Müşteri adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="0500 000 00 00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hizmet</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black cursor-pointer">
                    <option>Saç Kesimi</option>
                    <option>Sakal Tıraşı</option>
                    <option>Manikür</option>
                    <option>Pedikür</option>
                    <option>Boya</option>
                    <option>Cilt Bakımı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Personel</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black cursor-pointer">
                    <option>Elif Kaya</option>
                    <option>Ahmet Yıldız</option>
                    <option>Fatma Şahin</option>
                    <option>Ayşe Demir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Saat</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Not</label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                  rows={3}
                  placeholder="Ek bilgiler..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewAppointment(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Randevu Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
