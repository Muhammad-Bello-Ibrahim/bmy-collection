'use client';

import { Sparkles, CheckCircle2 } from 'lucide-react';

const FABRICS = [
  'Shadda Weave',
  'Guinea Brocade',
  'Atiku Fabric',
  'Cashmere Wool',
  'Gold Embroidery',
  'Damask Cloth',
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-32 bg-[#FFFFFF]">
      <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Minimalist Showroom Photo Frame */}
          <div className="lg:col-span-5 reveal">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-[#E5E5E5] bg-[#F6F6F6] group">
              <img
                src="/images/hwm.jpg"
                alt="BMY Atelier Tailoring & Heritage"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/images/hmw2.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 backdrop-blur-md bg-[#111111]/90 text-white border border-white/15 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div>
                  <p className="font-heading text-sm sm:text-base font-bold text-[#FFFFFF] tracking-tight">Gombe Atelier Headquarters</p>
                  <p className="font-mono text-[10px] sm:text-[11px] text-[#FFCB74] uppercase tracking-wider font-semibold">Handcrafted Menswear · Bespoke &amp; RTW</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#FFCB74] shadow-sm animate-pulse shrink-0 ml-3" />
              </div>
            </div>
          </div>

          {/* Right: Editorial Story Copy */}
          <div className="lg:col-span-7 space-y-6 reveal text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono text-[#111111] uppercase tracking-wider font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" /> The Atelier Heritage
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-[#111111] leading-[1.12] tracking-tight">
              Where heritage meets modern tailoring.
            </h2>

            <p className="font-heading text-lg sm:text-xl text-[#2F2F2F] italic font-medium leading-relaxed border-l-2 border-[#FFCB74] pl-4">
              &ldquo;A caftan is not simply worn. It is a record of where you come from, cut fresh for how you live now.&rdquo;
            </p>

            <p className="text-[#4B5563] text-sm sm:text-base font-body leading-relaxed font-normal">
              <strong className="text-[#111111] font-semibold">BMY Collection &amp; Kaftan</strong> creates one-of-a-kind bespoke and ready-to-wear pieces from Gombe, pairing heritage shadda, brocade, and atiku with modern tailored silhouettes. Every seam is cut with precision, measured to the millimeter, and finished by master artisans.
            </p>

            {/* Fabric Pills */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6F6F6F] block mb-2.5 font-semibold">
                Signature Fabric Library:
              </span>
              <div className="flex flex-wrap gap-2">
                {FABRICS.map((f) => (
                  <span
                    key={f}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F6F6F6] border border-[#E5E5E5] text-[#2F2F2F] text-xs font-mono tracking-wide shadow-sm hover:border-[#111111] hover:text-[#111111] transition-colors"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
