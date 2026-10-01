import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import {
  ShieldCheck,
  Check,
  X,
  Eye,
  FileCheck,
  Truck,
  PackageCheck,
  Clock,
  AlertTriangle,
  ExternalLink,
  UserCheck
} from 'lucide-react';

export const AdminVerificationQueue: React.FC = () => {
  const {
    customers,
    verifyCustomerKtp,
    orders,
    verifyPaymentProof,
    updateOrderStatus,
    setActiveOrder,
    setIsTrackingModalOpen,
    setIsAgreementModalOpen,
    setOrderForAgreement
  } = useApp();

  const [selectedProofPreview, setSelectedProofPreview] = useState<string | null>(null);

  // Filter queues
  const pendingKtpCustomers = customers.filter(c => c.ktpStatus === 'pending');
  const pendingPaymentOrders = orders.filter(o => o.paymentStatus === 'proof_submitted');
  const activeRentalOrders = orders.filter(
    o => o.status === 'in_delivery_or_ready' || o.status === 'received_in_use'
  );

  return (
    <div className="space-y-8">
      {/* Top metric overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-stone-200/90 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Antrean Validasi KTP</div>
          <div className="text-2xl font-bold font-mono text-cyan-800 mt-1">
            {pendingKtpCustomers.length} <span className="text-xs font-normal text-stone-500 font-sans">Akun Baru</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Pencocokan NIK & keaslian dokumen</div>
        </div>

        <div className="p-4 bg-white border border-stone-200/90 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Antrean Validasi Slip QRIS</div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
            {pendingPaymentOrders.length} <span className="text-xs font-normal text-stone-500 font-sans">Bukti Masuk</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Verifikasi dana masuk sebelum kirim unit</div>
        </div>

        <div className="p-4 bg-white border border-stone-200/90 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Unit Sedang Berjalan di Luar</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {activeRentalOrders.length} <span className="text-xs font-normal text-stone-500 font-sans">Penyewaan Aktif</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Diantar kurir atau sedang digunakan penyewa</div>
        </div>
      </div>

      {/* 1. Antrean Verifikasi KTP Customer */}
      <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-800" />
              <span>Antrean Validasi Identitas KTP Penyewa</span>
            </h3>
            <p className="text-xs text-stone-500">
              Validasi data diri, NIK, dan foto kartu identitas sebelum penyewa dapat mengambil barang.
            </p>
          </div>
          <span className="text-xs font-mono bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-1 rounded-md font-semibold">
            {pendingKtpCustomers.length} Menunggu Verifikasi
          </span>
        </div>

        {pendingKtpCustomers.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500 bg-[#FAF9F5] rounded-xl border border-stone-200/60">
            Tidak ada antrean verifikasi KTP. Semua penyewa telah terverifikasi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingKtpCustomers.map(cust => (
              <div
                key={cust.id}
                className="p-4 bg-[#FAF9F5] rounded-xl border border-stone-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{cust.fullName}</h4>
                      <div className="text-xs text-stone-600 font-mono">NIK: {cust.nik}</div>
                      <div className="text-xs text-stone-600">WA: {cust.phone} · {cust.email}</div>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
                      KTP Pending
                    </span>
                  </div>

                  <div className="mt-3 text-xs bg-white p-2.5 rounded-lg border border-stone-200 space-y-1">
                    <div className="text-stone-700">
                      <span className="text-stone-400 font-medium">Alamat:</span> {cust.address}
                    </div>
                    <div className="text-stone-700">
                      <span className="text-stone-400 font-medium">Kontak Darurat:</span> {cust.emergencyContact.name} ({cust.emergencyContact.relation}) - {cust.emergencyContact.phone}
                    </div>
                  </div>

                  {/* KTP Photo Preview */}
                  <div className="mt-3">
                    <span className="text-[10px] text-stone-500 block mb-1 font-medium">Foto KTP Diunggah:</span>
                    <div className="h-28 w-full bg-stone-100 rounded-lg overflow-hidden border border-stone-200 relative group cursor-pointer">
                      <img src={cust.ktpPhotoUrl} alt="KTP" className="w-full h-full object-cover" />
                      <div
                        onClick={() => setSelectedProofPreview(cust.ktpPhotoUrl)}
                        className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition-opacity"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Klik Perbesar
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                  <button
                    onClick={() => verifyCustomerKtp(cust.id, true)}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Setujui (Valid)</span>
                  </button>
                  <button
                    onClick={() => verifyCustomerKtp(cust.id, false, 'Foto KTP kurang jelas / buram')}
                    className="flex-1 py-2 bg-white hover:bg-rose-50 hover:text-rose-700 text-stone-700 font-semibold text-xs rounded-lg transition-colors border border-stone-300 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <X className="w-4 h-4" />
                    <span>Tolak & Minta Upload Ulang</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Antrean Validasi Bukti Bayar QRIS */}
      <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-700" />
              <span>Antrean Validasi Bukti Pembayaran QRIS</span>
            </h3>
            <p className="text-xs text-stone-500">
              Periksa kecocokan nominal transfer QRIS dan nomor referensi transaksi.
            </p>
          </div>
          <span className="text-xs font-mono bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-1 rounded-md font-semibold">
            {pendingPaymentOrders.length} Menunggu Konfirmasi
          </span>
        </div>

        {pendingPaymentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500 bg-[#FAF9F5] rounded-xl border border-stone-200/60">
            Tidak ada slip QRIS baru yang perlu divalidasi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPaymentOrders.map(order => (
              <div
                key={order.id}
                className="p-4 bg-[#FAF9F5] rounded-xl border border-stone-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-cyan-800 font-semibold">#{order.orderNumber}</span>
                      <h4 className="font-bold text-stone-900 text-sm">{order.product.name}</h4>
                      <div className="text-xs text-stone-600">Penyewa: {order.customerName} ({order.customerPhone})</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-800 tabular-nums">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] text-stone-500">QRIS Lunas</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-stone-600 flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200">
                    <span>Metode: {order.deliveryMethod === 'delivery' ? 'Antar Kurir Express' : 'Self Pickup di Hub'}</span>
                    <span className="text-stone-500">{order.proofSubmittedAt || 'Baru saja'}</span>
                  </div>

                  {/* Payment Slip Preview */}
                  <div className="mt-3">
                    <span className="text-[10px] text-stone-500 block mb-1 font-medium">Slip Transfer QRIS:</span>
                    <div className="h-28 w-full bg-stone-100 rounded-lg overflow-hidden border border-stone-200 relative group cursor-pointer">
                      <img
                        src={order.paymentProofUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80'}
                        alt="Bukti Bayar"
                        className="w-full h-full object-cover"
                      />
                      <div
                        onClick={() => setSelectedProofPreview(order.paymentProofUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80')}
                        className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition-opacity"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Lihat Struk Asli
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                  <button
                    onClick={() => verifyPaymentProof(order.id, true)}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Validasi Berhasil & Siapkan Unit</span>
                  </button>
                  <button
                    onClick={() => verifyPaymentProof(order.id, false)}
                    className="flex-1 py-2 bg-white hover:bg-rose-50 hover:text-rose-700 text-stone-700 font-semibold text-xs rounded-lg transition-colors border border-stone-300 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <X className="w-4 h-4" />
                    <span>Tolak Slip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Manajemen Status Pesanan Aktif */}
      <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-800" />
              <span>Manajemen Status Armada Sewa Berjalan</span>
            </h3>
            <p className="text-xs text-stone-500">
              Perbarui status: Sedang Diantar / Siap Diambil → Barang Diterima → Selesai Pengembalian.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Penyewa & Kontak</th>
                <th className="p-3">Unit Barang</th>
                <th className="p-3">Batas Kembali</th>
                <th className="p-3">Status Saat Ini</th>
                <th className="p-3 text-right">Tindakan Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80">
              {orders.map(ord => (
                <tr key={ord.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono text-cyan-800 font-semibold">{ord.orderNumber}</td>
                  <td className="p-3">
                    <div className="font-semibold text-stone-900">{ord.customerName}</div>
                    <div className="text-[11px] text-stone-500">{ord.customerPhone}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-stone-900">{ord.product.name}</div>
                    <div className="text-[11px] text-stone-500 capitalize">{ord.product.category}</div>
                  </td>
                  <td className="p-3 font-mono text-stone-600">{ord.returnDueDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        ord.status === 'in_delivery_or_ready'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : ord.status === 'received_in_use'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : ord.status === 'completed'
                          ? 'bg-stone-100 text-stone-700 border border-stone-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {ord.status === 'in_delivery_or_ready'
                        ? 'Siap / Sedang Diantar'
                        : ord.status === 'received_in_use'
                        ? 'Barang Diterima (Disewa)'
                        : ord.status === 'completed'
                        ? 'Selesai'
                        : ord.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {ord.status === 'in_delivery_or_ready' && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            ord.id,
                            'received_in_use',
                            'Admin mengonfirmasi serah terima unit ke penyewa.'
                          )
                        }
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-[11px] shadow-xs"
                      >
                        Tandai Diterima
                      </button>
                    )}

                    {ord.status === 'received_in_use' && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            ord.id,
                            'completed',
                            'Unit dikembalikan dengan aman & deposit dicairkan.'
                          )
                        }
                        className="px-2.5 py-1 bg-cyan-800 hover:bg-cyan-900 text-white font-semibold rounded text-[11px] shadow-xs"
                      >
                        Tandai Selesai
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveOrder(ord);
                        setIsTrackingModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] border border-stone-200 font-medium"
                    >
                      Detail
                    </button>

                    <button
                      onClick={() => {
                        setOrderForAgreement(ord);
                        setIsAgreementModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded text-[11px] border border-cyan-200 font-medium"
                      title="Cetak Surat Perjanjian Sewa & Nota Invoice"
                    >
                      Cetak SPK
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Preview Modal Lightbox */}
      {selectedProofPreview && (
        <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-white rounded-xl overflow-hidden p-3 border border-stone-200 shadow-2xl">
            <button
              onClick={() => setSelectedProofPreview(null)}
              className="absolute top-4 right-4 bg-stone-100 hover:bg-stone-200 p-1.5 rounded-full text-stone-700 shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={selectedProofPreview} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
};
