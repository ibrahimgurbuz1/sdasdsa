'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaClock, FaUser, FaCheckCircle, FaTimes, FaSpinner } from 'react-icons/fa';

type Appointment = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: { id: string; name: string; price: number } | null;
  staff: { id: string; name: string } | null;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
};

export default function ConfirmedAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();

    // Verileri her 10 saniyede bir güncelle
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
      // Sadece onaylanan ve tamamlanan randevuları göster
      setAppointments(data.filter((apt: any) => apt.status === 'confirmed' || apt.status === 'completed'));
    } catch (error) {
      console.error('Randevular yüklenemedi:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const confirmedCount = appointments.filter(apt => apt.status === 'confirmed').length;
  const completedCount = appointments.filter(apt => apt.status === 'completed').length;

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

      fetchAppointments(false);
    } catch (error) {
      console.error('Hata:', error);
      alert('Randevu güncellenirken hata oluştu');
    }
  };

  const stats = [
    { label: 'Onaylanan', value: confirmedCount.toString(), color: 'from-amber-600 to-amber-700' },
    { label: 'Tamamlanan', value: completedCount.toString(), color: 'from-green-500 to-green-600' },
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
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Onaylanan Randevular</h1>
          <p className="text-gray-600">Onaylanan ve tamamlanan randevuları yönetin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <FaCheckCircle className="text-white text-2xl" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
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
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {/* Onaylananlar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-[#C5A059]/10 to-[#C5A059]/5 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800">Onaylanan Randevular ({appointments.filter(a => a.status === 'confirmed').length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
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
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 uppercase tracking-wider">
                    Ücret
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.filter(a => a.status === 'confirmed').length > 0 ? (
                  filteredAppointments.filter(a => a.status === 'confirmed').map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold mr-3">
                            {appointment.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{appointment.customerName}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 text-right">
                        ₺{appointment.service?.price || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Tamamlandı"
                          >
                            <FaCheckCircle />
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
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Onaylanan randevu bulunmamaktadır
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tamamlananlar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-800">Tamamlanan Hizmetler - {new Set(filteredAppointments.filter(a => a.status === 'completed').map(a => a.customerName)).size} Müşteri</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
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
                  <th className="px-6 py-4 text-right font-semibold text-gray-700 uppercase tracking-wider">
                    Ücret
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.filter(a => a.status === 'completed').length > 0 ? (
                  filteredAppointments.filter(a => a.status === 'completed').map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {appointment.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{appointment.customerName}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 text-right">
                        ₺{appointment.service?.price || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
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
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Tamamlanan hizmet bulunmamaktadır
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
