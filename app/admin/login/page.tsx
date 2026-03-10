'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner, FaUserShield } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Giriş yapılamadı!');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login hatası:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059] rounded-full blur-[150px] opacity-10 animate-pulse delay-75"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C5A059]/30">
            <FaUserShield className="text-black text-5xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Yönetim Paneli</h2>
          <p className="text-gray-400">Giriş yapmak için bilgilerinizi giriniz</p>
        </div>
        
        {/* Login Kutusu */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center font-medium animate-fadeIn">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">E-posta</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#C5A059] text-gray-500">
                  <FaUser className="text-lg" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all duration-200"
                  placeholder="admin@demir.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Şifre</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#C5A059] text-gray-500">
                  <FaLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-3.5 bg-black border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-all duration-200"
                  placeholder="Şifrenizi giriniz"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-600 rounded transition-colors peer-checked:bg-[#C5A059] peer-checked:border-[#C5A059]"></div>
                  <svg className="absolute w-3 h-3 text-black left-1 top-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Beni Hatırla</span>
              </label>
              <a href="#" className="text-[#C5A059] hover:text-[#d4b06a] hover:underline transition-colors font-medium">
                Şifremi Unuttum?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex items-center justify-center py-4 px-4 border border-transparent 
                rounded-xl shadow-lg text-black bg-[#C5A059] hover:bg-[#d4b06a] hover:shadow-[#C5A059]/20
                font-bold text-lg transition-all duration-200 transform hover:-translate-y-0.5
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Demir Güzellik Salonu Yönetim Paneli
          </p>
        </div>
      </div>
    </div>
  );
}
