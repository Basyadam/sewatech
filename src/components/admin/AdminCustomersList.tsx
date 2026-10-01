import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  ShieldCheck,
  Phone,
  Mail,
  Home,
  Star,
  MessageCircle,
  Eye,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminCustomersList: React.FC = () => {
  const { customers, verifyCustomerKtp, setIsWaChatOpen, setWaPrefilledMessage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [previewKtp, setPreviewKtp] = useState<string | null>(null);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nik.includes(searchTerm) ||
      c.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || c.ktpStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenWaChat = (phone: string, name: string) => {
    setWaPrefilledMessage(`Halo kak ${name}, kami dari tim administrasi SewaTech ingin konfirmasi...`);
    setIsWaChatOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header and Search Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-stone-200/90 rounded-xl shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-800" />
            <span>Database Customer Terdaftar & Validasi KTP</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Daftar seluruh penyewa dengan data identitas, status verifikasi KTP, kontak darurat, dan reputasi skor.
          </p>
        </div>

        <div className="text-xs font-mono text-stone-700 bg-[#FAF9F5] px-3 py-1.5 rounded-lg border border-stone-200">
          Total: <span className="text-stone-900 font-bold">{customers.length} Akun</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama lengkap, NIK 16 digit, atau nomor WhatsApp..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'verified', 'pending', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 text-xs rounded-lg capitalize transition-colors border ${
                filterStatus === status
                  ? 'bg-stone-900 text-white font-semibold border-stone-900 shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {status === 'all' ? 'Semua Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] text-stone-600 border-b border-stone-200">
              <tr>
                <th className="p-3">Nama Penyewa & NIK</th>
                <th className="p-3">Kontak & Email</th>
                <th className="p-3">Alamat Domisili</th>
                <th className="p-3">Kontak Darurat</th>
                <th className="p-3">Status KTP</th>
                <th className="p-3">Skor & Sewa</th>
                <th className="p-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    Tidak ditemukan data customer yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-stone-50/80">
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{cust.fullName}</div>
                      <div className="font-mono text-[11px] text-stone-500">NIK: {cust.nik}</div>
                      <div className="text-[10px] text-stone-400">Terdaftar: {cust.registeredAt}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-mono text-stone-800 font-medium">{cust.phone}</div>
                      <div className="text-stone-500 text-[11px]">{cust.email}</div>
                    </td>

                    <td className="p-3 max-w-[200px]">
                      <div className="text-stone-700 truncate" title={cust.address}>
                        {cust.address}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-stone-800">{cust.emergencyContact.name}</div>
                      <div className="text-[10px] text-stone-500">
                        {cust.emergencyContact.relation} · {cust.emergencyContact.phone}
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                          cust.ktpStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : cust.ktpStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {cust.ktpStatus === 'verified' && <Check className="w-3 h-3" />}
                        {cust.ktpStatus === 'pending' && <AlertCircle className="w-3 h-3" />}
                        {cust.ktpStatus === 'rejected' && <X className="w-3 h-3" />}
                        <span className="capitalize">{cust.ktpStatus}</span>
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{cust.trustScore.toFixed(1)}</span>
                      </div>
                      <div className="text-[10px] text-stone-500">{cust.rentalsCompleted}x selesai</div>
                    </td>

                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => setPreviewKtp(cust.ktpPhotoUrl)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] border border-stone-200"
                        title="Lihat KTP"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" /> KTP
                      </button>

                      <button
                        onClick={() => handleOpenWaChat(cust.phone, cust.fullName)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px]"
                        title="Hubungi via WA"
                      >
                        <MessageCircle className="w-3.5 h-3.5 inline mr-1" /> Chat WA
                      </button>

                      {cust.ktpStatus === 'pending' && (
                        <button
                          onClick={() => verifyCustomerKtp(cust.id, true)}
                          className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] shadow-xs"
                          title="Validasi KTP"
                        >
                          Validasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KTP Modal Lightbox */}
      {previewKtp && (
        <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-xl overflow-hidden p-3 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-2">
              <span className="text-xs font-bold text-stone-900">Pratinjau KTP Digital</span>
              <button
                onClick={() => setPreviewKtp(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={previewKtp} alt="KTP Preview" className="w-full h-auto rounded" />
          </div>
        </div>
      )}
    </div>
  );
};
