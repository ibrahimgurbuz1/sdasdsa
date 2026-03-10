'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaCut, FaUsers, FaUserTie, FaCog, FaChartLine, FaBars, FaTimes, FaImages, FaBox, FaMoneyBillWave, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Login sayfasında değilsek auth kontrolü yap
    if (pathname !== '/admin/login') {
      let mounted = true;

      const checkSession = async () => {
        try {
          const response = await fetch('/api/auth/admin/session', {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
          });

          if (!response.ok) {
            if (mounted) {
              router.replace('/admin/login');
            }
            return;
          }

          const data = await response.json();
          if (mounted) {
            setAdminUser(data.user || null);
            setIsChecking(false);
          }
        } catch {
          if (mounted) {
            router.replace('/admin/login');
          }
        }
      };

      checkSession();

      return () => {
        mounted = false;
      };
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/admin/login');
  };

  // Login sayfasında header gösterme
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Auth check loading
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A05C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Ana Sayfa', href: '/home', icon: FaHome },
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaChartLine },
    { name: 'Randevular', href: '/admin/appointments', icon: FaCalendarAlt },
    { name: 'Onaylanan', href: '/admin/confirmed-appointments', icon: FaCalendarAlt },
    { name: 'Hizmetler', href: '/admin/services', icon: FaCut },
    { name: 'Müşteriler', href: '/admin/customers', icon: FaUsers },
    { name: 'Personel', href: '/admin/staff', icon: FaUserTie },
    { name: 'Galeri', href: '/admin/gallery', icon: FaImages },
    { name: 'Envanter', href: '/admin/inventory', icon: FaBox },
    { name: 'Finans', href: '/admin/finance', icon: FaMoneyBillWave },
    { name: 'Ayarlar', href: '/admin/settings', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-black border-r border-white/10 shadow-2xl flex flex-col">
          <div className="mb-8 flex flex-col items-center">
            <div className="w-24 h-24 relative mb-2">
              <Image 
                src="/images/logo.svg" 
                alt="Demir Güzellik" 
                fill 
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Demir</h2>
            <p className="text-[#C5A059] text-sm tracking-widest uppercase text-xs">Güzellik Salonu</p>
          </div>
          <ul className="space-y-2 font-medium flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[#C5A059] text-black shadow-lg font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`text-xl ${isActive ? 'text-black' : 'text-[#C5A059]'}`} />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* User Info & Logout - Sidebar Alt Kısmı */}
          <div className="border-t border-white/10 pt-4 mt-4">
            {adminUser && (
              <div className="flex items-center gap-3 px-3 mb-3">
                <div className="w-10 h-10 bg-[#C5A059] rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUserCircle className="text-black text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{adminUser.name}</p>
                  <p className="text-xs text-gray-400 truncate">{adminUser.role}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-black shadow-md z-30 flex items-center justify-between px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-white hover:bg-white/10"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-lg font-bold text-[#C5A059]">Demir Güzellik</h1>
        <div className="w-10"></div>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="lg:ml-64 pt-16 lg:pt-4 p-4 lg:p-8">
        {children}
      </div>
    </div>
  );
}
