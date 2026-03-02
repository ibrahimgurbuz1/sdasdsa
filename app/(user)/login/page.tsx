'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaLock, FaEnvelope, FaArrowLeft, FaUserPlus } from 'react-icons/fa';

export default function UserLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo için basit kontrol
    setTimeout(() => {
      if (isLogin) {
        // Login
        if (formData.email && formData.password) {
          localStorage.setItem('userAuth', 'true');
          localStorage.setItem('user', JSON.stringify({
            name: formData.name || 'Kullanıcı',
            email: formData.email,
            phone: formData.phone || '0555 123 4567'
          }));
          router.push('/my-account');
        } else {
          setError('Email ve şifre gerekli!');
          setLoading(false);
        }
      } else {
        // Register
        if (formData.name && formData.email && formData.phone && formData.password) {
          localStorage.setItem('userAuth', 'true');
          localStorage.setItem('user', JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }));
          router.push('/my-account');
        } else {
          setError('Tüm alanları doldurun!');
          setLoading(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Geri Butonu */}
        <Link href="/">
          <div className="mb-6 flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors cursor-pointer">
            <FaArrowLeft />
            <span>Ana Sayfaya Dön</span>
          </div>
        </Link>

        {/* Login/Register Kutusu */}
        <div className="bg-[#1a1a1a] rounded-3xl shadow-2xl p-8 animate-fadeIn border border-[#C5A059]/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image 
                src="/images/logo.svg" 
                alt="Demir Güzellik" 
                fill 
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Hoş Geldiniz' : 'Kayıt Ol'}
            </h1>
            <p className="text-gray-600">Demir Güzellik Salonu</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                isLogin
                  ? 'bg-black text-[#C5A059] shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? 'bg-black text-[#C5A059] shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (only for register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Ad Soyad
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all text-white placeholder-gray-500"
                    placeholder="Adınız Soyadınız"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all text-white placeholder-gray-500"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone (only for register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Telefon
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all text-white placeholder-gray-500"
                    placeholder="0555 123 4567"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#C5A059]/30 rounded-xl focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] transition-all text-white placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Demo Info */}
            {isLogin && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-800 font-semibold mb-2">📝 Demo: Herhangi bir email/şifre ile giriş yapabilirsiniz</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C5A059] text-black py-3 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'İşleniyor...'
              ) : isLogin ? (
                <>
                  <FaUser /> Giriş Yap
                </>
              ) : (
                <>
                  <FaUserPlus /> Kayıt Ol
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          {isLogin && (
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-[#C5A059] hover:text-[#C5A059]/80">
                Şifremi Unuttum
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
