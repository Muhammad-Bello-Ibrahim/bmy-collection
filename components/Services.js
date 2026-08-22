'use client';

import Link from 'next/link';
import { PhoneCall, ShoppingBag, Users, Sparkles } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/shop-data';

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-32 bg-[#FFFFFF]">
      <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-head reveal mb-12 sm:mb-16 max-w-2xl text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F6F6] border border-[#E5E5E5] text-xs font-mono text-[#111111] uppercase tracking-wider font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" />
            <span>Services &amp; Process</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#111111] font-bold leading-tight tracking-tight">
            Three ways to commission.
          </h2>
          <p className="text-[#4B5563] text-sm sm:text-base font-body leading-relaxed max-w-xl">
            Bespoke ceremonial agbadas, ready-to-wear caftans, and coordinated wedding entourage packages.
          </p>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="services-grid reveal grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Bespoke */}
          <div className="service-card bg-[#F9F9F9] border border-[#E5E5E5] rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:border-[#111111] transition-all text-left group">
            <div className="space-y-3.5">
              <span className="num font-mono text-xs text-[#111111] tracking-widest block uppercase font-bold">
                № 01
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-[#111111] font-bold tracking-tight">
                Bespoke
              </h3>
              <p className="meta font-mono text-xs text-[#2F2F2F] uppercase tracking-wider font-semibold">
                4–6 weeks · 2–3 fittings
              </p>
              <p className="text-[#4B5563] text-xs sm:text-sm font-body leading-relaxed">
                A one-of-one garment tailored to your exact measurements, fabric selection, and custom embroidery patterns.
              </p>
            </div>

            <div className="pt-5 border-t border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="price font-mono text-xs text-[#111111] uppercase tracking-wider font-bold">
                  Price on request
                </span>
                <span className="text-[10px] font-mono text-[#111111] bg-[#FFFFFF] border border-[#E5E5E5] px-2.5 py-0.5 rounded-md font-bold uppercase">
                  Custom Fit
                </span>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello BMY Collection & Kaftan, I would like to book a bespoke consultation.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#111111] hover:text-[#FFFFFF] border border-[#E5E5E5] text-[#111111] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Enquire Bespoke</span>
              </a>
            </div>
          </div>

          {/* Card 2: Ready-to-Wear */}
          <div className="service-card bg-[#FFFFFF] border-2 border-[#111111] rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-lg hover:shadow-2xl transition-all text-left relative group">
            <span className="absolute -top-3 right-6 bg-[#FFCB74] text-[#111111] text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              Popular Choice
            </span>
            <div className="space-y-3.5">
              <span className="num font-mono text-xs text-[#111111] tracking-widest block uppercase font-bold">
                № 02
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-[#111111] font-bold tracking-tight">
                Ready-to-Wear
              </h3>
              <p className="meta font-mono text-xs text-[#2F2F2F] uppercase tracking-wider font-semibold">
                Available now · Instant dispatch
              </p>
              <p className="text-[#4B5563] text-xs sm:text-sm font-body leading-relaxed">
                Curated pre-finished caftans, tailored vests, trousers, footwear, and accessories — cut and ready to take home.
              </p>
            </div>

            <div className="pt-5 border-t border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="price font-mono text-xs text-[#111111] uppercase tracking-wider font-bold">
                  From ₦18,000
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-md font-bold uppercase">
                  ● In Stock
                </span>
              </div>
              <Link
                href="/shop"
                className="w-full py-3.5 rounded-2xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Online Store</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Group & Family */}
          <div className="service-card bg-[#F9F9F9] border border-[#E5E5E5] rounded-3xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:border-[#111111] transition-all text-left group">
            <div className="space-y-3.5">
              <span className="num font-mono text-xs text-[#111111] tracking-widest block uppercase font-bold">
                № 03
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-[#111111] font-bold tracking-tight">
                Group &amp; Aṣọ-ẹbí
              </h3>
              <p className="meta font-mono text-xs text-[#2F2F2F] uppercase tracking-wider font-semibold">
                6–8 weeks · Coordinated fittings
              </p>
              <p className="text-[#4B5563] text-xs sm:text-sm font-body leading-relaxed">
                Coordinated premium fabrics and harmonious cuts across grooms, groomsmen, and family for weddings and cultural galas.
              </p>
            </div>

            <div className="pt-5 border-t border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="price font-mono text-xs text-[#111111] uppercase tracking-wider font-bold">
                  Quoted by Group Size
                </span>
                <span className="text-[10px] font-mono text-[#111111] bg-[#FFFFFF] border border-[#E5E5E5] px-2.5 py-0.5 rounded-md font-bold uppercase">
                  Weddings
                </span>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello BMY Collection & Kaftan, I want to request a quote for a group/family wedding package.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#111111] hover:text-[#FFFFFF] border border-[#E5E5E5] text-[#111111] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Request Group Quote</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Process Steps Grid */}
        <div className="process-grid reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-24 pt-12 border-t border-[#E5E5E5] text-left">
          <div className="process-step space-y-2 p-6 rounded-3xl bg-[#F9F9F9] border border-[#E5E5E5]">
            <span className="num font-mono text-base text-[#111111] font-bold block">01</span>
            <h4 className="font-heading text-base font-bold text-[#111111]">Consultation</h4>
            <p className="text-xs text-[#4B5563] font-body leading-relaxed">Brief &amp; design sketches in our Gombe studio or via WhatsApp concierge.</p>
          </div>
          <div className="process-step space-y-2 p-6 rounded-3xl bg-[#F9F9F9] border border-[#E5E5E5]">
            <span className="num font-mono text-base text-[#111111] font-bold block">02</span>
            <h4 className="font-heading text-base font-bold text-[#111111]">Fabric Selection</h4>
            <p className="text-xs text-[#4B5563] font-body leading-relaxed">Choose from our curated shadda, Guinea brocade, or Atiku yardage.</p>
          </div>
          <div className="process-step space-y-2 p-6 rounded-3xl bg-[#F9F9F9] border border-[#E5E5E5]">
            <span className="num font-mono text-base text-[#111111] font-bold block">03</span>
            <h4 className="font-heading text-base font-bold text-[#111111]">Precision Fittings</h4>
            <p className="text-xs text-[#4B5563] font-body leading-relaxed">2–3 fitting sessions calibrated to ensure flawless drape and posture.</p>
          </div>
          <div className="process-step space-y-2 p-6 rounded-3xl bg-[#F9F9F9] border border-[#E5E5E5]">
            <span className="num font-mono text-base text-[#111111] font-bold block">04</span>
            <h4 className="font-heading text-base font-bold text-[#111111]">Final Delivery</h4>
            <p className="text-xs text-[#4B5563] font-body leading-relaxed">Studio pickup or priority door-to-door delivery worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
