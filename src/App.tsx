/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RenterKtpModal } from './components/RenterKtpModal';
import { QrisPaymentModal } from './components/QrisPaymentModal';
import { UploadProofModal } from './components/UploadProofModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RentalAgreementModal } from './components/RentalAgreementModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { WhatsAppSupportBubble } from './components/WhatsAppSupportBubble';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  Laptop,
  Apple,
  Compass,
  Camera,
  ShieldCheck,
  QrCode,
  Truck,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

const MainRenterView: React.FC = () => {
  const { products, categoryFilter, searchQuery, setCategoryFilter } = useApp();

  const filteredProducts = products.filter(product => {
    // Strictly enforce laptop-only items (no drone or camera)
    if (product.category !== 'laptop-windows' && product.category !== 'laptop-mac') {
      return false;
    }
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.subCategory && product.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        {/* Pricelist Resmi Sewa Laptop (Catatan Durasi Peminjaman) */}
        <section id="pricelist-laptop" className="py-10 bg-white border-y border-stone-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Skema Tarif & Durasi Peminjaman Resmi</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Pricelist Sewa Laptop SewaTech
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed max-w-2xl">
                  Sewa fleksibel harian, mingguan, hingga bulanan dengan potongan tarif otomatis semakin panjang durasi sewa Anda.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCategoryFilter('laptop-windows')}
                className="text-xs font-semibold text-cyan-800 hover:text-cyan-900 flex items-center gap-1"
              >
                <span>Lihat unit laptop siap sewa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2 Pricelist Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Laptop Standar */}
              <div className="bg-[#FAF9F5] border border-stone-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-stone-300 transition-all">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        Standar / RAM 8GB
                      </span>
                      <h3 className="text-lg font-bold text-stone-900 mt-1.5">
                        Pricelist Sewa Laptop
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        ThinkPad L14 / Dell Latitude / HP ProBook (Core i5, SSD 256GB - 512GB)
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 font-mono">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 text-xs">
                      <span className="font-sans font-medium text-stone-700">Harian (1-2 Hari):</span>
                      <span className="font-bold text-stone-900 text-sm">175k <span className="text-xs font-normal text-stone-500 font-sans">/hari</span></span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 text-xs">
                      <span className="font-sans font-medium text-stone-700 flex items-center gap-1.5">
                        <span>3 Hari+:</span>
                        <span className="font-sans text-[10px] bg-amber-100 text-amber-900 px-1 rounded font-bold">Diskon</span>
                      </span>
                      <span className="font-bold text-cyan-900 text-sm">160k <span className="text-xs font-normal text-stone-500 font-sans">/hari</span></span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs">
                      <span className="font-sans font-medium text-emerald-950 flex items-center gap-1.5">
                        <span>Mingguan (7 Hari):</span>
                        <span className="font-sans text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">Hemat!</span>
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-emerald-900 text-sm">875k</span>
                        <span className="font-sans text-[11px] text-emerald-800 block">(125k/hari)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-cyan-50/70 rounded-lg border border-cyan-200 text-xs">
                      <span className="font-sans font-medium text-cyan-950 flex items-center gap-1.5">
                        <span>Bulanan (30 Hari):</span>
                        <span className="font-sans text-[10px] bg-cyan-700 text-white px-1.5 py-0.2 rounded font-bold">Super Hemat!</span>
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-cyan-950 text-sm">2.400k</span>
                        <span className="font-sans text-[11px] text-cyan-800 block">(80k/hari)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Cocok untuk administrasi kantor, entry data, tugas kuliah, dan Zoom meeting.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Sudah terinstall Windows 11 Original + Microsoft Office 2024.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('laptop-windows');
                      const katalogEl = document.getElementById('katalog');
                      if (katalogEl) katalogEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Pilih Unit Laptop Standar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Laptop RAM 16 */}
              <div className="bg-[#FAF9F5] border border-cyan-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-cyan-300 transition-all ring-1 ring-cyan-500/10">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Performa Tinggi / RAM 16GB
                      </span>
                      <h3 className="text-lg font-bold text-stone-900 mt-1.5">
                        Pricelist Sewa Laptop (RAM 16)
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        ThinkPad T14s / ASUS Vivobook OLED / MacBook Air M3 (Core i7 / Ryzen 7, SSD 512GB)
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 font-mono">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 text-xs">
                      <span className="font-sans font-medium text-stone-700">Harian (1-2 Hari):</span>
                      <span className="font-bold text-stone-900 text-sm">200k <span className="text-xs font-normal text-stone-500 font-sans">/hari</span></span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200 text-xs">
                      <span className="font-sans font-medium text-stone-700 flex items-center gap-1.5">
                        <span>3 Hari+:</span>
                        <span className="font-sans text-[10px] bg-amber-100 text-amber-900 px-1 rounded font-bold">Diskon</span>
                      </span>
                      <span className="font-bold text-indigo-900 text-sm">175k <span className="text-xs font-normal text-stone-500 font-sans">/hari</span></span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs">
                      <span className="font-sans font-medium text-emerald-950 flex items-center gap-1.5">
                        <span>Mingguan (7 Hari):</span>
                        <span className="font-sans text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">Hemat!</span>
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-emerald-900 text-sm">975k</span>
                        <span className="font-sans text-[11px] text-emerald-800 block">(Paket 7 Hari)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-cyan-50/70 rounded-lg border border-cyan-200 text-xs">
                      <span className="font-sans font-medium text-cyan-950 flex items-center gap-1.5">
                        <span>Bulanan (30 Hari):</span>
                        <span className="font-sans text-[10px] bg-cyan-700 text-white px-1.5 py-0.2 rounded font-bold">Super Hemat!</span>
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-cyan-950 text-sm">2.700k</span>
                        <span className="font-sans text-[11px] text-cyan-800 block">(90k/hari)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Ideal untuk spreadsheet raksasa, coding, Canva/Photoshop, Figma & UI/UX.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Multitasking puluhan tab lancar tanpa lag dengan RAM 16GB dual channel.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('laptop-windows');
                      const katalogEl = document.getElementById('katalog');
                      if (katalogEl) katalogEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Pilih Unit Laptop RAM 16</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Product Grid Section */}
        <section id="katalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
                Armada Siap Pakai Hari Ini
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Katalog Produk & Kategori Pilihan
              </h2>
            </div>

            <div className="text-xs text-stone-500 font-mono">
              Menampilkan {filteredProducts.length} unit peralatan
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-stone-200/90 shadow-xs">
              <p className="text-stone-600 text-sm">
                Tidak ada produk yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setCategoryFilter('all')}
                className="mt-3 text-xs text-cyan-800 hover:text-cyan-900 font-semibold"
              >
                Tampilkan semua katalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 4-Step Rental Process Section (Cara Sewa) */}
        <section id="cara-sewa" className="py-14 border-t border-stone-200/80 bg-[#F5F3ED]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
                Transparansi & Kemudahan
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 [text-wrap:balance]">
                Alur Peminjaman Mudah Tanpa Syarat Ribet
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Jelajahi unit bebas tanpa akun. Daftarkan diri hanya saat Anda memutuskan untuk meminjam barang.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="font-bold text-stone-900 text-sm">1. Eksplorasi Bebas</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Penyewa dapat melihat seluruh katalog laptop Windows dan MacBook tanpa harus membuat akun terlebih dahulu.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="font-bold text-stone-900 text-sm">2. Verifikasi KTP Digital</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Saat menekan tombol sewa, isi formulir data diri, no. WhatsApp, kontak darurat, serta upload foto KTP asli yang divalidasi cepat oleh sistem/admin.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="font-bold text-stone-900 text-sm">3. Bayar QRIS & Upload Slip</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Scan kode QRIS dinamis dari aplikasi bank atau e-wallet mana saja. Unggah bukti pembayaran untuk diverifikasi instan.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h3 className="font-bold text-stone-900 text-sm">4. Kirim/Ambil & Selesai</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Pantau pelacakan status: Siap Diantar → Diterima → Selesai. Uang deposit jaminan dikembalikan utuh setelah unit kembali prima.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & FAQ Section (Jaminan) */}
        <section id="jaminan" className="py-14 border-t border-stone-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
                  Keamanan & Resolusi Terpadu
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                  Proteksi Unit & Uang Jaminan yang Adil untuk Kedua Pihak
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  SewaLaptop.id memiliki sistem inspeksi Quality Control ketat sebelum dan sesudah sewa. Apabila terjadi kendala teknis, keterlambatan, atau kerusakan, Pusat Penyelesaian Masalah kami siap mendampingi lewat WhatsApp aktif dan tim legal.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-900">100% Pengembalian Deposit</span>
                      <p className="text-stone-600 mt-0.5">
                        Deposit jaminan ditransfer kembali ke rekening penyewa dalam waktu maksimal 2 jam setelah unit di-QC.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-900">Notifikasi Reminder H-1 via WhatsApp</span>
                      <p className="text-stone-600 mt-0.5">
                        Pengingat otomatis waktu pengembalian dikirimkan agar Anda terhindar dari denda keterlambatan sewa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold text-stone-900">Layanan Kurir Khusus Anti Benturan</span>
                      <p className="text-stone-600 mt-0.5">
                        Armada kurir internal Jabodetabek menjamin unit laptop dan MacBook sampai tepat waktu dengan tas pelindung tahan benturan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Box */}
              <div className="p-6 bg-[#FAF9F5] border border-stone-200 rounded-2xl space-y-4 text-xs shadow-xs">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-800" />
                  <span>Pertanyaan Sering Diajukan (FAQ)</span>
                </h3>

                <div className="space-y-3 divide-y divide-stone-200/80">
                  <div className="pt-2 first:pt-0">
                    <div className="font-semibold text-stone-900">
                      Apakah wajib daftar akun jika hanya ingin melihat harga?
                    </div>
                    <p className="text-stone-600 mt-1">
                      Tidak. Anda bebas melihat katalog, spesifikasi, dan ketersediaan unit tanpa akun. Akun dan KTP hanya diwajibkan ketika hendak meminjam unit.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="font-semibold text-stone-900">
                      Bagaimana cara kerja pembayaran QRIS?
                    </div>
                    <p className="text-stone-600 mt-1">
                      Sistem menampilkan kode QRIS dinamis lengkap dengan total sewa dan deposit. Setelah scan, cukup upload bukti transfer untuk divalidasi sistem/admin.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="font-semibold text-stone-900">
                      Bagaimana jika barang rusak atau terjadi kendala saat dipakai?
                    </div>
                    <p className="text-stone-600 mt-1">
                      Laporkan segera melalui bubble WhatsApp CS kami. Pusat Penyelesaian Masalah akan mengecek apakah kerusakan tercakup garansi atau memerlukan penyesuaian dari deposit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#EFECE6] border-t border-stone-200/90 py-8 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-stone-800">SewaLaptop.id</span>
            <span>·</span>
            <span>Platform Rental Laptop Windows & MacBook</span>
            <span>·</span>
            <a
              href="https://wa.me/6283188537999?text=Halo%20SewaLaptop.id%20(Adam)%2C%20saya%20ingin%20konsultasi%20sewa%20laptop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 hover:underline"
            >
              <span>Hotline WhatsApp CS Adam: 0831-8853-7999</span>
            </a>
          </div>
          <div>
            © {new Date().getFullYear()} SewaLaptop.id. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const AppContent: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <>
      {viewMode === 'renter' ? <MainRenterView /> : <AdminDashboard />}

      {/* Global Modals & Overlay Drawers */}
      <ProductDetailModal />
      <RenterKtpModal />
      <QrisPaymentModal />
      <UploadProofModal />
      <OrderTrackingModal />
      <RentalAgreementModal />
      <AdminAuthModal />
      <NotificationDrawer />
      <WhatsAppSupportBubble />
    </>
  );
};
