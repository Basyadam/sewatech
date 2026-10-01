import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  CheckCheck,
  AlertTriangle,
  MessageCircle,
  Download,
  Calendar,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    activeOrder,
    orders,
    setActiveOrder,
    updateOrderStatus,
    setIsWaChatOpen,
    setWaPrefilledMessage,
    setIsAgreementModalOpen,
    setOrderForAgreement
  } = useApp();

  if (!isTrackingModalOpen || !activeOrder) return null;

  const currentOrder = orders.find(o => o.id === activeOrder.id) || activeOrder;

  // 4 Core Stages requested by user:
  // Validasi Pembayaran -> Sedang Diantar / Siap Diambil -> Barang Diterima -> Selesai
  const stages: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'validating_proof',
      label: 'Validasi Pembayaran',
      desc: 'Verifikasi slip transfer QRIS',
      icon: <Clock className="w-4 h-4" />
    },
    {
      key: 'in_delivery_or_ready',
      label: currentOrder.deliveryMethod === 'delivery' ? 'Sedang Diantar' : 'Siap Diambil di Hub',
      desc: currentOrder.deliveryMethod === 'delivery' ? 'Kurir khusus dalam perjalanan' : 'Unit QC siap di Hub SewaLaptop.id',
      icon: <Truck className="w-4 h-4" />
    },
    {
      key: 'received_in_use',
      label: 'Barang Diterima',
      desc: 'Masa sewa aktif & digunakan penyewa',
      icon: <PackageCheck className="w-4 h-4" />
    },
    {
      key: 'completed',
      label: 'Sewa Selesai',
      desc: 'Unit kembali & deposit dicairkan',
      icon: <CheckCheck className="w-4 h-4" />
    }
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'awaiting_payment':
      case 'validating_proof':
        return 0;
      case 'in_delivery_or_ready':
        return 1;
      case 'received_in_use':
        return 2;
      case 'completed':
        return 3;
      case 'disputed':
        return 2; // During dispute
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(currentOrder.status);

  const handleConfirmReceived = () => {
    updateOrderStatus(
      currentOrder.id,
      'received_in_use',
      'Penyewa mengonfirmasi penerimaan barang dalam kondisi fisik baik.'
    );
  };

  const handleReturnItem = () => {
    updateOrderStatus(
      currentOrder.id,
      'completed',
      'Penyewa mengembalikan unit lengkap. Tim QC mengonfirmasi kondisi prima. Uang jaminan deposit dikembalikan penuh.'
    );
  };

  const handleContactWa = () => {
    const msg = `Halo CS Adam (SewaLaptop.id), saya ingin konfirmasi terkait pesanan #${currentOrder.orderNumber} (${currentOrder.product.name}).`;
    setWaPrefilledMessage(msg);
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/6283188537999?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">Pelacakan Status Pesanan</h3>
              <span className="font-mono text-[11px] sm:text-xs text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 font-semibold">
                #{currentOrder.orderNumber}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
              Penyewa: {currentOrder.customerName} · Dibuat: {currentOrder.createdAt}
            </p>
          </div>
          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Stepper Card */}
          <div className="p-4 bg-[#FAF9F5] rounded-xl border border-stone-200">
            <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-4">
              Tahapan Status Peminjaman
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
              {stages.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={stage.key}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? 'bg-white border-cyan-600 text-stone-900 shadow-xs ring-1 ring-cyan-500/20'
                        : isPassed
                        ? 'bg-emerald-50/70 border-emerald-200 text-stone-800'
                        : 'bg-white/60 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-2 text-xs font-bold ${
                        isCurrent
                          ? 'bg-cyan-700 text-white animate-pulse'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="font-semibold text-xs leading-tight">{stage.label}</div>
                    <div className="text-[10px] text-stone-500 mt-1 line-clamp-1">{stage.desc}</div>
                  </div>
                );
              })}
            </div>

            {currentOrder.status === 'disputed' && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Status: Dalam Penanganan Pusat Masalah (Dispute)</span>
                  <p className="mt-0.5 text-stone-600">
                    Unit ini memiliki catatan kendala keterlambatan atau klaim perbaikan. Tim resolusi SewaTech telah menghubungi via WhatsApp.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Product & Rental Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF9F5] rounded-xl border border-stone-200">
            <div className="aspect-4/3 rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
              <img
                src={currentOrder.product.image}
                alt={currentOrder.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <div className="text-xs text-cyan-800 font-semibold uppercase">
                {currentOrder.product.category}
              </div>
              <h4 className="text-sm font-bold text-stone-900 leading-snug">
                {currentOrder.product.name}
              </h4>
              <div className="text-xs text-stone-600 flex flex-wrap gap-x-3 gap-y-1">
                <span>Durasi: {currentOrder.rentalDurationDays} Hari</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Batas Kembali: {currentOrder.returnDueDate}</span>
              </div>

              <div className="pt-2 text-xs grid grid-cols-2 gap-2 border-t border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">Total Biaya QRIS:</span>
                  <span className="font-mono font-bold text-stone-900">
                    Rp {currentOrder.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Uang Jaminan:</span>
                  <span className="font-mono font-semibold text-emerald-700">
                    Rp {currentOrder.depositAmount.toLocaleString('id-ID')} (100% Refund)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Timeline Events */}
          <div>
            <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-3">
              Catatan & Riwayat Perjalanan Pesanan
            </h4>
            <div className="border border-stone-200 rounded-xl p-4 bg-white divide-y divide-stone-100 space-y-3 shadow-xs">
              {currentOrder.timeline.map((event, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-start gap-3 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-700 shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{event.title}</span>
                      <span className="text-[11px] font-mono text-stone-400">{event.timestamp}</span>
                    </div>
                    <p className="text-stone-600 mt-0.5 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions depending on current status */}
          <div className="pt-2 space-y-2">
            {currentOrder.status === 'in_delivery_or_ready' && (
              <button
                onClick={handleConfirmReceived}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Konfirmasi Barang Telah Diterima (Serah Terima Unit)</span>
              </button>
            )}

            {currentOrder.status === 'received_in_use' && (
              <button
                onClick={handleReturnItem}
                className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Konfirmasi Selesai Sewa & Pengembalian Unit</span>
              </button>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOrderForAgreement(currentOrder);
                  setIsAgreementModalOpen(true);
                }}
                className="w-full sm:flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 font-semibold shadow-xs"
              >
                <FileText className="w-4 h-4 text-cyan-800" />
                <span>Cetak Nota & Perjanjian Sewa</span>
              </button>

              <button
                type="button"
                onClick={handleContactWa}
                className="w-full sm:flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat CS Adam WA (0831-8853-7999)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
