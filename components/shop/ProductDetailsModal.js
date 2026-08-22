'use client';

import { useState } from 'react';
import { fmt, WHATSAPP_NUMBER } from '@/lib/shop-data';
import {
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  PhoneCall,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

const COLOR_OPTIONS = [
  { name: 'Obsidian Black', hex: '#111111' },
  { name: 'Raw Gold / Ochre', hex: '#FFCB74' },
  { name: 'Pure Ivory', hex: '#FFFFFF' },
  { name: 'Deep Indigo', hex: '#1E3A8A' },
  { name: 'Mineral Slate', hex: '#2F2F2F' },
];

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetailsModal({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onClose,
}) {
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'L'
  );
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  if (!product) return null;

  const availableSizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : DEFAULT_SIZES;

  const imgSrc = product.cloudinaryUrl || product.img || '/products/476025.jpg';

  // Build WhatsApp order link
  const buildWhatsAppMessage = () => {
    let msg = `✨ *BMY COLLECTION & KAFTAN — ORDER INQUIRY* ✨\n\n`;
    msg += `Hello BMY Atelier, I would like to order:\n`;
    msg += `• *Garment:* ${product.name}\n`;
    msg += `• *Size:* ${selectedSize}\n`;
    msg += `• *Color/Fabric:* ${selectedColor.name}\n`;
    msg += `• *Quantity:* ${qty}\n`;
    msg += `• *Price:* ${fmt(product.price)}\n\n`;
    msg += `Please confirm stock and provide delivery instructions. Thank you!`;
    return encodeURIComponent(msg);
  };

  const waOrderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in"
    >
      {/* Modal Card (#111111 dark surface with responsive rounded corners) */}
      <div className="relative w-full max-w-lg bg-[#111111] text-[#FFFFFF] rounded-t-3xl sm:rounded-3xl border border-[#2F2F2F] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Top Header */}
        <div className="px-5 sm:px-6 pt-4 sm:pt-5 pb-3.5 flex items-center justify-between bg-[#111111] border-b border-[#2F2F2F] sticky top-0 z-20">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#2F2F2F] hover:bg-[#3D3D3D] text-[#FFFFFF] flex items-center justify-center transition-colors border border-white/10"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="font-heading text-base font-bold tracking-tight text-[#FFFFFF]">
            Garment Details
          </span>

          <button
            onClick={() => onToggleWishlist(product.id, product.name)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
              isWishlisted
                ? 'bg-[#FFCB74] border-[#FFCB74] text-[#111111]'
                : 'bg-[#2F2F2F] border-white/10 text-[#A0A0A0] hover:text-[#FFCB74]'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#111111]' : ''}`} />
          </button>
        </div>

        {/* Product Showcase Viewport */}
        <div className="relative bg-[#181818] pt-4 pb-6 px-6 flex flex-col items-center justify-center border-b border-[#2F2F2F]">
          <div className="relative w-full max-w-[240px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-[#111111] border border-[#2F2F2F]">
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/products/476025.jpg';
              }}
            />
            {product.featured && (
              <span className="absolute top-3 left-3 bg-[#FFCB74] text-[#111111] text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow">
                Featured
              </span>
            )}
          </div>

          {/* Curved Accent Rotation Arc */}
          <div className="relative w-56 h-6 mt-2 flex items-center justify-center">
            <svg
              className="w-full h-full text-[#FFCB74]"
              viewBox="0 0 200 30"
              fill="none"
            >
              <path
                d="M 10,25 Q 100,2 190,25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute top-1/2 -translate-y-1/2 w-7 h-2 rounded-full bg-[#FFCB74] shadow-sm" />
          </div>

          {/* Angle Thumbnails */}
          <div className="flex items-center gap-2.5 mt-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveThumb(idx)}
                className={`w-11 h-13 rounded-xl overflow-hidden border-2 transition-all ${
                  activeThumb === idx
                    ? 'border-[#FFCB74] scale-105 shadow'
                    : 'border-[#2F2F2F] opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={imgSrc}
                  alt={`Angle ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-[#111111]">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFCB74] font-semibold block mb-0.5">
                {product.tag || 'Atelier Collection'}
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#FFFFFF] leading-tight">
                {product.name}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-xl font-bold text-[#FFCB74]">
                {fmt(product.price)}
              </span>
              {product.price !== null && (
                <span className="text-[10px] font-mono text-[#6F6F6F] block">
                  Tax inclusive
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#A0A0A0] font-body leading-relaxed">
            {product.desc ||
              'A signature piece tailored with heritage fabric weave, structured seams, and fine embroidery.'}
          </p>

          {/* Weave Detail Pill */}
          {product.mat && (
            <div className="p-3 rounded-xl bg-[#1C1C1C] border border-[#2F2F2F] text-xs text-[#E5E5E5] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FFCB74] shrink-0" />
              <span>
                <strong className="text-[#FFFFFF]">Weave Structure:</strong> {product.mat}
              </span>
            </div>
          )}

          {/* Color Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#A0A0A0] uppercase tracking-wider font-semibold">
                Color Tone:
              </span>
              <span className="text-[#FFFFFF]">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = selectedColor.name === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-[#111111] ring-[#FFCB74] scale-110 shadow-sm'
                        : 'border border-[#2F2F2F] hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          c.hex === '#FFFFFF' || c.hex === '#FFCB74' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#A0A0A0] uppercase tracking-wider font-semibold">
                Available Size:
              </span>
              <span className="text-[#FFFFFF]">Selected: {selectedSize}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {availableSizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 rounded-xl font-mono text-xs font-semibold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#FFCB74] text-[#111111] font-bold shadow-md scale-105'
                        : 'bg-[#2F2F2F] text-[#FFFFFF] hover:bg-[#3D3D3D] border border-white/10'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Stepper */}
          {product.price !== null && (
            <div className="flex items-center justify-between pt-2 border-t border-[#2F2F2F]">
              <span className="text-xs font-mono font-semibold uppercase text-[#A0A0A0]">
                Quantity:
              </span>
              <div className="flex items-center gap-3 bg-[#2F2F2F] rounded-xl px-3 py-1.5 border border-white/10">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-6 h-6 rounded-lg bg-[#111111] flex items-center justify-center text-[#FFFFFF] hover:bg-[#FFCB74] hover:text-[#111111] transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs font-bold w-4 text-center text-[#FFFFFF]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-6 h-6 rounded-lg bg-[#111111] flex items-center justify-center text-[#FFFFFF] hover:bg-[#FFCB74] hover:text-[#111111] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-5 bg-[#111111] border-t border-[#2F2F2F] space-y-2 sticky bottom-0 z-20">
          <div className="flex gap-2.5">
            <a
              href={waOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-xs uppercase tracking-widest font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{product.price === null ? 'Commission Piece' : 'Buy Now on WhatsApp'}</span>
            </a>

            {product.price !== null && (
              <button
                onClick={() => {
                  onAddToCart(product, qty, selectedSize);
                  onClose();
                }}
                disabled={!product.inStock || product.stock === 0}
                className="px-5 py-4 rounded-xl bg-[#2F2F2F] hover:bg-[#3D3D3D] text-[#FFFFFF] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center border border-white/10"
                title="Add to Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
