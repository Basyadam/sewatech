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

const helpers = {
  toNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  slugify,
  formatPhoneNumber,
  generateReceiptNumber,
  buildReceiptPayload,
  createReceiptText
};

export default helpers;
