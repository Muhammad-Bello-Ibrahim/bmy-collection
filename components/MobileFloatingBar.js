'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, PhoneCall, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/shop-data';

export default function MobileFloatingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 inset-x-4 max-w-xs mx-auto z-40 lg:hidden animate-fade-in">
      <div className="bg-[#111111]/95 backdrop-blur-xl border border-[#2F2F2F] rounded-2xl p-1.5 shadow-2xl flex items-center justify-between gap-1.5">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello BMY Collection & Kaftan, I would like to make an enquiry.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl bg-[#2F2F2F] hover:bg-[#3D3D3D] text-[#FFCB74] flex items-center justify-center transition-colors shrink-0"
          title="WhatsApp Concierge"
          aria-label="WhatsApp Concierge"
        >
          <PhoneCall className="w-3.5 h-3.5" />
        </a>

        <Link
          href="/shop"
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-[11px] uppercase tracking-wider font-bold shadow flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Shop Atelier</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>
    </div>
  );
}
