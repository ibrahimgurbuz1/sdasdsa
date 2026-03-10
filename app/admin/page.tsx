'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaCut, FaUsers, FaChartLine, FaCog, FaUserTie } from 'react-icons/fa';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminWelcome() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/admin/session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (!response.ok && active) {
          router.replace('/admin/login');
        }
      } catch {
        if (active) {
          router.replace('/admin/login');
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C5A059]/5 via-[#C5A059]/10 to-[#C5A059]/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-6xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ad8345] to-[#C5A059]">
            Demir Güzellik Salonu
          </h1>
          <p className="text-xl text-gray-600 mb-8">Yönetim Paneli</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#ad8345] to-[#C5A059] mx-auto rounded-full"></div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Link href="/admin/dashboard">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mb-4">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h3>
              <p className="text-gray-600">Genel bakış ve istatistikler</p>
            </div>
          </Link>

          <Link href="/admin/appointments">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mb-4">
                <FaCalendarAlt className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Randevular</h3>
              <p className="text-gray-600">Randevu yönetimi ve takvim</p>
            </div>
          </Link>

          <Link href="/admin/services">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center mb-4">
                <FaCut className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Hizmetler</h3>
              <p className="text-gray-600">Hizmet tanımları ve fiyatlar</p>
            </div>
          </Link>

          <Link href="/admin/customers">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Müşteriler</h3>
              <p className="text-gray-600">Müşteri bilgileri ve geçmiş</p>
            </div>
          </Link>

          <Link href="/admin/staff">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                <FaUserTie className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Personel</h3>
              <p className="text-gray-600">Çalışan yönetimi ve performans</p>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-4">
                <FaCog className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ayarlar</h3>
              <p className="text-gray-600">Sistem ayarları ve yapılandırma</p>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Özellikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-[#C5A059] rounded-full mt-2"></div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Online Randevu Sistemi</h4>
                <p className="text-gray-600">7/24 online randevu alma ve yönetim</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-[#ad8345] rounded-full mt-2"></div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Müşteri Takibi</h4>
                <p className="text-gray-600">Detaylı müşteri profilleri ve geçmiş</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-[#C5A059]/50 rounded-full mt-2"></div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Gelir Raporları</h4>
                <p className="text-gray-600">Detaylı finansal raporlama ve analiz</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Personel Yönetimi</h4>
                <p className="text-gray-600">Çalışan performans takibi ve yönetimi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/home"
            className="inline-block text-[#C5A059] hover:text-[#ad8345] font-semibold"
          >
            ← Kullanıcı Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
