'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Signal, Wifi, Battery } from 'lucide-react';

export default function SplashScreen({ onStartShopping, autoFadeSeconds = 3.5 }) {
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50;
    const step = (interval / (autoFadeSeconds * 1000)) * 100;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          triggerDismiss();
          return 100;
        }
        return p + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoFadeSeconds]);

  const triggerDismiss = () => {
    setFading(true);
    setTimeout(() => {
      onStartShopping();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#f35c16] via-[#ea580c] to-[#c2410c] text-white transition-all duration-700 ease-out ${
        fading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      {/* Top Header: Mock Phone Status & Brandmark */}
      <div className="pt-5 px-6 sm:px-10 space-y-4 z-10">
        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-white/80 max-w-md mx-auto">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Brandmark */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <img
            src="/assets/logo.png"
            alt="BMY Collection & Kaftan"
            className="h-8 w-auto object-contain drop-shadow"
          />
          <span className="font-fraunces text-base sm:text-lg font-bold tracking-wider uppercase text-white drop-shadow">
            BMY Collection &amp; Kaftan
          </span>
        </div>
      </div>

      {/* Center Hero Portrait Frame */}
      <div className="relative flex-1 flex items-center justify-center px-6 max-w-sm sm:max-w-md mx-auto my-2 z-10">
        <div className="relative w-full aspect-[4/5] max-h-[46vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white/10">
          <img
            src="/products/476034.jpg"
            alt="BMY Collection Model"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Floating Tag */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl px-4 py-2 text-white">
            <span className="text-xs font-mono tracking-wider">Atelier Collection</span>
            <span className="text-[10px] font-mono uppercase bg-white text-[#f35c16] px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              2026 Edition
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Content & Action Buttons */}
      <div className="px-6 sm:px-10 pb-8 sm:pb-12 max-w-md mx-auto w-full space-y-6 z-10 text-left">
        <div className="space-y-2">
          <h1 className="font-fraunces text-3xl sm:text-4xl font-normal leading-[1.12] text-white tracking-tight">
            Explore the fashion you love, all in one place
          </h1>
          <p className="text-white/85 text-xs sm:text-sm font-light leading-relaxed">
            Find your favorite bespoke caftans, ceremonial agbadas, ready-to-wear pieces, and luxury weaves.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-1">
          <button
            onClick={triggerDismiss}
            className="w-full py-4 rounded-full bg-[#111827] hover:bg-black text-white font-mono text-xs uppercase tracking-widest font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={triggerDismiss}
            className="w-full text-center text-xs font-mono uppercase tracking-widest text-white/80 hover:text-white transition-colors py-1"
          >
            Explore Collection
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
