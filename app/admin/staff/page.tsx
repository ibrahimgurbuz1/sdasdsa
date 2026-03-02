'use client';

import { useState, useEffect } from 'react';
import { FaUserPlus, FaStar, FaCalendarCheck, FaMoneyBillWave, FaPhone, FaEnvelope, FaSync, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  categories: string;
  isActive: boolean;
  avatar?: string;
  totalAppointments: number;
  revenue: number;
  avgRating: number;
};

const CATEGORIES = [
  'Saç Bakımı',
  'Sakal & Bıyık',
  'Cilt Bakımı',
  'Masaj',
  'Tırnak Bakımı',
  'Ağda & Epilasyon',
  'Makyaj',
];

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showNewStaff, setShowNewStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    categories: [] as string[],
    isActive: true,
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      console.error('Personel yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    const interval = setInterval(fetchStaff, 30000);
    return () => clearInterval(interval);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      categories: [],
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';
      const body = editingStaff
        ? { id: editingStaff.id, ...formData, categories: JSON.stringify(formData.categories) }
        : { ...formData, categories: JSON.stringify(formData.categories) };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'İşlem başarısız');
      }

      setShowNewStaff(false);
      setEditingStaff(null);
      resetForm();
      fetchStaff();
    } catch (error: any) {
      alert(error.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = (member: StaffMember) => {
    let cats: string[] = [];
    try {
      cats = JSON.parse(member.categories);
    } catch {
      cats = member.categories.split(',').map(c => c.trim());
    }
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      specialty: member.specialty,
      categories: cats,
      isActive: member.isActive,
    });
    setEditingStaff(member);
    setShowNewStaff(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu personeli silmek istediğinizden emin misiniz?')) return;
    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      fetchStaff();
      setSelectedStaff(null);
    } catch (error: any) {
      alert(error.message || 'Personel silinemedi');
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const totalRevenue = staff.reduce((sum, s) => sum + (s.revenue || 0), 0);
  const totalAppointments = staff.reduce((sum, s) => sum + (s.totalAppointments || 0), 0);
  const avgRating = staff.length > 0 
    ? (staff.reduce((sum, s) => sum + (s.avgRating || 0), 0) / staff.length).toFixed(1)
    : '0.0';

  const stats = [
    { label: 'Toplam Personel', value: staff.length.toString(), color: 'from-[#C5A059] to-[#C5A059]', icon: FaUserPlus },
    { label: 'Ortalama Rating', value: `${avgRating}★`, color: 'from-yellow-500 to-yellow-600', icon: FaStar },
    { label: 'Toplam Randevu', value: totalAppointments.toString(), color: 'from-blue-500 to-blue-600', icon: FaCalendarCheck },
    { label: 'Toplam Gelir', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, color: 'from-green-500 to-green-600', icon: FaMoneyBillWave },
  ];

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const parseCategories = (categories: string) => {
    try {
      const parsed = JSON.parse(categories);
      return Array.isArray(parsed) ? parsed : categories.split(',').map(c => c.trim());
    } catch {
      return categories.split(',').map(c => c.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Personel</h1>
          <p className="text-gray-600">
            Çalışan yönetimi ve performans takibi
            {loading && <span className="text-[#C5A059] ml-2">(Yükleniyor...)</span>}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStaff}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Yenile
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingStaff(null);
              setShowNewStaff(true);
            }}
            className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <FaUserPlus />
            Yeni Personel
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <Icon className="text-gray-400" />
              </div>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} suppressHydrationWarning>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && staff.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center animate-fadeIn">
          <FaUserPlus className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Personel Yok</h3>
          <p className="text-gray-500">Personel eklemek için veritabanını kontrol edin.</p>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold text-xl">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-[#C5A059]">{member.specialty}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(member.isActive)}`}>
                {member.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhone className="text-[#C5A059]" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaEnvelope className="text-[#C5A059]" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${i < Math.round(member.avgRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">({member.avgRating?.toFixed(1) || '0.0'})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {parseCategories(member.categories).map((cat, i) => (
                <span key={i} className="px-2 py-1 bg-[#C5A059]/20 text-[#C5A059] rounded-full text-xs">
                  {cat.trim()}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-600 mb-1">Randevular</p>
                <p className="text-lg font-bold text-gray-800">{member.totalAppointments || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Gelir</p>
                <p className="text-lg font-bold text-green-600" suppressHydrationWarning>
                  ₺{(member.revenue || 0).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedStaff(member)}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
            >
              Detayları Görüntüle
            </button>
          </div>
        ))}
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Personel Detayı</h2>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C5A059] to-[#ad8345] rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-3">
                {selectedStaff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{selectedStaff.name}</h3>
              <p className="text-[#C5A059]">{selectedStaff.specialty}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedStaff.isActive)}`}>
                {selectedStaff.isActive ? 'Aktif' : 'Pasif'}
              </span>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${i < Math.round(selectedStaff.avgRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-[#C5A059]" />
                <span className="text-gray-800">{selectedStaff.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-[#C5A059]" />
                <span className="text-gray-800">{selectedStaff.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#C5A059]/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Randevular</p>
                <p className="text-2xl font-bold text-[#C5A059]">{selectedStaff.totalAppointments || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-green-600" suppressHydrationWarning>
                  ₺{(selectedStaff.revenue || 0).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Kategoriler:</p>
              <div className="flex flex-wrap gap-2">
                {parseCategories(selectedStaff.categories).map((cat, i) => (
                  <span key={i} className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] rounded-full text-sm">
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleEdit(selectedStaff);
                  setSelectedStaff(null);
                }}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaEdit /> Düzenle
              </button>
              <button
                onClick={() => handleDelete(selectedStaff.id)}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaTrash /> Sil
              </button>
            </div>
            <button
              onClick={() => setSelectedStaff(null)}
              className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* New / Edit Staff Modal */}
      {showNewStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingStaff ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
              </h2>
              <button
                onClick={() => {
                  setShowNewStaff(false);
                  setEditingStaff(null);
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Örn: Ahmet Yıldız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="0500 000 00 00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Uzmanlık Alanı</label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Örn: Saç Uzmanı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durum</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black cursor-pointer"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategoriler
                    <span className="text-[#C5A059] ml-1 text-xs">({formData.categories.length} seçili)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                          formData.categories.includes(cat)
                            ? 'bg-[#C5A059] text-black border-[#C5A059]'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-[#C5A059]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {formData.categories.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">En az bir kategori seçin</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewStaff(false);
                    setEditingStaff(null);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={formData.categories.length === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingStaff ? 'Güncelle' : 'Personel Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
