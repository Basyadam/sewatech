import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminVerificationQueue } from './AdminVerificationQueue';
import { AdminIssuesCenter } from './AdminIssuesCenter';
import { AdminFinancialReports } from './AdminFinancialReports';
import { AdminCustomersList } from './AdminCustomersList';
import { AdminProductCatalog } from './AdminProductCatalog';
import { AdminTeamManagement } from './AdminTeamManagement';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Users,
  Package,
  ArrowLeft,
  SlidersHorizontal,
  UserCheck,
  LogOut,
  Shield,
  Lock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setViewMode,
    customers,
    orders,
    issues,
    currentAdmin,
    adminLogout,
    adminUsers,
    setIsAdminAuthModalOpen
  } = useApp();

  const pendingKtpCount = customers.filter(c => c.ktpStatus === 'pending').length;
  const pendingProofCount = orders.filter(o => o.paymentStatus === 'proof_submitted').length;
  const totalPendingVerifications = pendingKtpCount + pendingProofCount;
  const openIssuesCount = issues.filter(i => i.status !== 'resolved').length;

  const tabs: {
    id: typeof adminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'verification',
      label: 'Antrean Validasi & Armada',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: totalPendingVerifications,
      badgeColor: 'bg-amber-400 text-neutral-950'
    },
    {
      id: 'issues',
      label: 'Pusat Penyelesaian Masalah',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: openIssuesCount,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'financial',
      label: 'Laporan Finansial',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: orders.filter(o => o.status === 'completed').length > 0
        ? orders.filter(o => o.status === 'completed').length
        : undefined,
      badgeColor: 'bg-emerald-700 text-white'
    },
    {
      id: 'customers',
      label: 'Database Customer',
      icon: <Users className="w-4 h-4" />,
      badge: customers.length
    },
    {
      id: 'products',
      label: 'Manajemen Katalog',
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 'team',
      label: 'Tim Admin',
      icon: <UserCheck className="w-4 h-4" />,
      badge: adminUsers.length
    }
  ];

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-6 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-900 text-cyan-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">Akses Terkunci</h2>
            <p className="text-xs text-stone-500 mt-1">
              Anda perlu masuk sebagai admin terdaftar untuk mengakses panel operasional SewaLaptop.id.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => setIsAdminAuthModalOpen(true)}
              className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Masuk / Daftarkan Admin
            </button>
            <button
              onClick={() => setViewMode('renter')}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors border border-stone-200"
            >
              Kembali ke Halaman Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 pb-16">
      {/* Top Admin Sub-bar */}
      <div className="bg-white border-b border-stone-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('renter')}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lihat Web Publik</span>
              </button>
              <span className="text-stone-300">|</span>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-800" />
                <h1 className="text-base font-bold text-stone-900 tracking-tight">
                  Panel Pengelola Platform SewaLaptop.id
                </h1>
              </div>
            </div>

            {/* Active Admin User Profile and Logout */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-2 bg-stone-100 border border-stone-200/90 rounded-lg py-1 px-2.5">
                <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                  {currentAdmin.avatarUrl ? (
                    <img src={currentAdmin.avatarUrl} alt={currentAdmin.name} className="w-full h-full object-cover" />
                  ) : (
                    currentAdmin.name.charAt(0)
                  )}
                </div>
                <div className="text-left text-xs leading-tight">
                  <div className="font-bold text-stone-900 flex items-center gap-1">
                    <span>{currentAdmin.name}</span>
                    <span className="text-[10px] text-cyan-800 uppercase font-mono font-bold">
                      ({currentAdmin.role})
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono">@{currentAdmin.username}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={adminLogout}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Keluar dari sesi Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar Admin</span>
              </button>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3.5 pb-1 scrollbar-none">
            {tabs.map(tab => {
              const active = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-[#F5F3ED] text-stone-600 border-stone-200/80 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <span className={active ? 'text-cyan-400' : 'text-stone-500'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        tab.badgeColor || 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {adminTab === 'verification' && <AdminVerificationQueue />}
        {adminTab === 'issues' && <AdminIssuesCenter />}
        {adminTab === 'financial' && <AdminFinancialReports />}
        {adminTab === 'customers' && <AdminCustomersList />}
        {adminTab === 'products' && <AdminProductCatalog />}
        {adminTab === 'team' && <AdminTeamManagement />}
      </main>
    </div>
  );
};
