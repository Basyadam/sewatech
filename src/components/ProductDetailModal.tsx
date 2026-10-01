import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  ShieldCheck,
  Package,
  Truck,
  Building,
  CheckCircle,
  Clock,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { calculateRentalCost, getProductRentalTier, LAPTOP_PRICELIST_STANDARD, LAPTOP_PRICELIST_RAM16 } from '../utils/pricing';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setRentingProduct,
    currentUser,
    setIsKtpModalOpen,
    setIsQrisModalOpen,
    createOrder,
    setPendingBookingConfig
  } = useApp();

  const [rentalDays, setRentalDays] = useState<number>(3);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan'
  );
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [showPricelistTable, setShowPricelistTable] = useState(false);

  if (!selectedProduct) return null;

  // Calculate return date
  const start = new Date(startDate || Date.now());
  const end = new Date(start.getTime() + rentalDays * 86400000);
  const endDateStr = end.toISOString().split('T')[0];

  // Calculate exact pricing based on user tier specification
  const costCalculation = calculateRentalCost(selectedProduct, rentalDays);
  const subtotal = costCalculation.totalFee;
  const deposit = selectedProduct.depositAmount;
  const total = subtotal + deposit;

  const isLaptop = selectedProduct.category === 'laptop-windows' || selectedProduct.category === 'laptop-mac';
  const isRam16OrMore = selectedProduct.ramSpec === '16GB' ||
    selectedProduct.name.toLowerCase().includes('16gb') ||
    selectedProduct.specs.some(s => s.value.includes('16GB'));

  const handleProceedToRental = () => {
    setRentingProduct(selectedProduct);
    const bookingConfig = {
      product: selectedProduct,
      rentalDurationDays: rentalDays,
      startDate,
      endDate: endDateStr,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : 'Hub SewaLaptop.id Senopati'
    };

    if (!currentUser) {
      // Must register and upload KTP first, pass configuration seamlessly
      setPendingBookingConfig(bookingConfig);
      setSelectedProduct(null);
      setIsKtpModalOpen(true);
      return;
    }

    // If user is already registered, create the order & open QRIS directly
    try {
      createOrder(bookingConfig);
      setSelectedProduct(null);
      setIsQrisModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustDays = (delta: number) => {
    setRentalDays(prev => Math.max(1, Math.min(90, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-3 sm:my-8 max-h-[94vh] flex flex-col">
        {/* Header bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F5] sticky top-0 z-10">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-600 truncate mr-2">
            <span className="text-cyan-800 font-bold uppercase shrink-0">{selectedProduct.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate">{selectedProduct.subCategory || 'Armada'}</span>
            {selectedProduct.ramSpec && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] shrink-0">
                  RAM {selectedProduct.ramSpec}
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Image & Highlights & Specifications */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 w-full bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 text-xs bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-emerald-800 border border-emerald-200 font-semibold shadow-xs">
                  {selectedProduct.availableStock > 0
                    ? `Unit Ready (${selectedProduct.availableStock} Tersedia)`
                    : 'Sedang Disewa'}
                </div>
                <div className="absolute top-3 right-3 text-xs font-mono font-medium text-stone-700 bg-white/95 px-2.5 py-1 rounded-md border border-stone-200 shadow-xs">
                  {selectedProduct.condition}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Deskripsi & Peruntukan Unit
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Included Accessories */}
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-cyan-800" />
                  <span>Kelengkapan Dalam Box Sewa</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  {selectedProduct.includedAccessories.map((acc, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 bg-[#FAF9F5] rounded-md border border-stone-200">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-800 shrink-0" />
                      <span className="truncate">{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Spesifikasi Teknis
                </h4>
                <div className="border border-stone-200 rounded-lg overflow-hidden text-xs divide-y divide-stone-100">
                  {selectedProduct.specs.map((spec, i) => (
                    <div key={i} className="grid grid-cols-3 p-2.5 bg-[#FAF9F5]/70">
                      <div className="text-stone-500 font-medium">{spec.label}</div>
                      <div className="col-span-2 text-stone-900 font-mono font-medium">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Pricelist Reference Box for Laptops */}
              {isLaptop && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>Catatan Pricelist Resmi Sewa Laptop</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPricelistTable(!showPricelistTable)}
                      className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold underline"
                    >
                      {showPricelistTable ? 'Sembunyikan Tabel' : 'Lihat Perbandingan Tarif'}
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Sistem otomatis menghitung diskon bertingkat semakin lama durasi sewa: Harian, Paket 3 Hari+, Mingguan (7 Hari), hingga Paket Bulanan (30 Hari).
                  </p>

                  {showPricelistTable && (
                    <div className="mt-3 pt-3 border-t border-amber-200 overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-amber-200 text-amber-900 font-bold">
                            <th className="pb-1.5">Durasi Sewa</th>
                            <th className="pb-1.5">Laptop Standar</th>
                            <th className="pb-1.5">Laptop (RAM 16)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-200/60 font-mono text-stone-800">
                          <tr className={!isRam16OrMore && rentalDays < 3 ? 'bg-amber-100/70 font-bold' : ''}>
                            <td className="py-1">Harian (1-2 hari)</td>
                            <td className="py-1 text-cyan-900">175k/hari</td>
                            <td className="py-1 text-indigo-900">200k/hari</td>
                          </tr>
                          <tr className={rentalDays >= 3 && rentalDays < 7 ? 'bg-amber-100/70 font-bold' : ''}>
                            <td className="py-1">3 Hari+</td>
                            <td className="py-1 text-cyan-900">160k/hari</td>
                            <td className="py-1 text-indigo-900">175k/hari</td>
                          </tr>
                          <tr className={rentalDays >= 7 && rentalDays < 30 ? 'bg-amber-100/70 font-bold' : ''}>
                            <td className="py-1">Mingguan (7 hari)</td>
                            <td className="py-1 text-cyan-900">875k (125k/hari)</td>
                            <td className="py-1 text-indigo-900">975k</td>
                          </tr>
                          <tr className={rentalDays >= 30 ? 'bg-amber-100/70 font-bold' : ''}>
                            <td className="py-1">Bulanan (30 hari)</td>
                            <td className="py-1 text-cyan-900">2400k (80k/hari)</td>
                            <td className="py-1 text-indigo-900">2700k (90k/hari)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Interactive Booking & Tiered Pricing Module */}
            <div className="lg:col-span-6 bg-[#FAF9F5] p-5 rounded-xl border border-stone-200 flex flex-col justify-between space-y-5">
              <div>
                <h2 className="text-xl font-bold text-stone-900 leading-tight">
                  {selectedProduct.name}
                </h2>
                <div className="mt-1 text-xs text-cyan-800 font-semibold">
                  {selectedProduct.headline}
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Tarif Efektif Terpilih</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                        Rp {costCalculation.effectiveDailyRate.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-stone-500 font-normal"> /hari</span>
                    </div>
                    <span className="text-[10px] text-cyan-800 font-medium block">
                      Kategori: {costCalculation.appliedTierName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Uang Jaminan (Deposit)</span>
                    <span className="text-sm font-semibold font-mono text-stone-700 tabular-nums">
                      Rp {selectedProduct.depositAmount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">100% Refundable</span>
                  </div>
                </div>

                {/* Duration selector with EXACT User Requested Tiers */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-stone-700">
                      Pilihan Paket Durasi Sewa:
                    </label>
                    <span className="text-cyan-800 font-mono font-bold">
                      {rentalDays} Hari Terpilih
                    </span>
                  </div>

                  {/* 4 Core Tier Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Harian */}
                    <button
                      type="button"
                      onClick={() => setRentalDays(1)}
                      className={`p-2.5 text-xs rounded-lg border text-left transition-all ${
                        rentalDays === 1
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-bold">Harian</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${rentalDays === 1 ? 'text-cyan-300' : 'text-stone-500'}`}>
                        {isLaptop ? (isRam16OrMore ? '200k/hari' : '175k/hari') : `Rp ${(selectedProduct.dailyRate/1000)}k`}
                      </div>
                    </button>

                    {/* 3 Hari+ */}
                    <button
                      type="button"
                      onClick={() => setRentalDays(3)}
                      className={`p-2.5 text-xs rounded-lg border text-left transition-all ${
                        rentalDays >= 3 && rentalDays < 7
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>3 Hari+</span>
                        <span className="text-[9px] bg-amber-400 text-stone-900 font-bold px-1 rounded">Diskon</span>
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${rentalDays >= 3 && rentalDays < 7 ? 'text-cyan-300' : 'text-stone-500'}`}>
                        {isLaptop ? (isRam16OrMore ? '175k/hari' : '160k/hari') : 'Hemat'}
                      </div>
                    </button>

                    {/* Mingguan */}
                    <button
                      type="button"
                      onClick={() => setRentalDays(7)}
                      className={`p-2.5 text-xs rounded-lg border text-left transition-all ${
                        rentalDays >= 7 && rentalDays < 30
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Mingguan</span>
                        <span className="text-[9px] bg-emerald-500 text-white font-bold px-1 rounded">7 Hari</span>
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${rentalDays >= 7 && rentalDays < 30 ? 'text-cyan-300' : 'text-stone-500'}`}>
                        {isLaptop ? (isRam16OrMore ? '975k' : '875k (125k/h)') : 'Hemat'}
                      </div>
                    </button>

                    {/* Bulanan */}
                    <button
                      type="button"
                      onClick={() => setRentalDays(30)}
                      className={`p-2.5 text-xs rounded-lg border text-left transition-all ${
                        rentalDays >= 30
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Bulanan</span>
                        <span className="text-[9px] bg-cyan-500 text-stone-900 font-bold px-1 rounded">30 Hari</span>
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${rentalDays >= 30 ? 'text-cyan-300' : 'text-stone-500'}`}>
                        {isLaptop ? (isRam16OrMore ? '2700k (90k/h)' : '2400k (80k/h)') : 'Super Hemat'}
                      </div>
                    </button>
                  </div>

                  {/* Fine-tune duration adjustment counter */}
                  <div className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between text-xs shadow-xs">
                    <span className="text-stone-600 font-medium">Atur Hari Kustom:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdjustDays(-1)}
                        className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300"
                        title="Kurangi 1 hari"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={rentalDays}
                        onChange={e => setRentalDays(Math.max(1, Number(e.target.value)))}
                        className="w-14 text-center font-mono font-bold text-xs bg-[#FAF9F5] border border-stone-300 rounded p-1"
                      />
                      <span className="text-stone-500">Hari</span>
                      <button
                        type="button"
                        onClick={() => handleAdjustDays(1)}
                        className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300"
                        title="Tambah 1 hari"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Dates schedule */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] text-stone-500 font-medium block mb-1">Mulai Sewa:</label>
                      <input
                        type="date"
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 text-stone-800 focus:outline-hidden focus:border-cyan-700 shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-500 font-medium block mb-1">Batas Pengembalian:</label>
                      <div className="text-xs bg-[#F5F3ED] border border-stone-200 rounded-lg p-2 text-stone-700 font-mono">
                        {endDateStr} (18:00 WIB)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Metode Pengambilan / Pengiriman:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-2.5 text-xs rounded-lg border flex items-center gap-2 text-left transition-colors ${
                        deliveryMethod === 'delivery'
                          ? 'bg-cyan-50 text-cyan-900 border-cyan-300 shadow-xs'
                          : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-cyan-800 shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-900">Antar Kurir Express</div>
                        <div className="text-[10px] text-stone-500">Jabodetabek Langsung</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-2.5 text-xs rounded-lg border flex items-center gap-2 text-left transition-colors ${
                        deliveryMethod === 'pickup'
                          ? 'bg-cyan-50 text-cyan-900 border-cyan-300 shadow-xs'
                          : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      <Building className="w-4 h-4 text-cyan-800 shrink-0" />
                      <div>
                        <div className="font-semibold text-stone-900">Self Pickup di Hub</div>
                        <div className="text-[10px] text-stone-500">Hub SewaLaptop.id Senopati</div>
                      </div>
                    </button>
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="Alamat lengkap tujuan pengantaran..."
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-cyan-700 shadow-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Pricing Summary with Savings Badge */}
                <div className="mt-5 p-3.5 bg-white rounded-lg border border-stone-200 text-xs space-y-2 shadow-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Biaya Sewa ({rentalDays} Hari - {costCalculation.appliedTierName}):</span>
                    <span className="font-mono text-stone-900 font-semibold tabular-nums">
                      Rp {subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {costCalculation.savings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium text-[11px] bg-emerald-50 px-2 py-1 rounded">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Hemat Diskon Durasi ({costCalculation.appliedTierName}):</span>
                      </span>
                      <span className="font-mono font-bold">- Rp {costCalculation.savings.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span className="flex items-center gap-1">
                      <span>Deposit Jaminan (Dikembalikan Utuh):</span>
                      <Info className="w-3 h-3 text-stone-400" />
                    </span>
                    <span className="font-mono text-stone-700 tabular-nums">
                      Rp {deposit.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex justify-between font-bold text-sm text-stone-900">
                    <span>Total Tagihan QRIS:</span>
                    <span className="font-mono text-cyan-800 text-base tabular-nums">
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToRental}
                  disabled={selectedProduct.availableStock === 0}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedProduct.availableStock > 0
                      ? 'bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>
                    {!currentUser
                      ? 'Daftar & Verifikasi KTP untuk Menyewa'
                      : 'Lanjut Pembayaran QRIS'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="mt-2 text-center text-[10px] text-stone-500">
                  {!currentUser
                    ? 'Syarat penyewa: Wajib registrasi data diri & upload KTP asli (validasi otomatis/admin).'
                    : 'Setelah scan QRIS, lampirkan bukti pembayaran untuk konfirmasi pengiriman.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
