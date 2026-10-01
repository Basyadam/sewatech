import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlatformIssue, IssueType } from '../../types';
import {
  AlertTriangle,
  ShieldAlert,
  MessageCircle,
  Gavel,
  CheckCircle,
  Clock,
  Phone,
  User,
  Plus,
  ArrowRight,
  FileWarning,
  Send,
  X,
  ExternalLink
} from 'lucide-react';

export const AdminIssuesCenter: React.FC = () => {
  const { issues, createIssue, logIssueAction, updateIssueStatus, orders } = useApp();

  const [selectedIssue, setSelectedIssue] = useState<PlatformIssue>(issues[0] || null);
  const [newLogNote, setNewLogNote] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // New issue form state
  const [reportOrderId, setReportOrderId] = useState(orders[0]?.id || '');
  const [reportIssueType, setReportIssueType] = useState<IssueType>('barang_rusak');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportFine, setReportFine] = useState(500000);

  const issueTypeBadgeMap: Record<IssueType, { label: string; color: string }> = {
    barang_hilang: { label: 'Barang Hilang / Penggelapan', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    belum_kembali: { label: 'Penyewa Belum Mengembalikan', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    barang_rusak: { label: 'Barang Rusak / Gores Parah', color: 'bg-orange-50 text-orange-800 border-orange-200' },
    terlambat: { label: 'Keterlambatan Melebihi Batas', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    penipuan_ktp: { label: 'Indikasi KTP Tidak Valid', color: 'bg-purple-50 text-purple-800 border-purple-200' }
  };

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const triggerFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim() || !selectedIssue) return;
    logIssueAction(selectedIssue.id, 'Tindakan Investigasi Tim', newLogNote);
    setNewLogNote('');
  };

  const handleSendWaWarning = (issue: PlatformIssue) => {
    const formattedPhone = issue.customerPhone.startsWith('0')
      ? '62' + issue.customerPhone.slice(1)
      : issue.customerPhone;

    const somasiText = `[SOMASI RESMI SEWATECH INDONESIA]\nKepada Yth. Sdr/i ${issue.customerName},\n\nTerkait transaksi sewa unit ${issue.productName} (Kasus #${issue.caseNumber}).\nKendala tercatat: ${issue.title}.\nNilai klaim denda/ganti rugi: Rp ${issue.fineAmount.toLocaleString('id-ID')}.\n\nMohon segera kembalikan unit atau selesaikan kewajiban ganti rugi dalam 1x24 jam untuk menghindari pelaporan hukum & pemotongan deposit. Hubungi kami segera di nomor ini.`;

    // Log action in web system
    logIssueAction(
      issue.id,
      'Kirim Somasi / Peringatan WA',
      `Somasi hukum otomatis dikirimkan ke WhatsApp penyewa (${issue.customerPhone}). Tuntutan ganti rugi: Rp ${issue.fineAmount.toLocaleString('id-ID')}.`
    );

    // Also open real WhatsApp link
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(somasiText)}`, '_blank');

    triggerFeedback(`Somasi WhatsApp berhasil dikirim ke ${issue.customerName} (${issue.customerPhone})`);
  };

  const handleCreateIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrder = orders.find(o => o.id === reportOrderId);
    if (!targetOrder) return;

    createIssue({
      orderId: targetOrder.id,
      customerId: targetOrder.customerId,
      customerName: targetOrder.customerName,
      customerPhone: targetOrder.customerPhone,
      productName: targetOrder.product.name,
      issueType: reportIssueType,
      title: reportTitle || `Kendala Sewa: ${issueTypeBadgeMap[reportIssueType].label}`,
      description: reportDesc,
      fineAmount: reportFine,
      status: 'open'
    });

    setIsReportModalOpen(false);
    setReportTitle('');
    setReportDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Report Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-stone-900">
              Pusat Penyelesaian Masalah (Dispute & Incident Center)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Sistem penanganan insiden barang hilang, penyewa tidak mengembalikan unit, barang rusak saat kembali, penahanan deposit, dan somasi langsung via WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Laporkan Kasus Baru</span>
        </button>
      </div>

      {/* Main Split Layout: Issue List on Left, Active Case Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center justify-between">
            <span>Daftar Kasus Aktif ({issues.length})</span>
            <span className="text-[11px] text-stone-400 font-normal">Pilih untuk detail tindakan</span>
          </div>

          <div className="space-y-3">
            {issues.map(iss => {
              const badge = issueTypeBadgeMap[iss.issueType];
              const isSelected = selectedIssue?.id === iss.id;

              return (
                <div
                  key={iss.id}
                  onClick={() => setSelectedIssue(iss)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-rose-500 shadow-md ring-1 ring-rose-400/40'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-stone-500 font-semibold">{iss.caseNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm leading-snug">{iss.title}</h4>

                  <div className="mt-2 text-xs text-stone-600 space-y-0.5">
                    <div>Penyewa: <span className="text-stone-900 font-medium">{iss.customerName}</span> ({iss.customerPhone})</div>
                    <div>Unit: <span className="text-stone-800">{iss.productName}</span></div>
                    <div className="text-rose-700 font-mono font-bold">Estimasi Denda/Klaim: Rp {iss.fineAmount.toLocaleString('id-ID')}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span>Lapor: {iss.reportedAt}</span>
                    <span className="capitalize text-stone-700 font-medium">
                      Status: {iss.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Issue Workspace */}
        <div className="lg:col-span-7">
          {selectedIssue ? (
            <div className="p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs space-y-5">
              {/* Workspace Header */}
              <div className="border-b border-stone-200 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Kasus #{selectedIssue.caseNumber}
                  </span>
                  <div className="text-xs text-stone-500">
                    Terakhir diperbarui: <span className="text-stone-700 font-medium">{selectedIssue.lastUpdated}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-2 leading-tight">
                  {selectedIssue.title}
                </h3>
                <p className="text-xs text-stone-700 mt-2 bg-[#FAF9F5] p-3 rounded-lg border border-stone-200 leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>

              {/* Renter Details & Financial impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-cyan-800" />
                    <span>Identitas Penyewa Terlapor</span>
                  </div>
                  <div className="text-stone-600">Nama: <span className="text-stone-900 font-semibold">{selectedIssue.customerName}</span></div>
                  <div className="text-stone-600">WhatsApp: <span className="text-stone-900 font-mono">{selectedIssue.customerPhone}</span></div>
                  <div className="text-stone-600">Unit: <span className="text-stone-800">{selectedIssue.productName}</span></div>
                </div>

                <div className="p-3 bg-[#FAF9F5] rounded-lg border border-stone-200 space-y-1.5">
                  <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <FileWarning className="w-4 h-4 text-amber-700" />
                    <span>Tuntutan Ganti Rugi / Denda</span>
                  </div>
                  <div className="text-stone-500">Nominal Klaim:</div>
                  <div className="text-lg font-bold font-mono text-rose-700 tabular-nums">
                    Rp {selectedIssue.fineAmount.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Dapat dipotong dari deposit jaminan atau ditagihkan via somasi WA.
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons for Dispute Resolution */}
              <div className="p-3.5 bg-[#FAF9F5] rounded-xl border border-stone-200 space-y-2">
                <div className="text-xs font-semibold text-stone-800 mb-1">
                  Pilihan Tindakan Penyelesaian Platform & WhatsApp:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleSendWaWarning(selectedIssue)}
                    className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    title="Buka WA dan kirim somasi resmi ke penyewa"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Kirim Somasi WA</span>
                    <ExternalLink className="w-3 h-3 text-emerald-200" />
                  </button>

                  <button
                    onClick={() => {
                      logIssueAction(
                        selectedIssue.id,
                        'Penahanan & Pemotongan Deposit',
                        'Deposit jaminan ditahan penuh sebagai kompensasi ganti rugi unit.'
                      );
                      triggerFeedback('Deposit jaminan berhasil diklaim platform untuk ganti rugi.');
                    }}
                    className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Potong Deposit</span>
                  </button>

                  <button
                    onClick={() => {
                      updateIssueStatus(selectedIssue.id, 'resolved', 'Penyewa telah melunasi denda dan mengembalikan unit.');
                      triggerFeedback('Kasus telah diselesaikan dan status ditutup.');
                    }}
                    className="p-2.5 bg-white hover:bg-stone-100 text-stone-800 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-stone-300 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-cyan-800" />
                    <span>Tandai Selesai</span>
                  </button>
                </div>
                {actionFeedback && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{actionFeedback}</span>
                  </div>
                )}
              </div>

              {/* Action Log History */}
              <div>
                <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  Riwayat Langkah Investigasi & Komunikasi
                </h4>
                <div className="border border-stone-200 rounded-lg p-3 bg-[#FAF9F5] divide-y divide-stone-200 space-y-2.5">
                  {selectedIssue.actionsLog.map((log, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 text-xs">
                      <div className="flex items-center justify-between text-stone-600 mb-0.5">
                        <span className="font-semibold text-stone-900">{log.action}</span>
                        <span className="text-[10px] font-mono text-stone-500">{log.date}</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">{log.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddLog} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambahkan catatan tindakan (misal: sudah ditelepon, penyewa berjanji besok drop unit)..."
                  value={newLogNote}
                  onChange={e => setNewLogNote(e.target.value)}
                  className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-rose-600 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!newLogNote.trim()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-xs"
                >
                  Catat
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-500 text-xs bg-white border border-stone-200 rounded-xl shadow-xs">
              Pilih kasus dari daftar sebelah kiri untuk meninjau opsi tindakan penyelesaian.
            </div>
          )}
        </div>
      </div>

      {/* Modal Laporkan Kasus Baru */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-base">Laporkan Kasus Masalah Baru</h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIssueSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-semibold block mb-1">Pilih Pesanan Terkait:</label>
                <select
                  value={reportOrderId}
                  onChange={e => setReportOrderId(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                >
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      #{o.orderNumber} - {o.customerName} ({o.product.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Jenis Kendala / Masalah:</label>
                <select
                  value={reportIssueType}
                  onChange={e => setReportIssueType(e.target.value as IssueType)}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                >
                  <option value="belum_kembali">Penyewa Belum Mengembalikan (Overdue)</option>
                  <option value="barang_hilang">Barang Hilang / Dugaan Penggelapan</option>
                  <option value="barang_rusak">Barang Rusak Saat Pengembalian</option>
                  <option value="terlambat">Keterlambatan dengan Denda Harian</option>
                  <option value="penipuan_ktp">Indikasi Identitas Palsu</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Judul Ringkasan Kasus:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Unit Laptop ThinkPad Belum Dikembalikan Setelah 3 Hari Batas Sewa"
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Detail Kronologi:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan kondisi barang, respons penyewa, dan upaya komunikasi awal..."
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Taksiran Nilai Klaim/Denda (Rp):</label>
                <input
                  type="number"
                  required
                  value={reportFine}
                  onChange={e => setReportFine(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF9F5] border border-stone-300 rounded-lg text-stone-900 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  Simpan & Daftarkan Kasus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
