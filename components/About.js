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
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#E5E5E5] bg-[#F6F6F6]">
              <img
                src="/images/showroom.webp"
                alt="BMY Atelier Showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-[#111111]/85 text-white border border-white/10 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-heading text-sm font-bold text-[#FFFFFF]">Gombe Atelier</p>
                  <p className="font-mono text-[10px] text-[#FFCB74] uppercase">Handcrafted Menswear</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFCB74] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right: Editorial Story Copy */}
          <div className="lg:col-span-7 space-y-6 reveal text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F6F6] border border-[#E5E5E5] text-[11px] font-mono text-[#111111] uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" /> The Atelier Heritage
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#111111] leading-tight">
              Where heritage meets the everyday.
            </h2>

            <p className="font-heading text-lg sm:text-xl text-[#2F2F2F] italic font-medium leading-relaxed">
              &ldquo;A caftan is not simply worn. It is a record of where you come from, cut fresh for how you live now.&rdquo;
            </p>

            <p className="text-[#6F6F6F] text-sm sm:text-base font-body leading-relaxed">
              <strong>BMY Collection &amp; Kaftan</strong> crafts bespoke and ready-to-wear pieces from Gombe, pairing heritage shadda, brocade, and atiku with modern tailored silhouettes.
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
