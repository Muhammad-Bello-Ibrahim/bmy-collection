'use client';

import Link from 'next/link';
import { PhoneCall, ShoppingBag, Users, Sparkles } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/shop-data';

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-32 bg-[#FFFFFF]">
      <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-head reveal mb-12 sm:mb-16 max-w-xl text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F6F6] border border-[#E5E5E5] text-[11px] font-mono text-[#111111] uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" /> Services &amp; Process
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] font-bold leading-tight mt-3">
            Three ways to commission.
          </h2>
          <p className="text-[#6F6F6F] text-sm sm:text-base font-body mt-2">
            Bespoke creations, ready-to-wear pieces, and wedding entourage orders.
          </p>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="services-grid reveal grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Bespoke */}
          <div className="service-card bg-[#F6F6F6] border border-[#E5E5E5] rounded-2xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all text-left">
            <div className="space-y-3">
              <span className="num font-mono text-xs text-[#111111] tracking-widest block uppercase font-bold">
                № 01
              </span>
              <h3 className="font-heading text-2xl text-[#111111] font-bold">
                Bespoke
              </h3>
              <p className="meta font-mono text-xs text-[#6F6F6F] uppercase tracking-wider font-semibold">
                4–6 weeks · 2–3 fittings
              </p>
              <p className="text-[#6F6F6F] text-xs sm:text-sm font-body leading-relaxed">
                A one-of-one garment tailored to your exact measurements, fabric, and embroidery choice.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="price font-mono text-xs text-[#111111] uppercase tracking-wider font-bold">
                  Price on request
                </span>
                <span className="text-[10px] font-mono text-[#111111] bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-0.5 rounded font-bold">
                  Custom Fit
                </span>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello BMY Collection & Kaftan, I would like to book a bespoke consultation.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#111111] hover:text-[#FFFFFF] border border-[#E5E5E5] text-[#111111] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Enquire Bespoke</span>
              </a>
            </div>
          </div>

          {/* Card 2: Ready-to-Wear */}
          <div className="service-card bg-[#F6F6F6] border border-[#E5E5E5] rounded-2xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all text-left">
            <div className="space-y-3">
              <span className="num font-mono text-xs text-[#111111] tracking-widest block uppercase font-bold">
                № 02
              </span>
              <h3 className="font-heading text-2xl text-[#111111] font-bold">
                Ready-to-Wear
              </h3>
              <p className="meta font-mono text-xs text-[#6F6F6F] uppercase tracking-wider font-semibold">
                Available now · Instant dispatch
              </p>
              <p className="text-[#6F6F6F] text-xs sm:text-sm font-body leading-relaxed">
                Curated caftans, waists, trousers, and footwear — finished and ready for dispatch.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="price font-mono text-xs text-[#111111] uppercase tracking-wider font-bold">
                  From ₦18,000
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  In Stock
                </span>
              </div>
              <Link
                href="/shop"
                className="w-full py-3 rounded-xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Online Store</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Group & Family */}
          <div className="service-card bg-[#F6F6F6] border border-[#E5E5E5] rounded-2xl p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all text-left">
            <div className="space-y-3">
              <span className="num font-mono text-xs text-[#111111] tracking-widest block uppercase font-bold">
                № 03
              </span>
              <h3 className="font-heading text-2xl text-[#111111] font-bold">
                Group &amp; Aṣọ-ẹbí
              </h3>
              <p className="meta font-mono text-xs text-[#6F6F6F] uppercase tracking-wider font-semibold">
                6–8 weeks · Coordinated fittings
              </p>
              <p className="text-[#6F6F6F] text-xs sm:text-sm font-body leading-relaxed">
                Coordinated fabrics across grooms, groomsmen, and family for weddings and ceremonies.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="price font-mono text-xs text-[#111111] uppercase tracking-wider font-bold">
                  Quoted by Group Size
                </span>
                <span className="text-[10px] font-mono text-[#111111] bg-[#FFFFFF] border border-[#E5E5E5] px-2 py-0.5 rounded font-bold">
                  Weddings
                </span>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello BMY Collection & Kaftan, I want to request a quote for a group/family wedding package.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#111111] hover:text-[#FFFFFF] border border-[#E5E5E5] text-[#111111] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Request Group Quote</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Process Steps Grid */}
        <div className="process-grid reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-16 sm:mt-24 pt-12 border-t border-[#E5E5E5] text-left">
          <div className="process-step space-y-1.5 p-5 rounded-2xl bg-[#F6F6F6] border border-[#E5E5E5]">
            <span className="num font-mono text-sm text-[#111111] font-bold block">01</span>
            <h4 className="font-heading text-base text-[#111111] font-bold">Consultation</h4>
            <p className="text-xs text-[#6F6F6F] font-body leading-relaxed">Brief &amp; sketches in Gombe studio or WhatsApp.</p>
          </div>
          <div className="process-step space-y-1.5 p-5 rounded-2xl bg-[#F6F6F6] border border-[#E5E5E5]">
            <span className="num font-mono text-sm text-[#111111] font-bold block">02</span>
            <h4 className="font-heading text-base text-[#111111] font-bold">Fabric Library</h4>
            <p className="text-xs text-[#6F6F6F] font-body leading-relaxed">Shadda, brocade, or atiku selection.</p>
          </div>
          <div className="process-step space-y-1.5 p-5 rounded-2xl bg-[#F6F6F6] border border-[#E5E5E5]">
            <span className="num font-mono text-sm text-[#111111] font-bold block">03</span>
            <h4 className="font-heading text-base text-[#111111] font-bold">Fittings</h4>
            <p className="text-xs text-[#6F6F6F] font-body leading-relaxed">2–3 sessions calibrated to your event.</p>
          </div>
          <div className="process-step space-y-1.5 p-5 rounded-2xl bg-[#F6F6F6] border border-[#E5E5E5]">
            <span className="num font-mono text-sm text-[#111111] font-bold block">04</span>
            <h4 className="font-heading text-base text-[#111111] font-bold">Delivery</h4>
            <p className="text-xs text-[#6F6F6F] font-body leading-relaxed">Studio pickup or worldwide delivery.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
