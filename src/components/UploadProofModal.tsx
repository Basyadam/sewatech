import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Upload,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const UploadProofModal: React.FC = () => {
  const {
    isProofModalOpen,
    setIsProofModalOpen,
    activeOrder,
    uploadPaymentProof,
    verifyPaymentProof,
    setIsTrackingModalOpen
  } = useApp();

  const [proofUrl, setProofUrl] = useState(
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80'
  );
  const [instantBotApprove, setInstantBotApprove] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isProofModalOpen || !activeOrder) return null;

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) {
      setErrorMessage('Silakan pilih atau unggah foto bukti transfer.');
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    setTimeout(() => {
      uploadPaymentProof(activeOrder.id, proofUrl);

      if (instantBotApprove) {
        // Bot approves in 1 second
        setTimeout(() => {
          verifyPaymentProof(activeOrder.id, true);
        }, 1200);
      }

      setIsProcessing(false);
      setIsProofModalOpen(false);
      setIsTrackingModalOpen(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-3 sm:my-6">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-800" />
            <h3 className="font-bold text-stone-900 text-sm">Upload Bukti Pembayaran QRIS</h3>
          </div>
          <button
            onClick={() => setIsProofModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmitProof} className="p-4 sm:p-5 space-y-3.5 sm:space-y-4">
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-stone-200 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Nomor Pesanan:</span>
              <span className="font-mono font-semibold text-stone-900">{activeOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between text-stone-600 mt-1">
              <span>Nominal Pas:</span>
              <span className="font-mono font-bold text-cyan-900 tabular-nums">
                Rp {activeOrder.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-stone-500 mt-1 text-[11px]">
              <span>Unit Sewa:</span>
              <span className="text-stone-700 font-medium truncate max-w-[200px]">{activeOrder.product.name}</span>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Lampiran Screenshot Slip QRIS / Struk Transfer *
            </label>
            <div className="border-2 border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/60 rounded-xl p-4 text-center transition-colors">
              {proofUrl ? (
                <div className="space-y-2">
                  <div className="max-h-48 max-w-xs mx-auto overflow-hidden rounded-lg border border-stone-200 shadow-xs">
                    <img
                      src={proofUrl}
                      alt="Bukti Transfer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs text-emerald-700 flex items-center justify-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Slip Transfer Terunggah & Terbaca</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProofUrl('')}
                    className="text-[11px] text-stone-500 hover:text-rose-600 underline font-medium"
                  >
                    Ganti Foto Bukti
                  </button>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setProofUrl(
                      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80'
                    )
                  }
                  className="cursor-pointer space-y-1 py-3"
                >
                  <Upload className="w-6 h-6 text-stone-400 mx-auto" />
                  <div className="text-xs text-stone-700 font-semibold">
                    Klik untuk Memilih File Slip Transfer
                  </div>
                  <div className="text-[10px] text-stone-500">JPG, PNG atau PDF maks 10MB</div>
                </div>
              )}
            </div>
          </div>

          {/* Bot Validation toggle */}
          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-stone-800 block">Validasi Otomatis Bot (Instant)</span>
              <span className="text-[11px] text-stone-500">
                Pencocokan OCR nominal otomatis tanpa harus menunggu konfirmasi manual admin.
              </span>
            </div>
            <input
              type="checkbox"
              checked={instantBotApprove}
              onChange={e => setInstantBotApprove(e.target.checked)}
              className="w-4 h-4 accent-cyan-700 rounded cursor-pointer"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{isProcessing ? 'Mengirim Bukti Bayar...' : 'Kirim Bukti Pembayaran'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="mt-2 text-center text-[10px] text-stone-500">
              Setelah dikirim, status pesanan beralih ke: Siap Diantar / Siap Diambil.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
