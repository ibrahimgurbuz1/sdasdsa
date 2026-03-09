'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaCloudUploadAlt, FaImage, FaSpinner, FaTrash, FaUpload } from 'react-icons/fa';

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
};

type ApiGalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

const MAX_FILE_SIZE = 12 * 1024 * 1024;

const mapApiItem = (item: ApiGalleryItem): MediaItem => ({
  id: item.id,
  title: item.title,
  type: item.category === 'video' ? 'video' : 'image',
  url: item.imageUrl,
});

export default function AdminGallery() {
  useAdminAuth();

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({ url: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as ApiGalleryItem[];
      setMediaItems(data.map(mapApiItem));
    } catch (error) {
      console.error('Galeri yuklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    const interval = setInterval(fetchMedia, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Sadece resim ve video dosyalari yuklenebilir');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('Maksimum dosya boyutu 12MB');
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const payload = {
        title: file.name,
        type: isVideo ? 'video' : 'image',
        url: dataUrl,
      };

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Yukleme basarisiz');
      }

      const created = mapApiItem((await res.json()) as ApiGalleryItem);
      setMediaItems((prev) => [created, ...prev]);
      setShowUploadModal(false);
      setFormData({ url: '' });
      alert('Medya eklendi');
    } catch (error: any) {
      alert(error.message || 'Dosya yuklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = formData.url.trim();
    if (!url) {
      alert('URL bos olamaz');
      return;
    }

    const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(url);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `URL-${Date.now()}`,
          type: isVideo ? 'video' : 'image',
          url,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Ekleme basarisiz');
      }

      const created = mapApiItem((await res.json()) as ApiGalleryItem);
      setMediaItems((prev) => [created, ...prev]);
      setShowUploadModal(false);
      setFormData({ url: '' });
      alert('Medya eklendi');
    } catch (error: any) {
      alert(error.message || 'Islem basarisiz');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu medyayi silmek istediginize emin misiniz?')) return;

    const previous = mediaItems;
    setMediaItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Silme basarisiz');
      }
    } catch (error: any) {
      setMediaItems(previous);
      alert(error.message || 'Silme basarisiz');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Galeri Yonetimi</h1>
          <p className="text-gray-600">
            Toplam {mediaItems.length} medya {loading && <span className="text-[#C5A059]">(Yukleniyor...)</span>}
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold"
        >
          <FaUpload className="inline mr-2" />Yeni Medya Ekle
        </button>
      </div>

      {!loading && mediaItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center">
          <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henuz Medya Yok</h3>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group">
            <div className="aspect-square relative overflow-hidden">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.title || 'Galeri'} className="w-full h-full object-cover" />
              ) : (
                <video muted playsInline className="w-full h-full object-cover" controls>
                  <source src={item.url} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-3 bg-red-500 text-white rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Yeni Medya Ekle</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 text-gray-500" disabled={uploading}>✕</button>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center mb-6 ${dragActive ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-gray-300'}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <FaSpinner className="text-3xl animate-spin text-[#C5A059]" />
                  <p>Yukleniyor...</p>
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="mb-4">Dosyayi buraya surukle-birak</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold"
                  >
                    <FaUpload className="inline mr-2" />Dosya Sec
                  </button>
                  <p className="text-xs text-gray-500 mt-3">Maksimum 12MB</p>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">URL ile Ekle</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ url: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                placeholder="https://... veya /images/..."
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-3 border rounded-xl">Iptal</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold">URL Ekle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
