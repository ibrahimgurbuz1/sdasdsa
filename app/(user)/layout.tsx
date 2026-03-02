'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaPhone, FaInstagram, FaFacebook, FaWhatsapp, FaUser } from 'react-icons/fa';
import { SiteSettingsProvider, useSiteSettings } from '@/lib/SiteSettingsContext';

function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { settings, loading } = useSiteSettings();

  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    if (userAuth) {
      setIsLoggedIn(true);
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.name);
      }
    }
  }, []);

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hizmetlerimiz', href: '/services' },
    { name: 'Galeri', href: '/gallery' },
    { name: 'Randevu Al', href: '/booking' },
    { name: 'İletişim', href: '/contact' },
    { name: 'Hizmetlerim', href: '/my-services' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#C5A059] text-lg font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="bg-black text-white/90 py-2 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm">
            <div className="flex items-center gap-4 mb-2 md:mb-0">
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-[#C5A059] transition-colors">
                <FaPhone className="text-xs" />
                <span>{settings.phone}</span>
              </a>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">{settings.workingDays}: {settings.workdayStart} - {settings.workdayEnd}</span>
            </div>
            <div className="flex items-center gap-4">
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                <FaInstagram />
              </a>
              <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                <FaFacebook />
              </a>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-[#0a0a0a] shadow-lg sticky top-0 z-50 border-b border-[#C5A059]/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-16 h-16 relative">
                 <Image 
                   src="/images/logo.svg" 
                   alt="Demir Güzellik" 
                   fill 
                   className="object-contain"
                 />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {settings.siteName.split(' ')[0] || 'Demir'}
                </h1>
                <p className="text-xs text-[#C5A059] font-semibold tracking-wider uppercase">{settings.siteSlogan || 'Güzellik Merkezi'}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-[#C5A059] font-medium transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C5A059] transition-all group-hover:w-full"></span>
                </Link>
              ))}
              {isLoggedIn && (
                <Link
                  href="/my-account"
                  className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2 rounded-full hover:bg-[#C5A059] transition-all duration-300"
                >
                  <FaUser />
                  <span className="hidden xl:inline">{userName}</span>
                  <span className="xl:hidden">Hesabım</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-[#1a1a1a]"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#C5A059]/20 bg-[#1a1a1a]">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-[#1a1a1a] rounded-lg font-semibold transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              {isLoggedIn && (
                <Link
                  href="/my-account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-[#1a1a1a] text-white rounded-lg font-semibold text-center hover:bg-[#C5A059] transition-colors"
                >
                  Hesabım - {userName}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white mt-20 border-t border-white/5">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C5A059]">{settings.siteName}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {settings.siteDescription}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-[#C5A059] transition-colors text-sm">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-4">Hizmetlerimiz</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Saç Tasarım</li>
                <li>Cilt Bakımı</li>
                <li>Manikür & Pedikür</li>
                <li>Epilasyon</li>
                <li>Makyaj</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4">İletişim</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <FaPhone className="text-[#C5A059]" />
                  <span>{settings.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaWhatsapp className="text-[#C5A059]" />
                  <span>{settings.whatsapp}</span>
                </li>
                <li>{settings.address}</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition-all">
                  <FaInstagram />
                </a>
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition-all">
                  <FaFacebook />
                </a>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-black transition-all">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>{settings.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsProvider>
      <LayoutContent>{children}</LayoutContent>
    </SiteSettingsProvider>
  );
}
