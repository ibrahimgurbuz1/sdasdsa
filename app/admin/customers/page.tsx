'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaUserPlus, FaSearch, FaPhone, FaEnvelope, FaCalendarAlt, FaStar, FaChartLine, FaSync } from 'react-icons/fa';

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  rating: number;
  services: string[];
};

type Stats = {
  totalCustomers: number;
  avgVisits: number;
  totalRevenue: number;
  avgRating: string;
};

export default function Customers() {
  useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCustomers: 0, avgVisits: 0, totalRevenue: 0, avgRating: '0.0' });
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Müşteriler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    { label: 'Toplam Müşteri', value: stats.totalCustomers.toString(), color: 'from-[#C5A059] to-[#C5A059]', icon: FaUserPlus },
    { label: 'Ort. Ziyaret', value: stats.avgVisits.toString(), color: 'from-blue-500 to-blue-600', icon: FaCalendarAlt },
    { label: 'Toplam Gelir', value: `₺${stats.totalRevenue.toLocaleString('tr-TR')}`, color: 'from-green-500 to-green-600', icon: FaChartLine },
    { label: 'Ort. Memnuniyet', value: `${stats.avgRating}★`, color: 'from-yellow-500 to-yellow-600', icon: FaStar },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Müşteriler</h1>
          <p className="text-gray-600">
            Tamamlanan randevulardan oluşan müşteri listesi
            {loading && <span className="text-[#C5A059] ml-2">(Yükleniyor...)</span>}
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <Icon className="text-gray-400" />
              </div>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} suppressHydrationWarning>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Müşteri ara (isim, telefon, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
          />
        </div>
      </div>

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center animate-fadeIn">
          <FaUserPlus className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Müşteri Yok</h3>
          <p className="text-gray-500">Tamamlanan randevular müşteri olarak buraya eklenecek.</p>
        </div>
      )}

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold text-xl">
                  {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{customer.name}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${i < customer.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhone className="text-[#C5A059]" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaEnvelope className="text-[#C5A059]" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendarAlt className="text-[#C5A059]" />
                <span suppressHydrationWarning>
                  Son ziyaret: {new Date(customer.lastVisit).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-600 mb-1">Toplam Ziyaret</p>
                <p className="text-lg font-bold text-gray-800">{customer.totalVisits}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Toplam Harcama</p>
                <p className="text-lg font-bold text-green-600" suppressHydrationWarning>
                  ₺{customer.totalSpent.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedCustomer(customer)}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Detayları Görüntüle
            </button>
          </div>
        ))}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Müşteri Detayı</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-3">
                {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h3>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${i < selectedCustomer.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-[#C5A059]" />
                <span className="text-gray-800">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-[#C5A059]" />
                <span className="text-gray-800">{selectedCustomer.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#C5A059]/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Ziyaret</p>
                <p className="text-2xl font-bold text-[#C5A059]">{selectedCustomer.totalVisits}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Harcama</p>
                <p className="text-2xl font-bold text-green-600" suppressHydrationWarning>
                  ₺{selectedCustomer.totalSpent.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            {selectedCustomer.services && selectedCustomer.services.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Aldığı Hizmetler:</p>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(selectedCustomer.services)].map((service, i) => (
                    <span key={i} className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
