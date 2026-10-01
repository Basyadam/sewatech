import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  DollarSign,
  Tag,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export const AdminProductCatalog: React.FC = () => {
  const { products, addProduct, updateProduct, toggleProductStock } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('laptop-windows');
  const [subCategory, setSubCategory] = useState('Laptop Gaming / Creator');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [dailyRate, setDailyRate] = useState(250000);
  const [depositAmount, setDepositAmount] = useState(500000);
  const [stock, setStock] = useState(3);
  const [condition, setCondition] = useState<Product['condition']>('Like New');
  const [imageUrl, setImageUrl] = useState('');

  const filteredProducts = products.filter(p => {
    // Strictly filter out non-laptops
    if (p.category !== 'laptop-windows' && p.category !== 'laptop-mac') {
      return false;
    }
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setName('');
    setCategory('laptop-windows');
    setSubCategory('Laptop Gaming / Creator');
    setHeadline('Spesifikasi unggul untuk produktivitas & hiburan');
    setDescription('Unit sewa terawat dalam kondisi siap pakai lengkap dengan aksesoris original.');
    setDailyRate(200000);
    setDepositAmount(400000);
    setStock(3);
    setCondition('Like New');
    setImageUrl(products[0]?.image || '');
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        category,
        subCategory,
        headline,
        description,
        dailyRate,
        depositAmount,
        stock,
        availableStock: Math.min(editingProduct.availableStock, stock),
        condition,
        image: imageUrl || editingProduct.image
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name,
        category,
        subCategory,
        headline,
        description,
        dailyRate,
        depositAmount,
        stock,
        availableStock: stock,
        condition,
        image: imageUrl || products[0]?.image || '',
        rating: 5.0,
        reviewsCount: 1,
        specs: [
          { label: 'Kategori', value: category },
          { label: 'Kondisi Unit', value: condition }
        ],
        includedAccessories: ['Unit Utama', 'Charger & Kabel Data Original', 'Tas Pelindung / Hardcase']
      });
      setIsAddModalOpen(false);
    }
  };

  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setSubCategory(prod.subCategory || '');
    setHeadline(prod.headline);
    setDescription(prod.description);
    setDailyRate(prod.dailyRate);
    setDepositAmount(prod.depositAmount);
    setStock(prod.stock);
    setCondition(prod.condition);
    setImageUrl(prod.image);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-800" />
            <span>Manajemen Katalog & Armada Produk (Database 2)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Pengelolaan inventaris laptop Windows (ThinkPad, Dell, ASUS ROG, Legion) & Apple MacBook (Pro M3, Air M3), tarif harian & kontrol ketersediaan.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Unit Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari laptop (ThinkPad, ROG, MacBook Pro, MacBook Air, Dell XPS)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'laptop-windows', 'laptop-mac'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 text-xs rounded-lg whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white font-semibold border-stone-900 shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat === 'all'
                ? 'Semua'
                : cat === 'laptop-windows'
                ? 'Laptop Windows'
                : 'Laptop Mac'}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(prod => (
          <div
            key={prod.id}
            className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                    prod.availableStock > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {prod.availableStock > 0 ? `Ready (${prod.availableStock}/${prod.stock})` : 'Disewa Penuh'}
                </span>
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-stone-700 bg-white/95 px-2 py-0.5 rounded border border-stone-200 shadow-xs">
                {prod.condition}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] text-cyan-800 font-bold uppercase">{prod.category}</div>
                <h4 className="font-bold text-stone-900 text-sm mt-0.5 line-clamp-1">{prod.name}</h4>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {prod.headline}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block font-medium">Sewa Harian</span>
                  <span className="font-bold font-mono text-stone-900 tabular-nums">
                    Rp {prod.dailyRate.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-medium">Deposit</span>
                  <span className="font-mono text-stone-700 tabular-nums">
                    Rp {prod.depositAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => toggleProductStock(prod.id)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    prod.availableStock > 0
                      ? 'bg-[#FAF9F5] hover:bg-stone-100 text-stone-700 border-stone-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {prod.availableStock > 0 ? 'Tandai Disewa' : 'Kembalikan Ready'}
                </button>

                <button
                  onClick={() => handleEditClick(prod)}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-200"
                  title="Edit Data Produk"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Product */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                {editingProduct ? 'Edit Data Produk' : 'Tambah Armada Produk Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block mb-1">Nama Produk / Unit *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: ASUS ROG Zephyrus G16"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Kategori *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                  >
                    <option value="laptop-windows">Laptop Windows</option>
                    <option value="laptop-mac">Laptop Mac (MacBook)</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Sub Kategori</label>
                  <input
                    type="text"
                    placeholder="Contoh: Gaming & Creator"
                    value={subCategory}
                    onChange={e => setSubCategory(e.target.value)}
                    className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Ringkasan Spesifikasi (Headline)</label>
                <input
                  type="text"
                  placeholder="Intel i9, RTX 4070, 32GB RAM..."
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Deskripsi Lengkap</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Sewa/Hari (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={dailyRate}
                    onChange={e => setDailyRate(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Deposit (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={e => setDepositAmount(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Stok Unit *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  {editingProduct ? 'Perbarui Produk' : 'Simpan Produk Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
