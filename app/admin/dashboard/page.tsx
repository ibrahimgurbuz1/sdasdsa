'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaCalendarCheck, FaUsers, FaMoneyBillWave, FaChartLine, FaSpinner } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  stats: {
    todayAppointments: number;
    totalCustomers: number;
    monthlyRevenue: number;
    averageValue: number;
  };
  revenueData: Array<{ name: string; gelir: number }>;
  appointmentData: Array<{ name: string; randevu: number }>;
  serviceDistribution: Array<{ name: string; value: number }>;
  recentAppointments: Array<{
    id: string;
    customerName: string;
    service: string;
    time: string;
    status: string;
    staff: string;
  }>;
  confirmedAppointments: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    service: string;
    date: string;
    time: string;
    staff: string;
    price: number;
  }>;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();

    // Verileri her 15 saniyede bir güncelle (Dashboard biraz daha ağır olduğu için 15sn)
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard verisi yüklenemedi:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const COLORS = ['#9333ea', '#ec4899', '#3b82f6', '#14b8a6', '#f59e0b'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-[#C5A059] mx-auto mb-4" />
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Dashboard verisi yüklenemedi.</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Bugünkü Randevular',
      value: dashboardData.stats.todayAppointments.toString(),
      icon: FaCalendarCheck,
      color: 'from-amber-600 to-amber-700',
    },
    {
      title: 'Toplam Müşteri',
      value: dashboardData.stats.totalCustomers.toString(),
      icon: FaUsers,
      color: 'from-amber-700 to-amber-800',
    },
    {
      title: 'Aylık Gelir',
      value: `₺${dashboardData.stats.monthlyRevenue.toLocaleString('tr-TR')}`,
      icon: FaMoneyBillWave,
      color: 'from-amber-600 to-amber-700',
      suppressHydration: true,
    },
    {
      title: 'Ortalama Değer',
      value: `₺${dashboardData.stats.averageValue.toLocaleString('tr-TR')}`,
      icon: FaChartLine,
      color: 'from-teal-500 to-teal-600',
      suppressHydration: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fadeIn">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Hoş geldiniz! İşte işletmenizin genel görünümü.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p 
                className="text-3xl font-bold text-gray-800"
                suppressHydrationWarning={stat.suppressHydration}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Aylık Gelir Trendi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="gelir" 
                stroke="#9333ea" 
                strokeWidth={3}
                dot={{ fill: '#9333ea', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Haftalık Randevular</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar 
                dataKey="randevu" 
                fill="#ec4899" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Distribution & Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hizmet Dağılımı</h2>
          {dashboardData.serviceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Henüz veri yok
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Son Randevular</h2>
          <div className="space-y-4">
            {dashboardData.recentAppointments.length > 0 ? (
              dashboardData.recentAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold">
                      {appointment.customerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{appointment.customerName}</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">{appointment.time}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'Tamamlandı'
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'Onaylandı'
                          ? 'bg-blue-100 text-blue-700'
                          : appointment.status === 'İptal'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                Henüz randevu yok
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Onaylanan Randevular */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Onaylanan Randevular</h2>
        {dashboardData.confirmedAppointments && dashboardData.confirmedAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-[#C5A059]/10 to-[#C5A059]/5">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Müşteri</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Hizmet</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Personel</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tarih</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Saat</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Ücret</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.confirmedAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-800 font-medium">{apt.customerName}</td>
                    <td className="px-4 py-3 text-gray-700">{apt.service}</td>
                    <td className="px-4 py-3 text-gray-700">{apt.staff}</td>
                    <td className="px-4 py-3 text-gray-700" suppressHydrationWarning>{new Date(apt.date).toLocaleDateString('tr-TR')}</td>
                    <td className="px-4 py-3 text-gray-700">{apt.time}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">₺{apt.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            Onaylanan randevu bulunmamaktadır
          </div>
        )}
      </div>
    </div>
  );
}
