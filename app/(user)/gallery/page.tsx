'use client';

import { useEffect, useState } from 'react';

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

export default function GalleryPage() {
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video'; src: string } | null>(null);
  const [mediaItems, setMediaItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as GalleryItem[];
      setMediaItems(data);
    } catch (error) {
      console.error('Galeri verisi yuklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    const interval = setInterval(fetchGallery, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#0a0a0a] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMyMzIzMiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">Çalışmalarımız</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Müşterilerimize sunduğumuz kaliteli hizmetlerden örnekler
          </p>
        </div>
      </section>

      {/* Gallery Section - Tüm medyalar karışık */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          {loading && <p className="text-gray-400 text-center mb-6">Yukleniyor...</p>}
          {!loading && mediaItems.length === 0 && <p className="text-gray-400 text-center mb-6">Henuz medya yok.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mediaItems.map((item, index) => {
              const type = item.category === 'video' ? 'video' : 'image';
              const src = item.imageUrl;
              return (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-[#C5A059]/50"
                onClick={() => setSelectedMedia({ type, src })}
              >
                {type === 'image' ? (
                  <img 
                    src={src} 
                    alt={`Galeri ${index + 1}`}
                    className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="relative w-full h-80">
                    <video 
                      muted 
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onLoadedMetadata={(e) => { e.currentTarget.currentTime = 5; }}
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 5; }}
                    >
                      <source src={src} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 bg-[#C5A059] rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                </div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-4xl hover:text-[#C5A059] transition-colors"
            onClick={() => setSelectedMedia(null)}
          >
            ×
          </button>
          <div className="max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.type === 'image' ? (
              <img 
                src={selectedMedia.src} 
                alt="Galeri" 
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            ) : (
              <video 
                autoPlay 
                controls 
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              >
                <source src={selectedMedia.src} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-[#1a1a1a] border-t border-[#C5A059]/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Siz de Fark Yaratın!</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Profesyonel ekibimizle tanışın ve size özel güzellik deneyimini yaşayın
          </p>
          <a
            href="/booking"
            className="inline-block bg-[#C5A059] text-black px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-[#C5A059]/50 transition-all duration-300"
          >
            Hemen Randevu Alın
          </a>
        </div>
      </section>
    </div>
  );
}
