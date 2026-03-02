'use client';

import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaArrowUp, FaChartLine, FaSync, FaReceipt } from 'react-icons/fa';

type Transaction = {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  time: string;
  staff: string;
};

type FinanceData = {
  stats: {
    totalRevenue: number;
    totalTransactions: number;
    avgTransaction: number;
    todayRevenue: number;
  };
  recentTransactions: Transaction[];
  revenueByService: { name: string; value: number }[];
  revenueByStaff: { name: string; value: number }[];
  dailyRevenue: { date: string; revenue: number }[];
};

export default function AdminFinance() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinance = async () => {
    try {
      const res = await fetch('/api/finance');
      if (res.ok) {
        const financeData = await res.json();
        setData(financeData);
      }
    } catch (error) {
      console.error('Finans verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
    const interval = setInterval(fetchFinance, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = data ? [
    {
      label: 'Toplam Gelir',
      value: `₺${data.stats.totalRevenue.toLocaleString('tr-TR')}`,
      color: 'from-green-500 to-green-600',
      icon: FaMoneyBillWave
    },
    {
      label: 'Bugünkü Gelir',
      value: `₺${data.stats.todayRevenue.toLocaleString('tr-TR')}`,
      color: 'from-blue-500 to-blue-600',
      icon: FaArrowUp
    },
    {
      label: 'Toplam İşlem',
      value: data.stats.totalTransactions.toString(),
      color: 'from-amber-600 to-amber-700',
      icon: FaReceipt
    },
    {
      label: 'Ortalama İşlem',
      value: `₺${data.stats.avgTransaction.toLocaleString('tr-TR')}`,
      color: 'from-amber-700 to-amber-800',
      icon: FaChartLine
    },
  ] : [];

  const COLORS = ['#9333ea', '#ec4899', '#3b82f6', '#14b8a6', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Finans Yönetimi</h1>
          <p className="text-gray-600">
            Gelir raporlarınızı takip edin
            {loading && <span className="text-[#C5A059] ml-2">(Yükleniyor...)</span>}
          </p>
        </div>
        <button
          onClick={fetchFinance}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white text-xl" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} suppressHydrationWarning>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && (!data || data.stats.totalTransactions === 0) && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center animate-fadeIn">
          <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Gelir Yok</h3>
          <p className="text-gray-500">Tamamlanan randevular burada gelir olarak görünecek.</p>
        </div>
      )}

      {data && data.stats.totalTransactions > 0 && (
        <>
          {/* Revenue by Service & Staff */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* Revenue by Service */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Hizmet Bazlı Gelir</h2>
              <div className="space-y-3">
                {data.revenueByService.map((item, index) => {
                  const maxValue = Math.max(...data.revenueByService.map(s => s.value));
                  const percentage = (item.value / maxValue) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="text-gray-600" suppressHydrationWarning>₺{item.value.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue by Staff */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personel Bazlı Gelir</h2>
              <div className="space-y-3">
                {data.revenueByStaff.map((item, index) => {
                  const maxValue = Math.max(...data.revenueByStaff.map(s => s.value));
                  const percentage = (item.value / maxValue) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className="text-gray-600" suppressHydrationWarning>₺{item.value.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#ad8345] transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily Revenue */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Son 7 Gün Geliri</h2>
            <div className="flex items-end gap-2 h-48">
              {data.dailyRevenue.map((day, index) => {
                const maxRevenue = Math.max(...data.dailyRevenue.map(d => d.revenue), 1);
                const height = (day.revenue / maxRevenue) * 100;
                const dayName = new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' });
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end h-40">
                      <div 
                        className="w-full bg-gradient-to-t from-[#C5A059] to-[#ad8345] rounded-t-lg transition-all duration-500 hover:from-[#C5A059] hover:to-[#d4b87a]"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2" suppressHydrationWarning>{dayName}</p>
                    <p className="text-xs text-gray-700 font-semibold" suppressHydrationWarning>
                      ₺{day.revenue.toLocaleString('tr-TR')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Son İşlemler</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Açıklama</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Personel</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Tarih</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">{tx.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{tx.staff}</td>
                      <td className="py-3 px-4 text-sm text-gray-600" suppressHydrationWarning>
                        {new Date(tx.date).toLocaleDateString('tr-TR')} {tx.time}
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-bold text-green-600" suppressHydrationWarning>
                        +₺{tx.amount.toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
