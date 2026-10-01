import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory } from '../types';
import {
  Laptop,
  Apple,
  Search,
  CheckCircle2,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Clock,
  X,
  Trash2,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

const RECENT_SEARCHES_KEY = 'sewatech_recent_searches';
const DEFAULT_RECENT = ['MacBook Pro M3', 'ThinkPad L14 RAM 8GB', 'ASUS ROG Zephyrus', 'MacBook Air 15 M3', 'Dell XPS 15'];
const POPULAR_SEARCHES = ['ThinkPad RAM 16GB', 'MacBook Pro M3 Max', 'ASUS Vivobook OLED', 'Dell Latitude', 'Lenovo Legion'];

export const HeroSection: React.FC = () => {
  const { categoryFilter, setCategoryFilter, searchQuery, setSearchQuery, setIsKtpModalOpen, currentUser } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_RECENT;
    } catch {
      return DEFAULT_RECENT;
    }
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync recentSearches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch (err) {
      console.error('Failed to save recent searches:', err);
    }
  }, [recentSearches]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecentSearches = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 6);
    });
  };

  const handleSelectSearch = (term: string) => {
    setSearchQuery(term);
    saveToRecentSearches(term);
    setIsSearchFocused(false);
    // Smooth scroll to catalog
    const catalogElem = document.getElementById('katalog');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        saveToRecentSearches(searchQuery);
        setIsSearchFocused(false);
        const catalogElem = document.getElementById('katalog');
        if (catalogElem) {
          catalogElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const handleRemoveSingleRecent = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(t => t !== termToRemove));
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const categories: { id: 'all' | ProductCategory; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'Semua Laptop & Mac',
      desc: 'Semua unit siap pakai',
      icon: <Layers className="w-4 h-4" />
    },
    {
      id: 'laptop-windows',
      label: 'Laptop Windows',
      desc: 'ThinkPad, Dell, ASUS ROG, Vivobook, Legion',
      icon: <Laptop className="w-4 h-4" />
    },
    {
      id: 'laptop-mac',
      label: 'MacBook & Apple Mac',
      desc: 'MacBook Pro M3 Max, Pro 14, MacBook Air M3',
      icon: <Apple className="w-4 h-4" />
    }
  ];

  return (
    <section className="relative pt-8 pb-12 overflow-hidden border-b border-stone-200/80 bg-gradient-to-b from-[#FAF9F5] via-[#F4F1EA] to-[#EAE6DE]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Editorial Hero */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs text-cyan-800 font-semibold tracking-wide uppercase mb-3">
            <span>Sewa Laptop Windows & MacBook · SewaLaptop.id</span>
            <span aria-hidden="true">·</span>
            <span>Validasi KTP Digital</span>
            <span aria-hidden="true">·</span>
            <span>Pembayaran QRIS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight [text-wrap:balance]">
            Rental Laptop Windows & MacBook Tanpa Syarat Ribet
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
            Jelajahi seluruh armada laptop kerja, coding, office, desain, dan gaming kami bebas tanpa harus mendaftar akun terlebih dahulu. Saat ingin menyewa, cukup verifikasi KTP instan dan bayar lewat QRIS dalam hitungan menit.
          </p>

          {/* Quick CTA row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#pricelist-laptop"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Lihat Pricelist Laptop (8GB & 16GB)</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#katalog"
              className="px-5 py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors shadow-xs"
            >
              Eksplorasi Katalog
            </a>

            {!currentUser && (
              <button
                onClick={() => setIsKtpModalOpen(true)}
                className="px-5 py-2.5 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors shadow-xs"
              >
                Daftar Akun Penyewa
              </button>
            )}
          </div>
        </div>

        {/* 3 Trust Proof Adjacencies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 mb-8 text-stone-700 text-xs">
          <div className="flex items-start gap-3 p-3 bg-white/90 rounded-xl border border-stone-200/90 shadow-xs">
            <div className="p-2 bg-cyan-50 rounded-lg text-cyan-800 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-900">Bebas Eksplorasi Tanpa Akun</div>
              <div className="text-stone-500 mt-0.5 leading-normal">
                Lihat spesifikasi RAM, prosesor, harga harian/mingguan/bulanan tanpa perlu login.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/90 rounded-xl border border-stone-200/90 shadow-xs">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-900">Pembayaran QRIS Simpel</div>
              <div className="text-stone-500 mt-0.5 leading-normal">
                Dukungan semua e-wallet & mobile banking dengan upload bukti transfer langsung.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/90 rounded-xl border border-stone-200/90 shadow-xs">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-stone-900">QC Unit & CS Adam WA Aktif (0831-8853-7999)</div>
              <div className="text-stone-500 mt-0.5 leading-normal">
                Laptop dites sebelum dikirim, OS bersih, charger original, dan deposit transparan.
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & Category Navigation Controls */}
        <div className="space-y-4">
          {/* Search Input with Recent Searches Dropdown */}
          <div ref={searchContainerRef} className="relative max-w-xl z-20">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari Lenovo ThinkPad, MacBook Pro M3, MacBook Air, Dell XPS, ROG..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-16 py-2.5 text-sm bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700 transition-colors shadow-xs"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-stone-500 hover:text-stone-800 px-1.5 py-0.5 rounded"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown Menu for Recent Searches */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden text-xs divide-y divide-stone-100 animate-in fade-in-50 duration-150">
                {/* Recent Searches Section */}
                <div className="p-3">
                  <div className="flex items-center justify-between text-stone-500 pb-2">
                    <span className="font-semibold text-[11px] uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Pencarian Terakhir (Recent Searches)</span>
                    </span>
                    {recentSearches.length > 0 && (
                      <button
                        onClick={handleClearAllRecent}
                        className="text-[11px] text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus Semua</span>
                      </button>
                    )}
                  </div>

                  {recentSearches.length === 0 ? (
                    <div className="py-3 text-center text-stone-400 text-[11px]">
                      Belum ada riwayat pencarian.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {recentSearches.map((term, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSearch(term)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-cyan-700 shrink-0" />
                            <span className="truncate">{term}</span>
                          </div>
                          <button
                            onClick={e => handleRemoveSingleRecent(term, e)}
                            title="Hapus dari riwayat"
                            className="p-1 text-stone-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 rounded transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular / Suggested Searches Section */}
                <div className="p-3 bg-stone-50/70">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paling Sering Dicari</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCHES.map((pop, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSearch(pop)}
                        className="px-2.5 py-1 text-[11px] bg-white hover:bg-stone-100 text-stone-700 hover:text-cyan-700 rounded-md border border-stone-200 transition-colors shadow-xs"
                      >
                        {pop}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Interactive Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const active = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:text-stone-900 hover:bg-stone-100 shadow-xs'
                  }`}
                >
                  <span className={active ? 'text-cyan-400' : 'text-stone-400'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
