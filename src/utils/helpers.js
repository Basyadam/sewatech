export function toNumber(value, fallback = 0) {
  const result = Number(value ?? fallback);
  return Number.isFinite(result) ? result : fallback;
}

export function formatCurrency(value, options = {}) {
  const {
    locale = 'id-ID',
    currency = 'IDR',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    symbol = 'Rp'
  } = options;

  const numericValue = toNumber(value, 0);

  if (!Number.isFinite(numericValue)) {
    return `${symbol} 0`;
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(numericValue);

  return formatted.replace(/IDR|Rp/gi, symbol).replace(/\s+/g, ' ').trim();
}

export function formatDate(value, locale = 'id-ID', fallback = '-') {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium'
  }).format(date);
}

export function formatDateTime(value, locale = 'id-ID', fallback = '-') {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatPhoneNumber(phone, fallback = '-') {
  const digits = String(phone ?? '').replace(/\D/g, '');

  if (!digits) return fallback;

  if (digits.length <= 4) return digits;

  if (digits.length === 10 || digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '($1) $2-$3');
  }

  return digits.replace(/^(\d{4})(\d{4,})(\d{0,})$/, '$1-$2').trim();
}

export function generateReceiptNumber(prefix = 'KWT', date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `${prefix}-${year}${month}${day}-${random}`;
}

export function buildReceiptPayload({
  orderId,
  customerName,
  items = [],
  totalAmount = 0,
  paymentMethod = 'Transfer',
  receiptNumber,
  notes = ''
}) {
  return {
    orderId,
    customerName,
    receiptNumber: receiptNumber || generateReceiptNumber('KWT'),
    paymentMethod,
    items,
    totalAmount: toNumber(totalAmount, 0),
    notes,
    createdAt: new Date().toISOString()
  };
}

export function createReceiptText(receipt) {
  const {
    customerName = 'Customer',
    receiptNumber = generateReceiptNumber('KWT'),
    paymentMethod = 'Transfer',
    items = [],
    totalAmount = 0,
    notes = ''
  } = receipt || {};

  const itemList = items
    .map((item) => `- ${item.name ?? 'Item'}: ${formatCurrency(item.price ?? item.total ?? 0)}`)
    .join('\n');

  return [
    'KWITANSI PEMBAYARAN',
    `No. ${receiptNumber}`,
    `Pelanggan: ${customerName}`,
    `Metode: ${paymentMethod}`,
    '',
    itemList || '- Tidak ada item',
    '',
    `Total: ${formatCurrency(totalAmount)}`,
    notes ? `Catatan: ${notes}` : '',
    '',
    'Terima kasih.'
  ]
    .filter(Boolean)
    .join('\n');
}

export function calculateRentalTotal({
  dailyRate = 0,
  quantity = 1,
  durationDays = 1,
  deposit = 0,
  discount = 0,
  tax = 0
}) {
  const base = toNumber(dailyRate, 0) * toNumber(quantity, 1) * toNumber(durationDays, 1);
  const discounted = Math.max(base - toNumber(discount, 0), 0);
  const withTax = discounted + toNumber(tax, 0);

  return {
    baseAmount: base,
    discountAmount: toNumber(discount, 0),
    taxAmount: toNumber(tax, 0),
    depositAmount: toNumber(deposit, 0),
    totalAmount: withTax,
    payableAmount: Math.max(withTax - toNumber(deposit, 0), 0)
  };
}

export function getRentalStatusLabel(status) {
  const statusMap = {
    pending: 'Menunggu Konfirmasi',
    confirmed: 'Dikonfirmasi',
    active: 'Sedang Dipinjam',
    returned: 'Sudah Dikembalikan',
    paid: 'Lunas',
    cancelled: 'Dibatalkan',
    overdue: 'Terlambat'
  };

  return statusMap[String(status ?? '').toLowerCase()] || 'Status Tidak Dikenal';
}

export function validateRentalForm(form = {}) {
  const { customerName, phone, startDate, endDate, productId, durationDays } = form;
  const errors = {};

  if (!customerName || String(customerName).trim().length < 2) {
    errors.customerName = 'Nama pelanggan minimal 2 karakter';
  }

  if (!phone || String(phone).replace(/\D/g, '').length < 10) {
    errors.phone = 'Nomor telepon minimal 10 digit';
  }

  if (!startDate) {
    errors.startDate = 'Tanggal mulai sewa wajib diisi';
  }

  if (!endDate) {
    errors.endDate = 'Tanggal selesai sewa wajib diisi';
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    errors.endDate = 'Tanggal selesai tidak boleh lebih kecil dari tanggal mulai';
  }

  if (!productId) {
    errors.productId = 'Pilih produk sewa terlebih dahulu';
  }

  if (durationDays && Number(durationDays) <= 0) {
    errors.durationDays = 'Durasi sewa harus lebih dari 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function calculateLateFee({
  dailyRate = 0,
  lateDays = 0,
  penaltyMultiplier = 1,
  fixedFee = 0
}) {
  const rate = toNumber(dailyRate, 0);
  const days = Math.max(toNumber(lateDays, 0), 0);
  const multiplier = Math.max(toNumber(penaltyMultiplier, 1), 0);
  const fee = Math.max(toNumber(fixedFee, 0), 0);

  return {
    lateDays: days,
    dailyPenalty: rate * multiplier,
    fixedFee: fee,
    totalLateFee: days * rate * multiplier + fee
  };
}

export function getAvailableStockLabel(stock = 0) {
  if (stock <= 0) return 'Habis';
  if (stock <= 3) return 'Stok terbatas';
  return 'Tersedia';
}

export function summarizeOrder(order = {}) {
  const {
    customerName = 'Customer',
    productName = 'Produk',
    totalAmount = 0,
    status = 'pending',
    durationDays = 1,
    depositAmount = 0
  } = order;

  return {
    customerName,
    productName,
    totalAmount: toNumber(totalAmount, 0),
    status: String(status).toLowerCase(),
    durationDays: toNumber(durationDays, 1),
    depositAmount: toNumber(depositAmount, 0),
    remainingBalance: Math.max(toNumber(totalAmount, 0) - toNumber(depositAmount, 0), 0)
  };
}

export function filterOrdersByStatus(orders = [], status = 'all') {
  if (!Array.isArray(orders)) return [];

  if (!status || String(status).toLowerCase() === 'all') {
    return orders;
  }

  return orders.filter((order) => {
    const itemStatus = String(order?.status ?? '').toLowerCase();
    return itemStatus === String(status).toLowerCase();
  });
}

const helpers = {
  toNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  slugify,
  formatPhoneNumber,
  generateReceiptNumber,
  buildReceiptPayload,
  createReceiptText,
  calculateRentalTotal,
  getRentalStatusLabel,
  validateRentalForm,
  calculateLateFee,
  getAvailableStockLabel,
  summarizeOrder,
  filterOrdersByStatus
};

export default helpers;
