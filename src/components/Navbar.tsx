import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  ShieldCheck,
  User,
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Menu,
  X,
  Truck,
  FileText,
  HelpCircle,
  Laptop,
  Lock,
  Shield
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    currentUser,
    setCurrentUser,
    currentAdmin,
    adminLogout,
    setIsAdminAuthModalOpen,
    setIsKtpModalOpen,
    setIsNotificationDrawerOpen,
    notifications,
    orders,
    setIsTrackingModalOpen,
    setActiveOrder,
    setCategoryFilter
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeOrdersCount = orders.filter(
    o => o.status !== 'completed' && (!currentUser || o.customerId === currentUser.id)
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Announcement / Mode Switcher Bar */}
      <div className="bg-[#F5F3ED] px-3 sm:px-4 py-1.5 border-b border-stone-200/70 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left badge */}
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-semibold text-stone-800 text-[11px] sm:text-xs">SewaLaptop.id Hub</span>
            <span className="hidden md:inline text-stone-400">·</span>
            <span className="text-stone-500 truncate hidden md:inline text-[11px]">
              Rental Laptop Windows & MacBook Profesional · RAM 8GB / 16GB / 32GB · QRIS & Validasi KTP
            </span>
          </div>

          {/* Right Mode Switcher & Admin State */}
          <div className="flex items-center gap-2 shrink-0">
            {currentAdmin && (
              <div className="hidden sm:flex items-center gap-1.5 bg-stone-900 text-white px-2 py-0.5 rounded-md text-[11px]">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span className="font-semibold truncate max-w-[90px]">{currentAdmin.name.split(' ')[0]}</span>
                <span className="text-[10px] text-cyan-300 font-mono">({currentAdmin.role})</span>
                <button
                  type="button"
                  onClick={adminLogout}
                  title="Keluar dari sesi Admin"
                  className="ml-1 text-stone-400 hover:text-rose-300 p-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg border border-stone-300/70 text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode('renter')}
                className={`px-2 py-0.5 font-medium rounded-md transition-colors ${
                  viewMode === 'renter'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Penyewa
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!currentAdmin) {
                    setIsAdminAuthModalOpen(true);
                  } else {
                    setViewMode('admin');
                  }
                }}
                className={`px-2 py-0.5 font-medium rounded-md transition-colors flex items-center gap-1 ${
                  viewMode === 'admin'
                    ? 'bg-cyan-800 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title={currentAdmin ? 'Dashboard Admin Aktif' : 'Login / Daftar Akun Admin'}
              >
                {currentAdmin ? (
                  <SlidersHorizontal className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3 text-stone-500" />
                )}
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              setViewMode('renter');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 hover:text-cyan-800 transition-colors"
          >
            Sewa<span className="text-cyan-700">Laptop.id</span>
          </a>
          <span className="hidden md:inline text-stone-300">|</span>
          <span className="hidden md:inline text-xs text-stone-500">
            Rental Laptop Windows & MacBook
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a
            href="#pricelist-laptop"
            onClick={() => setViewMode('renter')}
            className="hover:text-stone-900 transition-colors"
          >
            Pricelist Laptop
          </a>
          <a
            href="#katalog"
            onClick={() => setViewMode('renter')}
            className="hover:text-stone-900 transition-colors"
          >
            Katalog Armada
          </a>
          <a
            href="#cara-sewa"
            onClick={() => setViewMode('renter')}
            className="hover:text-stone-900 transition-colors"
          >
            Alur Sewa & KTP
          </a>
          <a
            href="#jaminan"
            onClick={() => setViewMode('renter')}
            className="hover:text-stone-900 transition-colors"
          >
            Ketentuan & Deposit
          </a>
          <button
            type="button"
            onClick={() => {
              setViewMode('renter');
              if (orders.length > 0) {
                setActiveOrder(orders[0]);
                setIsTrackingModalOpen(true);
              }
            }}
            className="hover:text-cyan-800 transition-colors flex items-center gap-1.5"
          >
            <span>Lacak Pesanan</span>
            {activeOrdersCount > 0 && (
              <span className="text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200 px-1.5 py-0.2 rounded font-mono font-bold">
                {activeOrdersCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Controls & Mobile Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Quick Tracking Button on Mobile */}
          <button
            type="button"
            onClick={() => {
              setViewMode('renter');
              if (orders.length > 0) {
                setActiveOrder(orders[0]);
                setIsTrackingModalOpen(true);
              }
            }}
            title="Lacak Status Pesanan"
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg relative"
          >
            <Truck className="w-4 h-4" />
            {activeOrdersCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-600 rounded-full" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setIsNotificationDrawerOpen(true)}
            aria-label="Pemberitahuan"
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-700 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* User Account / Login State */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-100 border border-stone-200 rounded-lg p-1 sm:p-1.5 sm:pl-3">
              <div className="text-left text-xs leading-tight hidden sm:block">
                <div className="font-semibold text-stone-900 flex items-center gap-1">
                  <span>{currentUser.fullName.split(' ')[0]}</span>
                  {currentUser.ktpStatus === 'verified' && (
                    <span title="KTP Terverifikasi">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-stone-500 capitalize">
                  {currentUser.ktpStatus === 'verified' ? 'KTP Terverifikasi' : 'KTP Pending'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentUser(null)}
                title="Keluar / Ganti Akun"
                className="p-1 sm:p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-200 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsKtpModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Daftar / Verifikasi KTP</span>
              <span className="sm:hidden">Daftar / KTP</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <a
            href="#pricelist-laptop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-xs font-semibold text-stone-800 hover:text-cyan-800 border-b border-stone-100"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Pricelist Sewa Laptop (Standar & RAM 16)</span>
          </a>
          <a
            href="#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border-b border-stone-100"
          >
            <Laptop className="w-4 h-4 text-cyan-800" />
            <span>Katalog Produk (Laptop Windows & MacBook)</span>
          </a>
          <a
            href="#cara-sewa"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border-b border-stone-100"
          >
            <FileText className="w-4 h-4 text-stone-500" />
            <span>Alur Peminjaman & Verifikasi KTP</span>
          </a>
          <a
            href="#jaminan"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border-b border-stone-100"
          >
            <HelpCircle className="w-4 h-4 text-stone-500" />
            <span>Ketentuan Deposit & Pembayaran QRIS</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (orders.length > 0) {
                setActiveOrder(orders[0]);
                setIsTrackingModalOpen(true);
              }
            }}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-cyan-800 hover:text-cyan-900 border-b border-stone-100"
          >
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Lacak Pesanan Saya</span>
            </span>
            {activeOrdersCount > 0 && (
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-mono font-bold">
                {activeOrdersCount} aktif
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setViewMode(viewMode === 'renter' ? 'admin' : 'renter');
            }}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 pt-2"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-800" />
              <span>{viewMode === 'renter' ? 'Buka Dashboard Admin' : 'Buka Halaman Katalog'}</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      )}
    </header>
  );
};
