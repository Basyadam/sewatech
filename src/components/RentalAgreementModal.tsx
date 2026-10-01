import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Download,
  AlertCircle
} from 'lucide-react';

export const RentalAgreementModal: React.FC = () => {
  const {
    isAgreementModalOpen,
    setIsAgreementModalOpen,
    orderForAgreement,
    activeOrder
  } = useApp();

  const [printNotice, setPrintNotice] = React.useState<string | null>(null);

  const currentOrder = orderForAgreement || activeOrder;

  if (!isAgreementModalOpen || !currentOrder) return null;

  const handlePrint = () => {
    setPrintNotice('Membuka dialog pencetakan...');
    setTimeout(() => setPrintNotice(null), 3500);

    const printContent = document.getElementById('printable-agreement-content');
    if (!printContent) {
      window.print();
      return;
    }

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Nota-Perjanjian-SewaLaptop-${currentOrder.orderNumber}</title>
              <style>
                @page { size: A4; margin: 12mm; }
                * { box-sizing: border-box; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  color: #1c1917;
                  background: #fff;
                  margin: 0;
                  padding: 12px;
                  font-size: 11px;
                  line-height: 1.5;
                }
                table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 8px; }
                th, td { border: 1px solid #d6d3d1; padding: 6px 10px; font-size: 11px; text-align: left; }
                th { background-color: #f5f5f4; font-weight: bold; }
                .grid { display: flex; gap: 12px; margin-bottom: 12px; }
                .col { flex: 1; border: 1px solid #e7e5e4; padding: 10px; border-radius: 6px; background-color: #fafaf9; }
                .header { border-bottom: 2px solid #1c1917; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        doc.close();

        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch {
            window.print();
          }
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }, 300);
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  const handleDownloadDocument = () => {
    const printContent = document.getElementById('printable-agreement-content');
    if (!printContent) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Nota-Perjanjian-SewaLaptop-${currentOrder.orderNumber}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1c1917;
      background: #f8fafc;
      margin: 0;
      padding: 24px;
      font-size: 12px;
      line-height: 1.5;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .print-bar {
      margin-bottom: 20px;
      padding: 12px 16px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      background: #0e7490;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
    .btn:hover {
      background: #155e75;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: none; }
      .print-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="print-bar">
      <strong>Dokumen Resmi SewaLaptop.id — No. SPK/${currentOrder.orderNumber}</strong>
      <button class="btn" onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF</button>
    </div>
    ${printContent.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nota-Perjanjian-SewaLaptop-${currentOrder.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setPrintNotice('File dokumen SPK berhasil diunduh! Klik file untuk cetak/simpan PDF.');
    setTimeout(() => setPrintNotice(null), 4000);
  };

  const serialNumber =
    currentOrder.product.serialNumbers?.[0] ||
    `${currentOrder.product.category === 'laptop-mac' ? 'APPL-MAC' : 'WIN-PC'}-${currentOrder.orderNumber.replace('SWT-', '').replace('SLP-', '')}-QC1`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[95vh] flex flex-col print:max-w-none print:m-0 print:border-none print:shadow-none print:rounded-none">
        {/* Screen-Only Header Bar */}
        <div className="px-5 py-3.5 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between print:hidden sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-cyan-800" />
            <h3 className="font-bold text-stone-900 text-sm">
              Surat Perjanjian Sewa & Nota Invoice Resmi (SPK)
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
              Sah & Terverifikasi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Buka dialog cetak printer browser / Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadDocument}
              className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Unduh file dokumen mandiri (HTML/PDF)"
            >
              <Download className="w-4 h-4 text-cyan-700" />
              <span>Unduh Dokumen</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAgreementModalOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Notification Toast if active */}
        {printNotice && (
          <div className="px-5 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 print:hidden animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{printNotice}</span>
          </div>
        )}

        {/* Printable Document Body */}
        <div id="printable-agreement-content" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800 text-xs bg-white font-sans print:p-8 print:text-black">
          {/* Letterhead */}
          <div className="border-b-2 border-stone-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase">
                Sewa<span className="text-cyan-700">Laptop.id</span>
              </div>
              <div className="text-[11px] text-stone-600 mt-0.5">
                PT SewaLaptop Indonesia · Layanan Rental Laptop Windows & MacBook Terpercaya
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                Hub Senopati: Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan 12190
              </div>
              <div className="text-[10px] text-stone-500">
                Hotline WA: 0831-8853-7999 (Adam) · Email: admin@sewalaptop.id
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-block bg-stone-900 text-white font-mono font-bold text-[11px] px-2.5 py-1 rounded print:border print:border-black print:text-black print:bg-white">
                SURAT PERJANJIAN & NOTA SEWA
              </span>
              <div className="font-mono text-xs font-bold text-stone-900 mt-1">
                No. Ref: SPK/{currentOrder.orderNumber}
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                Tanggal: {currentOrder.createdAt} WIB
              </div>
            </div>
          </div>

          {/* Renter & Order Meta Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-[#FAF9F5] border border-stone-200 rounded-xl print:bg-transparent print:border print:border-stone-300">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Pihak Kedua (Penyewa Unit):
              </span>
              <div className="text-stone-900 font-bold text-sm">{currentOrder.customerName}</div>
              <div className="text-[11px] text-stone-600">No. WhatsApp: {currentOrder.customerPhone}</div>
              <div className="text-[11px] text-stone-600">Email: {currentOrder.customerEmail}</div>
              <div className="text-[11px] text-stone-600 mt-1">
                <strong className="text-stone-700">Alamat Kirim/Hub:</strong> {currentOrder.deliveryAddress}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Detail Transaksi & Serah Terima:
              </span>
              <div className="text-[11px] text-stone-700">
                <strong>Metode Pengambilan:</strong>{' '}
                {currentOrder.deliveryMethod === 'delivery' ? 'Antar Kurir Khusus SewaLaptop.id' : 'Self Pickup di Hub Senopati'}
              </div>
              <div className="text-[11px] text-stone-700 mt-0.5">
                <strong>Durasi Sewa:</strong> {currentOrder.rentalDurationDays} Hari
              </div>
              <div className="text-[11px] text-stone-700 mt-0.5">
                <strong>Periode:</strong> {currentOrder.startDate} s.d. {currentOrder.endDate}
              </div>
              <div className="text-[11px] text-stone-700 mt-0.5 font-bold text-cyan-900">
                <strong>Batas Akhir Kembali:</strong> {currentOrder.returnDueDate}
              </div>
            </div>
          </div>

          {/* Unit Equipment Specifications Table */}
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
              Spesifikasi Unit Peralatan yang Diserahterimakan:
            </h4>
            <div className="overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs divide-y divide-stone-200">
                <thead className="bg-[#FAF9F5] text-stone-600 text-[11px] font-semibold">
                  <tr>
                    <th className="p-3">Unit Laptop / Gadget</th>
                    <th className="p-3">Kategori & RAM</th>
                    <th className="p-3">Nomor Seri Aset (Serial Number)</th>
                    <th className="p-3 text-right">Kondisi Serah Terima</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  <tr>
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{currentOrder.product.name}</div>
                      <div className="text-[10px] text-stone-500">{currentOrder.product.headline}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize text-stone-700">
                        {currentOrder.product.category === 'laptop-windows' ? 'Laptop Windows' : 'Apple MacBook'}
                      </span>
                      {currentOrder.product.ramSpec && (
                        <div className="font-mono text-[10px] text-cyan-800 font-bold">
                          RAM {currentOrder.product.ramSpec}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-stone-800">
                      {serialNumber}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-block bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                        Lulus QC 100% ({currentOrder.product.condition})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Included Accessories */}
            <div className="mt-2.5 p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600">
              <span className="font-semibold text-stone-800">Kelengkapan Bawaan Unit:</span>{' '}
              {currentOrder.product.includedAccessories.join(', ')}
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
              Rincian Pembayaran & Jaminan Deposit (Lunas QRIS):
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-stone-100 bg-white text-xs">
                <div className="p-3 flex justify-between">
                  <span className="text-stone-600">
                    Biaya Sewa Unit ({currentOrder.rentalDurationDays} Hari @ Rp {currentOrder.dailyRate.toLocaleString('id-ID')}/hari)
                  </span>
                  <span className="font-mono font-semibold text-stone-900">
                    Rp {currentOrder.rentalFeeTotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-3 flex justify-between bg-[#FAF9F5]">
                  <div>
                    <span className="text-stone-700 font-semibold block">
                      Uang Jaminan Garansi (Deposit 100% Refundable)
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Ditransfer kembali ke rekening penyewa saat unit kembali prima tanpa kerusakan.
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    Rp {currentOrder.depositAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="p-3 flex justify-between bg-stone-100 text-stone-900 font-bold border-t border-stone-300">
                  <span>TOTAL PEMBAYARAN LUNAS DITERIMA (QRIS):</span>
                  <span className="font-mono text-base text-cyan-950">
                    Rp {currentOrder.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Clauses & Agreement Terms */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-[10px] leading-relaxed text-stone-600 space-y-1.5">
            <div className="font-bold text-stone-800 text-[11px] mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-800" />
              <span>Ketentuan Hukum & Perjanjian Sewa:</span>
            </div>
            <p>
              1. <strong>Tanggung Jawab Pemakaian:</strong> Penyewa wajib merawat unit dengan itikad baik dan dilarang membongkar segel baut, mengganti suku cadang, atau mengubah BIOS/Firmware.
            </p>
            <p>
              2. <strong>Larangan Penggelapan:</strong> Unit laptop adalah milik sah PT SewaLaptop Indonesia. Dilarang keras menggadaikan, meminjamkan ke pihak ketiga, atau menjual unit. Tindakan melanggar diancam pidana Pasal 372 KUHP tentang Penggelapan.
            </p>
            <p>
              3. <strong>Pencairan Deposit:</strong> Deposit jaminan sebesar Rp {currentOrder.depositAmount.toLocaleString('id-ID')} akan dicairkan utuh via transfer bank dalam kurun waktu 45-120 menit setelah proses pemeriksaan fisik (Quality Control) selesai di Hub SewaLaptop.id.
            </p>
            <p>
              4. <strong>Keterlambatan:</strong> Keterlambatan tanpa konfirmasi tertulis minimal 6 jam sebelum batas jatuh tempo dikenakan denda proporsional harian.
            </p>
          </div>

          {/* Digital Signatures Grid */}
          <div className="pt-4 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border border-stone-200 rounded-xl p-4 bg-white">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">Pihak Pertama (Penyedia)</div>
              <div className="font-bold text-stone-900 mt-0.5">PT SewaLaptop Indonesia</div>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-1 rounded border border-cyan-200">
                  DIGITALLY SIGNED & VERIFIED
                </span>
              </div>
              <div className="text-[11px] font-bold text-stone-800">Operational Hub Manager</div>
              <div className="text-[10px] text-stone-400">Jakarta Selatan, Indonesia</div>
            </div>

            <div className="border border-stone-200 rounded-xl p-4 bg-white">
              <div className="text-[11px] font-semibold text-stone-500 uppercase">Pihak Kedua (Penyewa)</div>
              <div className="font-bold text-stone-900 mt-0.5">{currentOrder.customerName}</div>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  KTP VERIFIED (E-KTP)
                </span>
              </div>
              <div className="text-[11px] font-bold text-stone-800">{currentOrder.customerName}</div>
              <div className="text-[10px] text-stone-400 font-mono">No. WA: {currentOrder.customerPhone}</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-stone-200 bg-[#FAF9F5] flex items-center justify-between print:hidden">
          <span className="text-[11px] text-stone-500">
            Dokumen elektronik ini sah dan berkekuatan hukum sebagai bukti sewa unit.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Cetak via dialog printer browser"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadDocument}
              className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Unduh file SPK mandiri"
            >
              <Download className="w-4 h-4 text-cyan-700" />
              <span>Unduh Dokumen</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAgreementModalOpen(false)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-lg transition-colors border border-stone-200 shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
