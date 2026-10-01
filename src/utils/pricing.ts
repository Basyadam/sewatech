import { Product, RentalPriceTier } from '../types';

export const LAPTOP_PRICELIST_STANDARD: RentalPriceTier = {
  harian: 175000,       // 175k/hari
  tigaHariPlus: 160000, // 160k/hari
  mingguan: 875000,     // 875k (125k/hari)
  bulanan: 2400000      // 2400k (80k/hari)
};

export const LAPTOP_PRICELIST_RAM16: RentalPriceTier = {
  harian: 200000,       // 200k/hari
  tigaHariPlus: 175000, // 175k/hari
  mingguan: 975000,     // 975k
  bulanan: 2700000      // 2700k (90k/hari)
};

export function getProductRentalTier(product: Product): RentalPriceTier | null {
  if (product.rentalPriceTier) {
    return product.rentalPriceTier;
  }

  const isLaptop = product.category === 'laptop-windows' || product.category === 'laptop-mac';
  if (!isLaptop) return null;

  const isRam16OrMore =
    product.ramSpec === '16GB' ||
    product.ramSpec === '32GB' ||
    product.ramSpec === '48GB' ||
    product.name.toLowerCase().includes('ram 16') ||
    product.name.toLowerCase().includes('16gb') ||
    product.headline.toLowerCase().includes('16gb') ||
    product.specs.some(s => s.value.toLowerCase().includes('16gb') || s.value.toLowerCase().includes('32gb'));

  return isRam16OrMore ? LAPTOP_PRICELIST_RAM16 : LAPTOP_PRICELIST_STANDARD;
}

export interface RentalCostCalculation {
  totalFee: number;
  effectiveDailyRate: number;
  appliedTierName: string;
  tierDescription: string;
  savings: number;
  tier: RentalPriceTier | null;
}

/**
 * Calculates rental cost following user's exact pricelist specification:
 * Laptop Standar (RAM 8GB):
 * - Harian : 175k
 * - 3 Hari+ : 160k/hari
 * - Mingguan : 875k (125k/hari)
 * - Bulanan : 2400k (80k/hari)
 *
 * Laptop (RAM 16GB):
 * - Harian : 200k
 * - 3 Hari+ : 175k/hari
 * - Mingguan : 975k
 * - Bulanan : 2700k (90k/hari)
 */
export function calculateRentalCost(product: Product, days: number): RentalCostCalculation {
  const safeDays = Math.max(1, Math.round(days));
  const tier = getProductRentalTier(product);

  if (!tier) {
    // Non-laptop: standard daily rate
    const totalFee = product.dailyRate * safeDays;
    return {
      totalFee,
      effectiveDailyRate: product.dailyRate,
      appliedTierName: safeDays >= 30 ? 'Bulanan' : safeDays >= 7 ? 'Mingguan' : safeDays >= 3 ? '3 Hari+' : 'Harian',
      tierDescription: `Rp ${product.dailyRate.toLocaleString('id-ID')} / hari`,
      savings: 0,
      tier: null
    };
  }

  let totalFee = 0;
  let appliedTierName = 'Harian';
  let tierDescription = '';

  if (safeDays >= 30) {
    appliedTierName = 'Bulanan (30 Hari+)';
    const months = Math.floor(safeDays / 30);
    const remainingDays = safeDays % 30;
    const dailyEquivalent = Math.round(tier.bulanan / 30); // 80k or 90k
    totalFee = (months * tier.bulanan) + (remainingDays * dailyEquivalent);
    tierDescription = `Paket Bulanan Rp ${tier.bulanan.toLocaleString('id-ID')} (${(dailyEquivalent / 1000)}k/hari)`;
  } else if (safeDays >= 7) {
    appliedTierName = 'Mingguan (7 Hari+)';
    const weeks = Math.floor(safeDays / 7);
    const remainingDays = safeDays % 7;
    const dailyEquivalent = Math.round(tier.mingguan / 7);
    totalFee = (weeks * tier.mingguan) + (remainingDays * dailyEquivalent);
    tierDescription = `Paket Mingguan Rp ${tier.mingguan.toLocaleString('id-ID')}`;
  } else if (safeDays >= 3) {
    appliedTierName = '3 Hari+';
    totalFee = safeDays * tier.tigaHariPlus;
    tierDescription = `Tarif Diskon Rp ${tier.tigaHariPlus.toLocaleString('id-ID')} / hari`;
  } else {
    appliedTierName = 'Harian (1-2 Hari)';
    totalFee = safeDays * tier.harian;
    tierDescription = `Tarif Normal Rp ${tier.harian.toLocaleString('id-ID')} / hari`;
  }

  const baselineFee = safeDays * tier.harian;
  const savings = Math.max(0, baselineFee - totalFee);
  const effectiveDailyRate = Math.round(totalFee / safeDays);

  return {
    totalFee,
    effectiveDailyRate,
    appliedTierName,
    tierDescription,
    savings,
    tier
  };
}
