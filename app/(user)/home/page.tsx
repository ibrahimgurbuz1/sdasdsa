'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaCut, FaPaintBrush, FaHandSparkles, FaSpa, FaStar, FaCheck, FaArrowRight, FaTimes, FaUserTie, FaShieldAlt, FaGem, FaTag, FaLaptop, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';
import { useSiteSettings } from '@/lib/SiteSettingsContext';

export default function UserHomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { settings } = useSiteSettings();

  const services = [
    {
      icon: FaCut,
      title: 'Saç Tasarım',
      description: 'Kesim, boya, röfle, fön ve saç bakımı',
      color: 'from-[#C5A059] to-[#ad8345]',
    },
    {
      icon: FaHandSparkles,
      title: 'Tırnak Bakımı',
      description: 'Manikür, pedikür, protez tırnak',
      color: 'from-[#C5A059] to-[#ad8345]',
    },
    {
      icon: FaSpa,
      title: 'Cilt Bakımı',
      description: 'Yüz bakımı, maske, peeling',
      color: 'from-[#C5A059] to-[#ad8345]',
    },
    {
      icon: FaPaintBrush,
      title: 'Makyaj',
      description: 'Günlük, gece, gelin makyajı',
      color: 'from-[#C5A059] to-[#ad8345]',
    },
  ];

  const features = [
    { text: 'Uzman kadro', icon: FaUserTie },
    { text: 'Hijyenik ortam', icon: FaShieldAlt },
    { text: 'Kaliteli ürünler', icon: FaGem },
    { text: 'Uygun fiyatlar', icon: FaTag },
    { text: 'Online randevu', icon: FaLaptop },
    { text: 'Müşteri memnuniyeti', icon: FaHeart },
  ];

  const testimonials = [
    {
      name: 'Ayşe Y.',
      rating: 5,
      comment: 'Harika bir deneyimdi! Saçlarım çok güzel oldu, kesinlikle tavsiye ederim.',
      service: 'Saç Boyama'
    },
    {
      name: 'Zeynep K.',
      rating: 5,
      comment: 'Çok profesyonel bir ekip. Cilt bakımı sonrası kendimi harika hissettim.',
      service: 'Cilt Bakımı'
    },
    {
      name: 'Elif D.',
      rating: 5,
      comment: 'Gelin makyajım muhteşemdi! Tüm gün kusursuz durdu. Teşekkürler!',
      service: 'Gelin Makyajı'
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#0a0a0a] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMyMzIzMiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="animate-fadeIn lg:col-span-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {settings.heroTitle}, 
                <span className="block text-[#C5A059]">
                  {settings.heroTitleHighlight}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                {settings.siteDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/booking"
                  className="bg-[#C5A059] text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group text-sm md:text-base"
                >
                  <FaCalendarAlt />
                  Online Randevu Al
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="bg-transparent text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 border border-white/30 text-sm md:text-base"
                >
                  Hizmetleri Keşfet
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block lg:col-span-3 h-[450px]">
              <div className="absolute inset-0 w-full h-full bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden border border-[#C5A059]/30">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={settings.heroVideoUrl || '/videos/hero-video.mp4'} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Overlay gradient for better integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
              {/* Decorative elements behind/around the video */}
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full border-2 border-[#C5A059]/20 rounded-2xl"></div>
              <div className="absolute -z-10 -top-4 -left-4 w-full h-full border-2 border-[#C5A059]/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Section - Simple Vertical Stack */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNDNUEwNTkiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#C5A059] mb-4 tracking-tight">Kampanyalar</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Size özel hazırladığımız kaçırılmayacak fırsatlar ve indirimli paketler.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            <div 
              onClick={() => setSelectedImage('/images/info-7f4e.jpeg')}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 cursor-pointer border border-white/10 aspect-[3/4]"
            >
              <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
              <Image
                src="/images/info-7f4e.jpeg"
                alt="Kampanya 1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-1 bg-[#C5A059] rounded-full"></div>
                  <span className="text-[#C5A059] text-xs font-semibold tracking-wider uppercase">Fırsat</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-1">Büyük Yaz İndirimi</h3>
                <p className="text-gray-300 text-xs">
                  Tüm cilt bakımlarında %30 indirim.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedImage('/images/info-64ef.jpeg')}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 cursor-pointer border border-white/10 aspect-[3/4]"
            >
              <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
              <Image
                src="/images/info-64ef.jpeg"
                alt="Kampanya 2"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-1 bg-[#C5A059] rounded-full"></div>
                  <span className="text-[#C5A059] text-xs font-semibold tracking-wider uppercase">Paket</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-1">Gelin Paketi</h3>
                <p className="text-gray-300 text-xs">
                  Gelin saç ve makyajda özel fiyat.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedImage('/images/info-b700.jpeg')}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 cursor-pointer border border-white/10 aspect-[3/4]"
            >
              <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
              <Image
                src="/images/info-b700.jpeg"
                alt="Kampanya 3"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-1 bg-[#C5A059] rounded-full"></div>
                  <span className="text-[#C5A059] text-xs font-semibold tracking-wider uppercase">İndirim</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-1">Lazer Epilasyon</h3>
                <p className="text-gray-300 text-xs">
                  8 seans paket alana 2 seans hediye.
                </p>
              </div>
            </div>

            <div 
              onClick={() => setSelectedImage('/images/lazer-epilasyon.jpg')}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-[#C5A059]/30 transition-all duration-300 cursor-pointer border border-white/10 aspect-[3/4]"
            >
              <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
              <Image
                src="/images/lazer-epilasyon.jpg"
                alt="Lazer Epilasyon Kampanyası"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-1 bg-[#C5A059] rounded-full"></div>
                  <span className="text-[#C5A059] text-xs font-semibold tracking-wider uppercase">Kampanya</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-1">Lazer Epilasyon</h3>
                <p className="text-gray-300 text-xs">
                  Profesyonel lazer epilasyon servisinde özel fırsat!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="group bg-[#0a0a0a] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-[#C5A059]/20 hover:-translate-y-2"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-3xl text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <Link
                    href="/services"
                    className="text-[#C5A059] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    Detayı Gör
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Neden Biz?</h2>
            <p className="text-gray-400 text-lg">Müşteri memnuniyeti odaklı yaklaşımımız</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#C5A059]/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FeatureIcon className="text-black text-xl" />
                  </div>
                  <span className="text-gray-300 font-semibold text-lg">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Müşteri Yorumları</h2>
            <p className="text-gray-400 text-lg">Sizden gelenler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] rounded-2xl p-8 shadow-lg relative border border-[#C5A059]/20"
              >
                <div className="absolute -top-4 left-8 text-6xl text-[#C5A059] opacity-20">"</div>
                <div className="flex text-[#C5A059] mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">{testimonial.comment}</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                     {testimonial.name.charAt(0)}
                   </div>
                   <div>
                     <h4 className="font-bold text-white">{testimonial.name}</h4>
                     <p className="text-xs text-gray-400">{testimonial.service}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-[#C5A059] transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes size={32} />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedImage}
              alt="Büyük Görünüm"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
