'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPercent, FaCalendar, FaSync, FaTag } from 'react-icons/fa';

type Campaign = {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: string;
  services?: string;
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    startDate: '',
    endDate: '',
    status: 'active',
  });

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Kampanyalar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCampaign ? 'PATCH' : 'POST';
      const body = editingCampaign 
        ? { id: editingCampaign.id, ...formData }
        : formData;

      const res = await fetch('/api/campaigns', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchCampaigns();
        setShowNewCampaign(false);
        setEditingCampaign(null);
        setFormData({ title: '', description: '', discount: '', startDate: '', endDate: '', status: 'active' });
      }
    } catch (error) {
      console.error('Kampanya kaydedilemedi:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/campaigns?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Kampanya silinemedi:', error);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      discount: campaign.discount.toString(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
    });
    setShowNewCampaign(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'ended': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'scheduled': return 'Planlandı';
      case 'ended': return 'Sona Erdi';
      default: return status;
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalDiscount = campaigns.reduce((sum, c) => sum + c.discount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Kampanyalar</h1>
          <p className="text-gray-600">
            İndirim ve promosyonlarınızı yönetin
            {loading && <span className="text-[#C5A059] ml-2">(Yükleniyor...)</span>}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCampaign(null);
            setFormData({ title: '', description: '', discount: '', startDate: '', endDate: '', status: 'active' });
            setShowNewCampaign(true);
          }}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <FaPlus />
          Yeni Kampanya
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Toplam Kampanya</p>
            <FaTag className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-[#C5A059] to-[#C5A059] bg-clip-text text-transparent">
            {campaigns.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Aktif Kampanya</p>
            <FaPercent className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            {activeCampaigns}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Ort. İndirim</p>
            <FaPercent className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-[#ad8345] to-[#ad8345] bg-clip-text text-transparent">
            %{campaigns.length > 0 ? Math.round(totalDiscount / campaigns.length) : 0}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {!loading && campaigns.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center animate-fadeIn">
          <FaTag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Kampanya Yok</h3>
          <p className="text-gray-500">Yeni bir kampanya oluşturmak için butona tıklayın.</p>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                <FaPercent className="text-white text-xl" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                {getStatusText(campaign.status)}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-[#C5A059]">%{campaign.discount}</span>
              <span className="text-gray-500">İndirim</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <FaCalendar className="text-[#C5A059]" />
              <span suppressHydrationWarning>
                {new Date(campaign.startDate).toLocaleDateString('tr-TR')} - {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
              </span>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button 
                onClick={() => handleEdit(campaign)}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                <FaEdit />
                Düzenle
              </button>
              <button 
                onClick={() => handleDelete(campaign.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                <FaTrash />
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New/Edit Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}
              </h2>
              <button
                onClick={() => {
                  setShowNewCampaign(false);
                  setEditingCampaign(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kampanya Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Örn: Yaz İndirimi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İndirim Oranı (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durum</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black cursor-pointer"
                  >
                    <option value="active">Aktif</option>
                    <option value="scheduled">Planlandı</option>
                    <option value="ended">Sona Erdi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    rows={3}
                    placeholder="Kampanya detayları..."
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCampaign(false);
                    setEditingCampaign(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {editingCampaign ? 'Güncelle' : 'Kampanya Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
