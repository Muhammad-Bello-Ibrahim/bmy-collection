'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronDown, Sparkles, Scissors, Globe } from 'lucide-react';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="hero relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center overflow-hidden" id="home">
      {/* Video Background */}
      <div className="hero-media" aria-hidden="true">
        <div className="hero-fallback">
          <div className="drift d1"></div>
          <div className="drift d2"></div>
        </div>
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero1.jpg"
          src="/images/hero-vid.mp4"
        >
          <source src="/images/hero-vid.mp4" type="video/mp4" />
        </video>
        <div className="hero-grain"></div>
        <div className="hero-vignette"></div>
      </div>

      {/* Main Content */}
      <div className="wrap hero-inner reveal in relative z-10 pt-24 sm:pt-28 pb-16 sm:pb-20 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/85 backdrop-blur-md border border-white/15 text-[#FFCB74] text-xs font-mono tracking-widest uppercase mb-5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke &amp; Ready-to-Wear · Gombe</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] text-white tracking-tight mb-6">
          Cut with care, <em className="text-[#FFCB74] italic font-normal">worn with pride.</em>
        </h1>

        <p className="lede text-white/90 text-sm sm:text-base lg:text-lg font-body font-normal leading-relaxed max-w-xl mb-8">
          Bespoke caftans, ceremonial agbadas, and luxury menswear — hand-tailored to perfection in Gombe.
        </p>

        {/* CTAs */}
        <div className="hero-ctas flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-8">
          <Link
            href="/shop"
            className="px-8 py-4 rounded-2xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-xs uppercase tracking-widest font-bold shadow-xl shadow-[#FFCB74]/25 text-center flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Online Store</span>
          </Link>
          <a
            href="#collection"
            className="px-8 py-4 rounded-2xl border border-white/30 hover:border-[#FFCB74] hover:bg-white/10 text-white hover:text-[#FFCB74] font-heading text-xs uppercase tracking-widest font-bold transition-all text-center backdrop-blur-md"
          >
            Explore Wardrobe
          </a>
        </div>

        {/* Trust Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-4 border-t border-white/20 text-[11px] font-mono text-white/90 max-w-xl">
          <div className="flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5 text-[#FFCB74] shrink-0" />
            <span>Master Tailored Fit</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#FFCB74] shrink-0" />
            <span>Global Delivery</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 col-span-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCB74] shrink-0" />
            <span>Pure Heritage Weaves</span>
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <a href="#collection" className="scroll-cue hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-[#FFCB74] transition-colors z-10">
        <span className="arrow animate-bounce"><ChevronDown className="w-4 h-4" /></span>
        <span>Scroll down</span>
      </a>
    </section>
  );
}
