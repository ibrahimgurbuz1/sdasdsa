'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../useAdminAuth';
import { FaPlus, FaEdit, FaTrash, FaBox, FaExclamationTriangle, FaSync, FaSearch } from 'react-icons/fa';

type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  supplier?: string;
};

type Stats = {
  totalProducts: number;
  lowStock: number;
  totalValue: number;
  categories: number;
};

export default function Inventory() {
  useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, lowStock: 0, totalValue: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    minStock: '10',
    unit: 'adet',
    price: '',
    supplier: '',
  });

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Envanter yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 30000);
    return () => clearInterval(interval);
  }, []);

  const categories = ['Tümü', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!formData.name.trim()) {
      alert('Ürün adı boş olamaz');
      return;
    }
    if (!formData.category.trim()) {
      alert('Kategori boş olamaz');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('Geçerli bir stok miktarı giriniz');
      return;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      alert('Geçerli bir fiyat giriniz');
      return;
    }

    try {
      const method = editingProduct ? 'PATCH' : 'POST';
      
      // Veriyi düzgün formatta gönder
      const body = {
        ...(editingProduct && { id: editingProduct.id }),
        name: formData.name.trim(),
        category: formData.category.trim(),
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock) || 10,
        unit: formData.unit.trim(),
        price: parseFloat(formData.price),
        supplier: formData.supplier.trim(),
      };

      const res = await fetch('/api/inventory', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'İşlem başarısız');
      }

      await fetchInventory();
      alert(editingProduct ? 'Ürün başarıyla güncellendi!' : 'Ürün başarıyla eklendi!');
      setShowNewProduct(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', stock: '', minStock: '10', unit: 'adet', price: '', supplier: '' });
    } catch (error: any) {
      alert(error.message || 'Bir hata oluştu');
      console.error('Ürün kaydetme hatası:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch(`/api/inventory?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Silme başarısız');
      }
      await fetchInventory();
      alert('Ürün başarıyla silindi!');
    } catch (error: any) {
      alert(error.message || 'Ürün silinemedi');
      console.error('Ürün silme hatası:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      unit: product.unit,
      price: product.price.toString(),
      supplier: product.supplier || '',
    });
    setShowNewProduct(true);
  };

  const statCards = [
    { label: 'Toplam Ürün', value: stats.totalProducts.toString(), color: 'from-[#C5A059] to-[#C5A059]', icon: FaBox },
    { label: 'Düşük Stok', value: stats.lowStock.toString(), color: 'from-red-500 to-red-600', icon: FaExclamationTriangle },
    { label: 'Toplam Değer', value: `₺${stats.totalValue.toLocaleString('tr-TR')}`, color: 'from-green-500 to-green-600', icon: FaBox },
    { label: 'Kategori', value: stats.categories.toString(), color: 'from-blue-500 to-blue-600', icon: FaBox },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeIn">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Envanter</h1>
          <p className="text-gray-600">
            Ürün ve stok yönetimi
            {loading && <span className="text-[#C5A059] ml-2">(Yükleniyor...)</span>}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', category: '', stock: '', minStock: '10', unit: 'adet', price: '', supplier: '' });
            setShowNewProduct(true);
          }}
          className="bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <FaPlus />
          Yeni Ürün
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {statCards.map((stat, index) => {
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

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 animate-fadeIn">
        <div className="flex-1 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
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
      </div>

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center animate-fadeIn">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz Ürün Yok</h3>
          <p className="text-gray-500">Yeni bir ürün eklemek için butona tıklayın.</p>
        </div>
      )}

      {/* Products Table */}
      {filteredProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ürün</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Kategori</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Stok</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Fiyat</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tedarikçi</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                          <FaBox className="text-white" />
                        </div>
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-bold ${product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock} {product.unit}
                      </span>
                      {product.stock <= product.minStock && (
                        <FaExclamationTriangle className="inline ml-2 text-red-500" />
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-800" suppressHydrationWarning>
                      ₺{product.price.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {product.supplier || '-'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New/Edit Product Modal */}
      {showNewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün'}
              </h2>
              <button
                onClick={() => {
                  setShowNewProduct(false);
                  setEditingProduct(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Örn: Şampuan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Örn: Saç Bakım"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Birim</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black cursor-pointer"
                  >
                    <option value="adet">Adet</option>
                    <option value="kutu">Kutu</option>
                    <option value="şişe">Şişe</option>
                    <option value="paket">Paket</option>
                    <option value="kg">Kg</option>
                    <option value="lt">Litre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stok</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min. Stok</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="10"
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
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tedarikçi</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none bg-white text-black"
                    placeholder="Örn: L'Oreal"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProduct(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#ad8345] text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {editingProduct ? 'Güncelle' : 'Ürün Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
