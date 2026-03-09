'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaTrash, FaUpload, FaImage, FaSpinner, FaCloudUploadAlt } from 'react-icons/fa';

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  url: string;
};

export default function AdminGallery() {
  useAdminAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    url: '',
  });

  // Tüm medya dosyaları karışık
  const staticMedia: MediaItem[] = [
    { id: 'img-1', type: 'image', url: '/images/585423595_122108156013083638_4684200036309214416_n..jpg' },
    { id: 'vid-1', type: 'video', url: '/videos/AQMN5f4-Mi1kZ9-828w4nmsfVa5ptaE2TsfdmOkdlnZPNGRedbK31G5hUKTxh3yeVQYNczAR592tpGoCRSJtynfF9dtG5OlLR-1TsHk.mp4' },
    { id: 'img-2', type: 'image', url: '/images/589167628_122109067953083638_1588938081792428857_n..jpg' },
    { id: 'vid-2', type: 'video', url: '/videos/AQNM2vLRAvzqE2mKGItz3qs8hFzhYPjr2KyBbw4Asngycvi2xK5yeMJtEFGOMG3_-KUUQUlt8LJC5uCGoOjayIOLuMY8Np1c.mp4' },
    { id: 'img-3', type: 'image', url: '/images/594100529_122110689213083638_7179114761612870739_n..jpg' },
    { id: 'vid-3', type: 'video', url: '/videos/AQNp-4_w7hmIbfBNYvkN8BkK2NIlwMInCIF-TiKENhy8aWL3YWE1M-LqsnVDkKSF-GabL6_R9sbJqSa9cQ0nBB6wKS70rOTs0seW2lY.mp4' },
    { id: 'img-4', type: 'image', url: '/images/596063079_122111095983083638_3381646773219951484_n..jpg' },
    { id: 'vid-4', type: 'video', url: '/videos/AQOQg9-6E9RaTFctbG85lg3SHNlhKkjb5PuS_iz71yZsj8EaAmxyAZUki5Z-ely5enckfiHrSVR7W0zZBj43VpyU_6Edrsx_.mp4' },
    { id: 'img-5', type: 'image', url: '/images/597551827_122111562711083638_8445761000020730382_n..jpg' },
    { id: 'vid-5', type: 'video', url: '/videos/AQOlzQjaPABDMfNmUuq21hsxUKj-fkVFCfz6M89jV0bG9kI9OYhmqfpvysqOYlr3v4ZCfRqpUE70iAws8TJMmM_Ag9NeDmat.mp4' },
    { id: 'img-6', type: 'image', url: '/images/597552177_122111862837083638_6008478305036244426_n..jpg' },
    { id: 'vid-6', type: 'video', url: '/videos/AQP9ae5TdJwcaiYBwvxo5S09nAtfNv7c2F6AO8QfRCiXlcessL9MqgpdTNc3g5alp7aQp1G7_KdkZwoa5Sgf_1MwOOYZjfZY.mp4' },
    { id: 'img-7', type: 'image', url: '/images/599941626_122112861981083638_8137216023031339708_n..jpg' },
    { id: 'vid-7', type: 'video', url: '/videos/AQPvCm-k-LesSx0qZ3dfPb5ctrx-tW71PpxnT5AdajIIjtVesVnGbNUwpIDYEYxrMaxitjdiZOaG7P_AUkmofGgeogEkDuGB.mp4' },
    { id: 'img-8', type: 'image', url: '/images/600298904_122112477351083638_6274367331590897151_n..jpg' },
    { id: 'vid-8', type: 'video', url: '/videos/AQPxaELP6EBfG6eXxBeAaLI_vebduN8gXvxUiIlP3GXOZb9UHOLpRu9R6q_vW6fhTMMiKjB7Z3TZqEl9HZARKPpRBLv6YmH9.mp4' },
    { id: 'img-9', type: 'image', url: '/images/602995360_122113242213083638_5246041994386207911_n..jpg' },
  ];

  useEffect(() => {
    setMediaItems(staticMedia);
    setLoading(false);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Dosya tipini kontrol et
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Sadece resim ve video dosyaları yüklenebilir');
      return;
    }

    // Dosya boyutu kontrolü (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Dosya boyutu maksimum 50MB olabilir');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Yükleme başarısız');
      }

      const data = await res.json();
      
      const newItem: MediaItem = {
        id: `custom-${Date.now()}`,
        type: data.type,
        url: data.url,
      };

      setMediaItems([newItem, ...mediaItems]);
      alert('Dosya başarıyla yüklendi!');
      setShowUploadModal(false);
    } catch (error: any) {
      alert(error.message || 'Dosya yüklenemedi');
      console.error('Yükleme hatası:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.trim()) {
      alert('URL boş olamaz');
      return;
    }
    const isVideo = formData.url.includes('.mp4') || formData.url.includes('.webm') || formData.url.includes('.mov');
    const newItem: MediaItem = {
      id: `custom-${Date.now()}`,
      type: isVideo ? 'video' : 'image',
      url: formData.url,
    };
    setMediaItems([newItem, ...mediaItems]);
    setShowUploadModal(false);
    setFormData({ url: '' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bu medyayı galeride gizlemek istediğinize emin misiniz?')) return;
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Galeri Yönetimi</h1>
          <p className="text-gray-600">
            Müşterilere gösterilecek fotoğraf ve videoları yönetin • Toplam {mediaItems.length} medya
            {loading && <span className="text-[#C5A059] ml-2">(Yükleniyor...)</span>}
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <FaUpload />
          Yeni Medya Ekle
        </button>
      </div>

      {/* Empty State */}
      {!loading && mediaItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center animate-fadeIn">
          <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Medya Yok</h3>
          <p className="text-gray-500">Yeni bir fotoğraf veya video eklemek için butona tıklayın.</p>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="aspect-square bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/10 flex items-center justify-center relative overflow-hidden">
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt="Galeri"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedMetadata={(e) => { e.currentTarget.currentTime = 5; }}
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 5; }}
                  >
                    <source src={item.url} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform scale-75 group-hover:scale-100"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Yeni Medya Ekle</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setFormData({ url: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                disabled={uploading}
              >
                ✕
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 mb-6 ${
                dragActive 
                  ? 'border-[#C5A059] bg-[#C5A059]/10' 
                  : 'border-gray-300 hover:border-[#C5A059] hover:bg-gray-50'
              } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
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
                <div className="flex flex-col items-center gap-4">
                  <FaSpinner className="text-5xl text-[#C5A059] animate-spin" />
                  <p className="text-lg font-semibold text-gray-700">Yükleniyor...</p>
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Dosyayı buraya sürükleyin
                  </h3>
                  <p className="text-gray-500 mb-4">veya</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                  >
                    <FaUpload />
                    Dosya Seç
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    Desteklenen formatlar: JPG, PNG, GIF, MP4, WEBM, MOV (Max 50MB)
                  </p>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 font-medium">VEYA URL İLE EKLE</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* URL Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Medya URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                  placeholder="/images/foto.jpg veya /videos/video.mp4"
                  disabled={uploading}
                />
                <p className="text-xs text-gray-500 mt-1">Uzantıya göre otomatik olarak fotoğraf veya video olarak eklenir</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setFormData({ url: '' });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={uploading}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading}
                >
                  URL ile Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
