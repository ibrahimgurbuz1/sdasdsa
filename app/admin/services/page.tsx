'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaPlus, FaEdit, FaTrash, FaCut, FaClock, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

type Service = {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  completedCount: number;
};

const CATEGORIES = ['Saç Bakımı', 'Sakal & Bıyık', 'Cilt Bakımı', 'Masaj', 'Tırnak Bakımı', 'Ağda & Epilasyon', 'Makyaj'];

export default function Services() {
  useAdminAuth();
  const [showNewService, setShowNewService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    duration: '',
    price: '',
    description: '',
  });
  const [newCategory, setNewCategory] = useState('');

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Hizmetler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 15000);
    return () => clearInterval(interval);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      category: CATEGORIES[0],
      duration: '',
      price: '',
      description: '',
    });
    setNewCategory('');
  };

  const addCategory = () => {
    const nextCategory = newCategory.trim();
    if (!nextCategory) {
      alert('Kategori adı boş olamaz');
      return;
    }

    const hasCategory = allFormCategories.some(
      (cat) => cat.toLowerCase() === nextCategory.toLowerCase()
    );

    if (hasCategory) {
      alert('Bu kategori zaten mevcut');
      setFormData({ ...formData, category: allFormCategories.find(cat => cat.toLowerCase() === nextCategory.toLowerCase()) || formData.category });
      setNewCategory('');
      return;
    }

    setFormData({ ...formData, category: nextCategory });
    setNewCategory('');
    alert('Kategori eklendi, hizmeti kaydederek kalıcı hale getirebilirsiniz.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!formData.name.trim()) {
      alert('Hizmet adı boş olamaz');
      return;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      alert('Geçerli bir süre giriniz');
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      alert('Geçerli bir fiyat giriniz');
      return;
    }

    try {
      const url = '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      // Veriyi düzgün formatta gönder
      const body = {
        ...(editingService && { id: editingService.id }),
        name: formData.name.trim(),
        category: formData.category.trim(),
        duration: formData.duration,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'İşlem başarısız');
      }

      const newService = await res.json();
      setServices(prev => [newService, ...prev]);
      alert(editingService ? 'Hizmet başarıyla güncellendi!' : 'Hizmet başarıyla eklendi!');
      setShowNewService(false);
      setEditingService(null);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Bir hata oluştu');
      console.error('Hizmet kaydetme hatası:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price.toString(),
      description: service.description || '',
    });
    setEditingService(service);
    setShowNewService(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    
    // Hemen UI'dan kaldır (optimistic update)
    const updatedServices = services.filter(s => s.id !== id);
    setServices(updatedServices);
    
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      alert('Hizmet başarıyla silindi!');
    } catch (error: any) {
      // Hata olursa önceki duruma döndür
      await fetchServices();
      alert(error.message || 'Hizmet silinemedi');
    }
  };

  // Benzersiz kategorileri al (mevcut hizmetlerden + sabit listeden)
  const existingCategories = [...new Set(services.map(s => s.category))];
  const allFormCategories = [...new Set([...CATEGORIES, ...existingCategories])];
  const allFilterCategories = ['Tümü', ...existingCategories];

  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const filteredServices = selectedCategory === 'Tümü' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  // Hesaplamalar
  const totalCompleted = services.reduce((sum, s) => sum + s.completedCount, 0);
  const avgDuration = services.length > 0 
    ? Math.round(services.reduce((sum, s) => sum + parseInt(s.duration) || 0, 0) / services.length) 
    : 0;
  const avgPrice = services.length > 0 
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) 
    : 0;
  const mostPopular = services.length > 0 
    ? services.reduce((max, s) => s.completedCount > max.completedCount ? s : max, services[0])?.name || '-'
    : '-';

  const stats = [
    { label: 'Toplam Hizmet', value: services.length.toString(), color: 'from-[#C5A059] to-[#C5A059]' },
    { label: 'Tamamlanan', value: totalCompleted.toString(), color: 'from-green-500 to-green-600' },
    { label: 'Ortalama Fiyat', value: `₺${avgPrice}`, color: 'from-blue-500 to-blue-600' },
    { label: 'En Popüler', value: mostPopular, color: 'from-[#ad8345] to-[#ad8345]' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hizmetler</h1>
          <p className="text-gray-600">Sunduğunuz hizmetleri yönetin {loading && <span className="text-sm text-[#C5A059]">(Yükleniyor...)</span>}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingService(null);
            setShowNewService(true);
          }}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <FaPlus />
          Yeni Hizmet
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-fadeIn">
        <div className="flex gap-2 flex-wrap">
          {allFilterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                <FaCut className="text-white text-xl" />
              </div>
              <span className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] rounded-full text-xs font-semibold">
                {service.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaClock className="text-[#C5A059]" />
                <span>{service.duration} dakika</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaMoneyBillWave className="text-green-500" />
                <span className="font-bold">₺{service.price}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaCheckCircle className="text-emerald-500" />
                <span className="font-bold text-emerald-600">{service.completedCount} Tamamlanmış</span>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleEdit(service)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
              >
                <FaEdit />
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
              >
                <FaTrash />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New / Edit Service Modal */}
      {showNewService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingService ? 'Hizmet Düzenle' : 'Yeni Hizmet'}
              </h2>
              <button
                onClick={() => {
                  setShowNewService(false);
                  setEditingService(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hizmet Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Örn: Saç Kesimi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black cursor-pointer"
                  >
                    {allFormCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                      placeholder="Yeni kategori ekle"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-semibold"
                    >
                      Ekle
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Süre (dakika)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="350"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                  rows={3}
                  placeholder="Hizmet açıklaması..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewService(false);
                    setEditingService(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {editingService ? 'Güncelle' : 'Hizmet Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
