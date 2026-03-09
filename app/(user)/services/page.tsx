'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import Link from 'next/link';

type Service = {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  description?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Hizmetler yuklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 5000);
    return () => clearInterval(interval);
  }, []);

  const grouped = useMemo(() => {
    return services.reduce<Record<string, Service[]>>((acc, service) => {
      if (!acc[service.category]) acc[service.category] = [];
      acc[service.category].push(service);
      return acc;
    }, {});
  }, [services]);

  return (
    <div>
      <section className="bg-[#0a0a0a] text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Hizmetlerimiz</h1>
          <p className="text-gray-300">Panelde yaptiginiz tum degisiklikler bu sayfaya anlik yansir.</p>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-gray-300">Yukleniyor...</p>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-300">Henuz hizmet yok.</p>
          ) : (
            Object.entries(grouped).map(([category, list]) => (
              <div key={category} className="mb-14">
                <h2 className="text-3xl font-bold text-white mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((service) => (
                    <div key={service.id} className="bg-[#1a1a1a] rounded-xl p-6 border border-[#C5A059]/20">
                      <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{service.description || 'Aciklama yok'}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-[#C5A059]">{service.price} TL</span>
                        <span className="text-gray-400 text-sm flex items-center gap-2"><FaClock />{service.duration} dk</span>
                      </div>
                      <Link href="/booking" className="inline-block bg-[#C5A059] text-black px-4 py-2 rounded-lg font-semibold">Randevu Al</Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
