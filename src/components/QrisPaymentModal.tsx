import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  QrCode,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Upload,
  ArrowRight,
  Smartphone,
  Sparkles,
  Info
} from 'lucide-react';

export const QrisPaymentModal: React.FC = () => {
  const {
    isQrisModalOpen,
    setIsQrisModalOpen,
    activeOrder,
    setIsProofModalOpen,
    uploadPaymentProof
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins

  useEffect(() => {
    if (!isQrisModalOpen) return;
    setTimeLeft(15 * 60);
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isQrisModalOpen]);

  if (!isQrisModalOpen || !activeOrder) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyNominal = () => {
    navigator.clipboard.writeText(activeOrder.totalAmount.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateFastPayment = () => {
    // Automatically attach a realistic transfer slip and transition to validating proof
    const sampleProof = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80';
    uploadPaymentProof(activeOrder.id, sampleProof);
    setIsQrisModalOpen(false);
    setIsProofModalOpen(true);
  };

  const handleManualUploadProof = () => {
    setIsQrisModalOpen(false);
    setIsProofModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-3 sm:my-6">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 tracking-wide text-sm">Pembayaran QRIS</span>
            <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded tracking-wider shadow-xs">
              QRIS
            </span>
          </div>
          <button
            onClick={() => setIsQrisModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4">
          {/* Timer and instructions */}
          <div className="flex items-center justify-between text-xs bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80">
            <div className="flex items-center gap-1.5 text-amber-900 font-medium">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-[11px] sm:text-xs">Selesaikan dalam batas waktu:</span>
            </div>
            <span className="font-mono font-bold text-amber-800 text-xs sm:text-sm">{timeFormatted}</span>
          </div>

          {/* QR Card Presentation */}
          <div className="bg-[#FAF9F5] p-3.5 sm:p-5 rounded-xl border border-stone-200 text-stone-900 text-center shadow-xs">
            {/* Top QRIS Banner */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
              <div className="text-left">
                <div className="text-[11px] font-bold tracking-tight text-stone-900">
                  SEWALAPTOP.ID
                </div>
                <div className="text-[9px] text-stone-500 font-mono">
                  NMID: ID1020304050982 · Hub Jakarta
                </div>
              </div>
              <span className="text-xs font-black tracking-widest text-red-600">QRIS</span>
            </div>

            {/* Crisp QR Code Vector / Pattern */}
            <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 bg-white p-2.5 sm:p-3 rounded-lg border border-stone-300 flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900">
                {/* 3 Outer Corner Target squares */}
                <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="2" />
                <rect x="9" y="9" width="18" height="18" fill="white" rx="1" />
                <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />

                <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="2" />
                <rect x="73" y="9" width="18" height="18" fill="white" rx="1" />
                <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />

                <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="2" />
                <rect x="9" y="73" width="18" height="18" fill="white" rx="1" />
                <rect x="13" y="77" width="10" height="10" fill="currentColor" rx="1" />

                {/* Timing patterns & Data grid simulation */}
                <circle cx="36" cy="18" r="3" fill="currentColor" />
                <circle cx="48" cy="18" r="3" fill="currentColor" />
                <circle cx="60" cy="18" r="3" fill="currentColor" />
                <circle cx="18" cy="36" r="3" fill="currentColor" />
                <circle cx="18" cy="48" r="3" fill="currentColor" />
                <circle cx="18" cy="60" r="3" fill="currentColor" />

                <rect x="36" y="36" width="28" height="28" fill="currentColor" rx="3" />
                <rect x="42" y="42" width="16" height="16" fill="white" rx="2" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />

                <rect x="68" y="40" width="8" height="8" fill="currentColor" />
                <rect x="80" y="48" width="12" height="6" fill="currentColor" />
                <rect x="40" y="68" width="6" height="12" fill="currentColor" />
                <rect x="52" y="72" width="12" height="6" fill="currentColor" />
                <rect x="72" y="68" width="18" height="18" fill="currentColor" rx="2" />
              </svg>

              {/* Center GPN logo */}
              <div className="absolute inset-0 m-auto w-9 h-9 bg-white border border-stone-300 rounded-md flex items-center justify-center font-bold text-[9px] text-red-600 shadow-xs">
                GPN
              </div>
            </div>

            <p className="mt-2.5 text-[10px] text-stone-500 font-medium">
              Bisa discan pakai BCA Mobile, Mandiri Livin, GoPay, OVO, Dana, ShopeePay & semua bank.
            </p>
          </div>

          {/* Amount Box */}
          <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-stone-200 space-y-1.5">
            <div className="flex justify-between items-center text-xs text-stone-600">
              <span className="font-medium">Nominal Pas yang Harus Dibayar:</span>
              <button
                type="button"
                onClick={copyNominal}
                className="text-cyan-800 hover:text-cyan-900 font-semibold flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Nominal'}</span>
              </button>
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 tabular-nums">
              Rp {activeOrder.totalAmount.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-stone-500 pt-1.5 border-t border-stone-200 flex justify-between">
              <span>Sewa ({activeOrder.rentalDurationDays} hari): Rp {activeOrder.rentalFeeTotal.toLocaleString('id-ID')}</span>
              <span className="text-emerald-700 font-medium">Deposit: Rp {activeOrder.depositAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleManualUploadProof}
              className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Sudah Bayar? Upload Bukti Pembayaran</span>
            </button>

            {/* Fast Simulator for instant testing */}
            <button
              onClick={handleSimulateFastPayment}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-800" />
              <span>Simulasi Bayar Otomatis (Demo 1-Klik)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
