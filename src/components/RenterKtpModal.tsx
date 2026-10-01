import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Upload,
  User,
  Phone,
  Mail,
  Home,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

export const RenterKtpModal: React.FC = () => {
  const {
    isKtpModalOpen,
    setIsKtpModalOpen,
    registerCustomer,
    rentingProduct,
    setIsQrisModalOpen,
    createOrder,
    setSelectedProduct,
    pendingBookingConfig,
    setPendingBookingConfig
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Orang Tua');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [ktpPhotoUrl, setKtpPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isKtpModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file foto KTP maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPhotoUrl(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !nik || !address) {
      setErrorMessage('Mohon lengkapi seluruh formulir data identitas Anda.');
      return;
    }

    if (!ktpPhotoUrl) {
      setErrorMessage('Mohon upload foto KTP asli Anda untuk verifikasi identitas.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const newCustomer = registerCustomer({
        fullName,
        email,
        phone,
        nik,
        address,
        emergencyContact: {
          name: emergencyName || 'Keluarga Terdekat',
          relation: emergencyRelation,
          phone: emergencyPhone || phone
        },
        ktpPhotoUrl,
        ktpStatus: 'verified'
      });

      setIsSubmitting(false);
      setIsKtpModalOpen(false);

      // If user came here while trying to rent a product, proceed directly to order & QRIS payment
      if (pendingBookingConfig) {
        createOrder({
          product: pendingBookingConfig.product,
          rentalDurationDays: pendingBookingConfig.rentalDurationDays,
          startDate: pendingBookingConfig.startDate,
          endDate: pendingBookingConfig.endDate,
          deliveryMethod: pendingBookingConfig.deliveryMethod,
          deliveryAddress: pendingBookingConfig.deliveryAddress || address
        });
        setPendingBookingConfig(null);
        setIsQrisModalOpen(true);
      } else if (rentingProduct) {
        setSelectedProduct(rentingProduct);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-3 sm:my-8">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Pendaftaran Akun Penyewa & Verifikasi KTP
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Isi data asli sesuai KTP untuk keperluan serah terima unit laptop.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsKtpModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Lengkap (Sesuai KTP) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Haekal Pratama"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-cyan-600 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-cyan-600 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Email Aktif *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-cyan-600 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                NIK (16 Digit KTP) *
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="3174xxxxxxxxxxxx"
                  value={nik}
                  onChange={e => setNik(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 font-mono focus:outline-hidden focus:border-cyan-600 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Alamat Domisili Lengkap Saat Ini *
            </label>
            <div className="relative">
              <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                required
                rows={2}
                placeholder="Nama jalan, nomor rumah/kost/apartemen, kelurahan, kecamatan, kota..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-cyan-600 shadow-xs"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Kontak Darurat (Emergency Contact)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Nama Kontak Darurat</label>
                <input
                  type="text"
                  placeholder="Contoh: Hendro Wibowo"
                  value={emergencyName}
                  onChange={e => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 shadow-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Hubungan</label>
                <select
                  value={emergencyRelation}
                  onChange={e => setEmergencyRelation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 shadow-xs"
                >
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Pasangan (Suami/Istri)">Pasangan (Suami/Istri)</option>
                  <option value="Kakak/Adik">Kakak/Adik Kandung</option>
                  <option value="Rekan Kerja/Bisnis">Rekan Kerja/Bisnis</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">No. WhatsApp Darurat</label>
                <input
                  type="tel"
                  placeholder="0813xxxxxxxx"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* KTP Document Upload Area */}
          <div className="pt-2 border-t border-slate-200">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Upload Foto KTP Asli & Tanda Pengenal *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-cyan-600 bg-slate-50/60 hover:bg-cyan-50/20 rounded-xl p-4 text-center cursor-pointer transition-colors"
            >
              {ktpPhotoUrl ? (
                <div className="space-y-2" onClick={e => e.stopPropagation()}>
                  <div className="max-h-40 max-w-sm mx-auto overflow-hidden rounded-lg border border-slate-300 shadow-xs">
                    <img src={ktpPhotoUrl} alt="KTP Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Foto KTP Berhasil Dipilih & Terbaca</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md text-xs font-medium shadow-2xs"
                    >
                      Ganti Foto KTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setKtpPhotoUrl('')}
                      className="text-xs text-rose-600 hover:text-rose-700 underline font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 py-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-800 font-semibold">
                    Klik untuk Pilih Foto KTP dari Galeri / Kamera
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Format JPG, JPEG, atau PNG (Maksimal 5MB). Pastikan NIK dan nama terlihat jelas.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message if incomplete */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{isSubmitting ? 'Memproses Validasi Dokumen...' : 'Daftar & Simpan Identitas Asli'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
