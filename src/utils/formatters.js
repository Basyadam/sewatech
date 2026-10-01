export function formatCurrency(value, options = {}) {
  const {
    locale = 'id-ID',
    currency = 'IDR',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    symbol = 'Rp'
  } = options;

  const numericValue = Number(value ?? 0);

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

export function formatCurrencyShort(value, options = {}) {
  const { locale = 'id-ID', currency = 'IDR' } = options;
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) return 'Rp 0';

  const compact = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(numericValue);

  return compact.replace(/IDR/gi, 'Rp').replace(/\s+/g, ' ').trim();
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
    totalAmount,
    notes,
    createdAt: new Date().toISOString()
  };
}

export default {
  formatCurrency,
  formatCurrencyShort,
  generateReceiptNumber,
  buildReceiptPayload
};
