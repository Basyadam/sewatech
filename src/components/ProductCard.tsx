import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Sparkles, Check, AlertCircle, Eye, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, setRentingProduct, currentUser, setIsKtpModalOpen } = useApp();
  const [imageError, setImageError] = useState(false);

  const categoryNameMap: Record<Product['category'], string> = {
    'laptop-windows': 'Laptop Windows',
    'laptop-mac': 'Apple MacBook'
  };

  const handleStartRental = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRentingProduct(product);
    if (!currentUser) {
      // Must register/verify identity before booking
      setIsKtpModalOpen(true);
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <article
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs"
    >
      {/* Visual Asset Container (4:3 ratio) */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-stone-100 text-stone-400">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              {product.category}
            </span>
            <span className="text-sm font-semibold text-stone-700 text-center mt-1">
              {product.name}
            </span>
          </div>
        )}

        {/* Quiet availability tag */}
        <div className="absolute top-3 left-3">
          {product.availableStock > 0 ? (
            <span className="text-[11px] font-semibold bg-white/95 backdrop-blur-md text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-md shadow-xs">
              Ready ({product.availableStock} Unit)
            </span>
          ) : (
            <span className="text-[11px] font-semibold bg-white/95 backdrop-blur-md text-rose-700 border border-rose-200/80 px-2.5 py-0.5 rounded-md shadow-xs">
              Sedang Disewa
            </span>
          )}
        </div>

        {/* Condition kicker */}
        <div className="absolute top-3 right-3 text-[11px] font-mono font-medium text-stone-600 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-stone-200 shadow-xs">
          {product.condition}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider text-[10px] text-cyan-800 font-bold">
              {categoryNameMap[product.category]}
            </span>
            {product.subCategory && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="truncate text-stone-500">{product.subCategory}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-stone-900 group-hover:text-cyan-800 transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.ramSpec && (
              <span className="shrink-0 text-[10px] font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-1.5 py-0.5 rounded">
                RAM {product.ramSpec}
              </span>
            )}
          </div>

          {/* Key Specs snippet */}
          <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.headline}
          </p>
        </div>

        {/* Specs Highlights */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
          {product.specs.slice(0, 2).map((spec, idx) => (
            <div key={idx} className="truncate">
              <span className="text-stone-400 block text-[10px] uppercase font-medium">{spec.label}</span>
              <span className="font-semibold text-stone-700 truncate block">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] text-stone-400 font-medium">Tarif Sewa Harian</div>
            <div className="text-lg font-bold font-mono text-stone-900 tabular-nums">
              Rp {product.dailyRate.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-stone-500 font-sans"> /hari</span>
            </div>
            {product.rentalPriceTier ? (
              <div className="text-[10px] font-mono text-cyan-800 font-semibold mt-0.5">
                Mgg: Rp {(product.rentalPriceTier.mingguan / 1000)}k · Bln: Rp {(product.rentalPriceTier.bulanan / 1000)}k
              </div>
            ) : (
              <div className="text-[10px] text-stone-500 tabular-nums">
                Deposit: Rp {product.depositAmount.toLocaleString('id-ID')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleStartRental}
              disabled={product.availableStock === 0}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
                product.availableStock > 0
                  ? 'bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              }`}
            >
              <span>{product.availableStock > 0 ? 'Sewa Unit' : 'Penuh'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
