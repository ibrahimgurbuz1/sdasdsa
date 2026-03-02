'use client';

import { FaCut, FaPaintBrush, FaHandSparkles, FaSpa, FaFire, FaEye, FaMagic, FaLeaf } from 'react-icons/fa';
import Link from 'next/link';

export default function ServicesPage() {
  const serviceCategories = [
    {
      category: 'Saç Tasarım ve Bakım',
      icon: FaCut,
      color: 'from-[#C5A059] to-[#C5A059]',
      services: [
        { name: 'Kadın Saç Kesimi', price: '300-500₺', duration: '45 dk', description: 'Yüz şekline uygun profesyonel saç kesimi' },
        { name: 'Erkek Saç Kesimi', price: '150-250₺', duration: '30 dk', description: 'Modern ve klasik saç kesim modelleri' },
        { name: 'Saç Boyama', price: '800-1500₺', duration: '2-3 saat', description: 'Kaliteli boya ürünleri ile doğal görünüm' },
        { name: 'Röfle/Balyaj', price: '1000-2000₺', duration: '3-4 saat', description: 'Uzman stilistlerimizle trend renkler' },
        { name: 'Fön', price: '250-400₺', duration: '30-45 dk', description: 'Profesyonel fön çekimi ve şekillendirme' },
        { name: 'Saç Bakımı', price: '400-800₺', duration: '60 dk', description: 'Keratin, botoks ve onarıcı bakımlar' },
        { name: 'Topuz & Özel Saç', price: '500-1000₺', duration: '45-60 dk', description: 'Düğün, mezuniyet ve özel gün saç modelleri' },
      ]
    },
    {
      category: 'Cilt Bakımı ve Güzellik',
      icon: FaSpa,
      color: 'from-[#ad8345] to-[#ad8345]',
      services: [
        { name: 'Cilt Temizliği', price: '600-1000₺', duration: '60-90 dk', description: 'Derin cilt temizliği ve peeling' },
        { name: 'Medikal Cilt Bakımı', price: '800-1500₺', duration: '90 dk', description: 'Akneye karşı profesyonel tedavi' },
        { name: 'HydraFacial', price: '1500-2500₺', duration: '60 dk', description: 'Son teknoloji cilt bakımı' },
        { name: 'Altın Maske', price: '1000-1800₺', duration: '60 dk', description: 'Anti-aging altın maske uygulaması' },
        { name: 'G5 Masaj', price: '400-600₺', duration: '30 dk', description: 'Kırışıklık karşıtı masaj' },
        { name: 'Leke Tedavisi', price: '800-1200₺', duration: '45 dk', description: 'Cilt lekelerine özel bakım' },
      ]
    },
    {
      category: 'Manikür & Pedikür',
      icon: FaHandSparkles,
      color: 'from-rose-500 to-rose-600',
      services: [
        { name: 'Klasik Manikür', price: '200-300₺', duration: '30 dk', description: 'El bakımı ve oje uygulaması' },
        { name: 'Kalıcı Oje', price: '350-500₺', duration: '45 dk', description: '3 hafta kalıcı oje uygulaması' },
        { name: 'Protez Tırnak', price: '800-1200₺', duration: '90-120 dk', description: 'Gel veya akrilik tırnak uygulaması' },
        { name: 'Pedikür', price: '250-400₺', duration: '45 dk', description: 'Ayak bakımı ve oje uygulaması' },
        { name: 'Tırnak Sanatı', price: '50-200₺ (ek)', duration: '15-30 dk', description: 'Özel tasarım ve süslemeler' },
      ]
    },
    {
      category: 'Epilasyon',
      icon: FaFire,
      color: 'from-orange-500 to-orange-600',
      services: [
        { name: 'İpek Kirpik', price: '800-1500₺', duration: '90-120 dk', description: 'Doğal görünümlü kirpik uzatma' },
        { name: 'Kirpik Lifting', price: '400-600₺', duration: '45 dk', description: 'Kirpik kaldırma ve boyama' },
        { name: 'Kaş Tasarımı', price: '150-250₺', duration: '20 dk', description: 'Profesyonel kaş şekillendirme' },
        { name: 'Kaş Laminasyonu', price: '500-800₺', duration: '45 dk', description: 'Kaş dolgunlaştırma uygulaması' },
        { name: 'Tam Vücut Epilasyon', price: '600-1000₺', duration: '60-90 dk', description: 'Ağda ile tüm vücut epilasyonu' },
        { name: 'Lazer Epilasyon (Tek Seans)', price: '200-1500₺', duration: '20-60 dk', description: 'Kalıcı epilasyon çözümü' },
      ]
    },
    {
      category: 'Makyaj Hizmetleri',
      icon: FaPaintBrush,
      color: 'from-[#C5A059] to-[#C5A059]',
      services: [
        { name: 'Gelin Makyajı', price: '2000-4000₺', duration: '90-120 dk', description: 'Profesyonel gelin makyajı ve prova' },
        { name: 'Nişan/Sözü Makyajı', price: '1500-2500₺', duration: '60-90 dk', description: 'Özel gün makyajı' },
        { name: 'Davet Makyajı', price: '800-1500₺', duration: '45-60 dk', description: 'Akşam ve davet makyajı' },
        { name: 'Günlük Makyaj', price: '500-800₺', duration: '30-45 dk', description: 'Doğal ve hafif makyaj' },
        { name: 'Kalıcı Makyaj (Kaş)', price: '3000-5000₺', duration: '2-3 saat', description: 'Microblading kaş uygulaması' },
        { name: 'Kalıcı Makyaj (Eyeliner)', price: '2500-4000₺', duration: '90-120 dk', description: 'Eyeliner dövmesi' },
      ]
    },
    {
      category: 'Masaj ve Terapi',
      icon: FaLeaf,
      color: 'from-green-500 to-green-600',
      services: [
        { name: 'İsveç Masajı', price: '600-900₺', duration: '60 dk', description: 'Rahatlatıcı tam vücut masajı' },
        { name: 'Aromaterapi Masajı', price: '700-1000₺', duration: '60 dk', description: 'Esansiyel yağlarla terapi' },
        { name: 'Taş Masajı', price: '800-1200₺', duration: '75 dk', description: 'Sıcak taş terapisi' },
        { name: 'Anti-Selülit Masajı', price: '500-800₺', duration: '45 dk', description: 'Bölgesel zayıflama masajı' },
        { name: 'Refleksoloji', price: '400-600₺', duration: '45 dk', description: 'Ayak refleks noktaları masajı' },
      ]
    }
  ];

  return (
    <div>
      {/* Hero Section with Video Background */}
      <section className="bg-[#0a0a0a] text-white py-32 relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src="/videos/AQNfdtXqhwhhJ_GuOBXThTauVGnpw4cSzoy3Vrkv2GdGE7CCRCu14-EbrHTY2Clw3TRiCIoA2fok6umBjoy9KuYtu1Nq-cvobDe9V0U.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0a0a0a]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-6 py-2 bg-[#C5A059]/20 backdrop-blur-sm rounded-full border border-[#C5A059]/30 mb-6">
            <span className="text-[#C5A059] font-semibold">Premium Güzellik Hizmetleri</span>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Hizmetlerimiz</h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Size özel profesyonel güzellik ve bakım hizmetleri sunuyoruz
          </p>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          {serviceCategories.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <div key={catIndex} className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-16 h-16 bg-[#C5A059]/20 rounded-2xl flex items-center justify-center`}>
                    <Icon className="text-[#C5A059] text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="bg-[#1a1a1a] rounded-xl shadow-lg p-6 hover:shadow-2xl hover:shadow-[#C5A059]/30 transition-all duration-300 border border-[#C5A059]/20 hover:-translate-y-1"
                    >
                      <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-[#C5A059]">
                            {service.price}
                          </p>
                          <p className="text-sm text-gray-500">{service.duration}</p>
                        </div>
                        <Link
                          href="/booking"
                          className="bg-[#C5A059] text-black px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 text-sm font-semibold"
                        >
                          Randevu Al
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1a1a1a] border-t border-[#C5A059]/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Hizmetlerimiz Hakkında Detaylı Bilgi</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Fiyatlar ve süreler ortalama değerlerdir. Kesin fiyat ve süre için lütfen bizimle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-black px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300"
            >
              Hemen Randevu Al
            </Link>
            <Link
              href="/contact"
              className="bg-[#C5A059] text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#C5A059]/50 transition-all duration-300 border-2 border-[#C5A059]"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
