import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import { FINANCIAL_METRICS } from '../../data/mockData';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

export const AdminFinancialReports: React.FC = () => {
  const { orders, issues, updateOrderStatus, setActiveOrder, setIsTrackingModalOpen } = useApp();
  const [activeMetricHover, setActiveMetricHover] = useState<number | null>(null);
  const [recentlyCompletedId, setRecentlyCompletedId] = useState<string | null>(null);

  // 1. Separate orders by status
  const completedOrders = orders.filter(o => o.status === 'completed');
  const activeInUseOrders = orders.filter(
    o => o.status === 'received_in_use' || o.status === 'in_delivery_or_ready'
  );
  const pendingOrders = orders.filter(
    o => o.status === 'awaiting_payment' || o.status === 'validating_proof'
  );

  // 2. Baseline values for prior historical transactions this month
  const BASE_MTD_REVENUE = 38500000;
  const BASE_MTD_TRANSACTIONS = 112;
  const BASE_HELD_DEPOSITS = 14500000;
  const BASE_FINES = 1450000;

  // 3. Compute live reactive revenues from completed orders
  const liveCompletedRevenue = completedOrders.reduce((sum, o) => sum + o.rentalFeeTotal, 0);
  const totalRealizedRevenue = BASE_MTD_REVENUE + liveCompletedRevenue;

  // Live total transactions
  const totalCompletedTransactions = BASE_MTD_TRANSACTIONS + completedOrders.length;

  // Live active deposits: only held for orders currently in-flight
  // When an order completes, its deposit is refunded to the renter, reducing held deposits!
  const liveHeldDeposits =
    BASE_HELD_DEPOSITS +
    activeInUseOrders.reduce((sum, o) => sum + o.depositAmount, 0);

  // Total refunded deposit to renters
  const totalRefundedDeposits = completedOrders.reduce((sum, o) => sum + o.depositAmount, 0);

  // Live fines collected
  const liveResolvedFines = issues
    .filter(i => i.status === 'resolved')
    .reduce((sum, i) => sum + i.fineAmount, 0);
  const totalFinesCollected = BASE_FINES + liveResolvedFines;

  // 4. Dynamic Monthly Financial Metrics Chart (Last bar updates reactively!)
  const dynamicFinancialMetrics = FINANCIAL_METRICS.map((item, idx) => {
    if (idx === FINANCIAL_METRICS.length - 1) {
      return {
        ...item,
        revenue: totalRealizedRevenue,
        rentalCount: totalCompletedTransactions,
        activeDeposits: liveHeldDeposits,
        finesCollected: totalFinesCollected
      };
    }
    return item;
  });

  const maxRevenue = Math.max(...dynamicFinancialMetrics.map(m => m.revenue));

  // 5. Dynamic Category Revenue Split (Focused on Laptop Windows & MacBook)
  const categoryBase: Record<ProductCategory, { label: string; base: number; color: string }> = {
    'laptop-windows': { label: 'Laptop Windows (ThinkPad, Dell, ASUS ROG, Legion)', base: 21500000, color: 'bg-cyan-700' },
    'laptop-mac': { label: 'Apple MacBook (MacBook Pro M3 Max & MacBook Air)', base: 18300000, color: 'bg-indigo-700' }
  };

  // Add revenue from live verified/completed orders into category totals
  const liveCategoryTotals: Record<ProductCategory, number> = {
    'laptop-windows': categoryBase['laptop-windows'].base,
    'laptop-mac': categoryBase['laptop-mac'].base
  };

  orders.forEach(ord => {
    if (ord.status === 'completed' || ord.paymentStatus === 'verified') {
      const cat = ord.product.category;
      if (liveCategoryTotals[cat] !== undefined) {
        liveCategoryTotals[cat] += ord.rentalFeeTotal;
      }
    }
  });

  const grandCategoryTotal = Object.values(liveCategoryTotals).reduce((a, b) => a + b, 0);

  const dynamicCategorySplit = (Object.keys(categoryBase) as ProductCategory[]).map(key => {
    const revenue = liveCategoryTotals[key];
    const value = Math.round((revenue / grandCategoryTotal) * 100);
    return {
      label: categoryBase[key].label,
      revenue,
      value,
      color: categoryBase[key].color
    };
  });

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Bulan,Omset Sewa,Total Transaksi,Denda Masuk,Deposit Aktif\n' +
      dynamicFinancialMetrics
        .map(m => `${m.month},${m.revenue},${m.rentalCount},${m.finesCollected},${m.activeDeposits}`)
        .join('\n') +
      '\n\nRincian Sewa Selesai (Settlement Ledger):\nNo Order,Penyewa,Unit,Biaya Sewa Masuk,Deposit Dikembalikan,Waktu Selesai\n' +
      completedOrders
        .map(
          o =>
            `${o.orderNumber},${o.customerName},"${o.product.name}",${o.rentalFeeTotal},${o.depositAmount},${o.completedAt || o.createdAt}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `laporan-finansial-sewatech-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickCompleteOrder = (orderId: string) => {
    updateOrderStatus(
      orderId,
      'completed',
      'Unit dikembalikan dengan aman, QC fisik lulus 100%, dan deposit dicairkan ke penyewa.'
    );
    setRecentlyCompletedId(orderId);
    setTimeout(() => setRecentlyCompletedId(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-800" />
              <span>Laporan Finansial & Omset Real-Time</span>
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Data pendapatan terhubung langsung dengan siklus sewa. Begitu unit ditandai selesai, omset otomatis masuk ke kas dan deposit garansi dilepaskan.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors border border-stone-300 flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-800" />
          <span>Ekspor Laporan (CSV)</span>
        </button>
      </div>

      {/* Realtime Notification Banner when an order just completed */}
      {recentlyCompletedId && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-950 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Sewa Selesai!</strong> Omset transaksi telah ditambahkan ke Total Kas MTD dan dana deposit telah dicairkan kembali ke penyewa.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-emerald-800 border border-emerald-200">
            Kas Terupdate
          </span>
        </div>
      )}

      {/* 4 Financial Stat Cards (NOW 100% DYNAMIC & REACTIVE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Omset Realized */}
        <div className="p-4 bg-white border border-stone-200/90 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Total Omset Sewa (MTD)</span>
            <DollarSign className="w-4 h-4 text-cyan-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-2">
            Rp {totalRealizedRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
            <span className="font-bold">+{completedOrders.length} Selesai</span>
            <span className="text-stone-400">
              (+Rp {liveCompletedRevenue.toLocaleString('id-ID')} real-time)
            </span>
          </div>
        </div>

        {/* Card 2: Total Completed Transactions */}
        <div className="p-4 bg-white border border-stone-200/90 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Total Transaksi Selesai</span>
            <CreditCard className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums mt-2">
            {totalCompletedTransactions}{' '}
            <span className="text-xs font-normal text-stone-500 font-sans">Unit Sewa</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {activeInUseOrders.length} unit sedang aktif dipinjam
          </div>
        </div>

        {/* Card 3: Active Deposits Held */}
        <div className="p-4 bg-white border border-stone-200/90 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Deposit Garansi Ditahan</span>
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums mt-2">
            Rp {liveHeldDeposits.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {completedOrders.length > 0
              ? `Rp ${totalRefundedDeposits.toLocaleString('id-ID')} telah dicairkan balik`
              : 'Otomatis dicairkan saat sewa selesai'}
          </div>
        </div>

        {/* Card 4: Fines Collected */}
        <div className="p-4 bg-white border border-stone-200/90 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Pendapatan Denda & Masalah</span>
            <TrendingUp className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums mt-2">
            Rp {totalFinesCollected.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Dari {issues.filter(i => i.status === 'resolved').length} kasus dispute terselesaikan
          </div>
        </div>
      </div>

      {/* Main Interactive Chart: Monthly Revenue Bars (Live Height on Current Month) */}
      <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-stone-900 text-base">Grafik Pertumbuhan Pendapatan Bulanan</h3>
            <p className="text-xs text-stone-500">
              Bar bulan terakhir (Sep 2026 MTD) otomatis bertambah tinggi saat pesanan sewa diselesaikan.
            </p>
          </div>
          <div className="text-xs font-mono font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 w-fit">
            Omset Terkini: Rp {totalRealizedRevenue.toLocaleString('id-ID')}
          </div>
        </div>

        {/* SVG Interactive Bar Chart */}
        <div className="h-64 w-full bg-[#FAF9F5] p-4 rounded-xl border border-stone-200 flex flex-col justify-end relative">
          {/* Grid lines */}
          <div className="absolute inset-x-4 top-8 border-b border-stone-200/70 text-[10px] text-stone-400 font-mono">
            Rp 40 Jt
          </div>
          <div className="absolute inset-x-4 top-24 border-b border-stone-200/70 text-[10px] text-stone-400 font-mono">
            Rp 30 Jt
          </div>
          <div className="absolute inset-x-4 top-40 border-b border-stone-200/70 text-[10px] text-stone-400 font-mono">
            Rp 20 Jt
          </div>

          {/* Bars */}
          <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-44 z-10">
            {dynamicFinancialMetrics.map((item, idx) => {
              const isCurrentMonth = idx === dynamicFinancialMetrics.length - 1;
              const heightPercent = Math.min(100, Math.round((item.revenue / maxRevenue) * 100));
              const isHovered = activeMetricHover === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveMetricHover(idx)}
                  onMouseLeave={() => setActiveMetricHover(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-16 bg-stone-900 text-white border border-stone-700 px-2.5 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap shadow-xl z-30 pointer-events-none">
                      <div className="font-bold text-cyan-400">Rp {item.revenue.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-stone-300">
                        {item.rentalCount} Transaksi Selesai
                      </div>
                      {isCurrentMonth && (
                        <div className="text-[9px] text-emerald-400 font-bold">● Live Synchronized</div>
                      )}
                    </div>
                  )}

                  {/* The bar element */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                      isCurrentMonth
                        ? 'bg-cyan-700 group-hover:bg-cyan-800 shadow-xs ring-2 ring-cyan-500/30'
                        : 'bg-stone-300 group-hover:bg-stone-400'
                    }`}
                  />

                  {/* Label */}
                  <div
                    className={`mt-2 text-[11px] font-medium transition-colors truncate ${
                      isCurrentMonth ? 'text-cyan-800 font-bold' : 'text-stone-600 group-hover:text-stone-900'
                    }`}
                  >
                    {item.month.split(' ')[0]}
                    {isCurrentMonth && ' (MTD)'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Completed Settlements Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Contribution */}
        <div className="lg:col-span-5 p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-800" />
              <h3 className="font-bold text-stone-900 text-sm">Kontribusi Omset per Kategori</h3>
            </div>
            <span className="text-[11px] font-mono text-stone-500">Live %</span>
          </div>

          <div className="space-y-3">
            {dynamicCategorySplit.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-700 font-medium truncate">{cat.label}</span>
                  <span className="text-stone-900 font-mono font-bold">
                    Rp {cat.revenue.toLocaleString('id-ID')} ({cat.value}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div style={{ width: `${cat.value}%` }} className={`h-full ${cat.color} transition-all duration-500`} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
            *Persentase omset bergerak otomatis setiap ada pesanan laptop Windows atau MacBook yang selesai.
          </div>
        </div>

        {/* Live Rental Settlement Ledger (Daftar Sewa Selesai & Realisasi Kas) */}
        <div className="lg:col-span-7 p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-stone-900 text-sm">Rincian Realisasi Sewa Selesai</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {completedOrders.length} Transaksi Selesai
            </span>
          </div>

          {completedOrders.length === 0 ? (
            <div className="p-6 bg-[#FAF9F5] rounded-xl border border-stone-200 text-center space-y-3">
              <Clock className="w-8 h-8 text-stone-400 mx-auto" />
              <div className="text-xs text-stone-600">
                Belum ada transaksi yang ditandai selesai dalam sesi ini.
              </div>
              <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                Silakan tandai pesanan berjalan di bawah atau di tab Antrean Validasi untuk melihat omset dan deposit langsung masuk ke laporan keuangan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">No. Order & Penyewa</th>
                    <th className="p-2.5">Unit Sewa</th>
                    <th className="p-2.5 text-right">Omset Masuk</th>
                    <th className="p-2.5 text-right">Deposit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {completedOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-stone-50">
                      <td className="p-2.5">
                        <div className="font-mono font-bold text-cyan-800">#{ord.orderNumber}</div>
                        <div className="text-stone-700">{ord.customerName}</div>
                        <div className="text-[10px] text-stone-400">
                          {ord.completedAt || ord.createdAt}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-medium text-stone-900">{ord.product.name}</div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          {ord.rentalDurationDays} Hari ({ord.product.ramSpec ? `RAM ${ord.product.ramSpec}` : ord.product.category})
                        </div>
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-800">
                        +Rp {ord.rentalFeeTotal.toLocaleString('id-ID')}
                      </td>
                      <td className="p-2.5 text-right">
                        <span className="text-[10px] font-mono text-stone-500 block">
                          Rp {ord.depositAmount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-semibold border border-emerald-200">
                          Dicairkan
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quick Action: Ready-to-complete Active Orders */}
          {activeInUseOrders.length > 0 && (
            <div className="pt-3 border-t border-stone-200">
              <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-800" />
                <span>Unit Aktif Berjalan (Siap Selesai & Realisasi Kas):</span>
              </div>
              <div className="space-y-2">
                {activeInUseOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="p-2.5 bg-[#FAF9F5] border border-stone-200 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-800">#{ord.orderNumber}</span> ·{' '}
                      <span className="font-medium text-stone-900">{ord.product.name}</span>
                      <div className="text-[11px] text-stone-500">
                        Penyewa: {ord.customerName} · Omset Pending:{' '}
                        <strong className="text-stone-700">Rp {ord.rentalFeeTotal.toLocaleString('id-ID')}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickCompleteOrder(ord.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Selesaikan & Masukkan Kas</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
