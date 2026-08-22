'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E5E5] py-3.5 shadow-sm text-[#111111]'
            : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent py-4 sm:py-5 text-[#FFFFFF]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a href="#home" className="flex items-center gap-3 group" onClick={close}>
            <img
              src="/assets/logo.png"
              alt="BMY Collection & Kaftan"
              className="h-9 sm:h-10 w-auto max-h-11 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className={`font-heading text-base sm:text-lg font-bold tracking-tight uppercase leading-tight ${scrolled ? 'text-[#111111]' : 'text-[#FFFFFF]'}`}>
                BMY Collection &amp; Kaftan
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-8 text-xs font-mono tracking-widest uppercase ${scrolled ? 'text-[#2F2F2F]' : 'text-white/90'}`}>
            <a href="#collection" className="hover:text-[#FFCB74] transition-colors">
              Collection
            </a>
            <a href="#about" className="hover:text-[#FFCB74] transition-colors">
              About
            </a>
            <a href="#services" className="hover:text-[#FFCB74] transition-colors">
              Services
            </a>
            <a href="#contact" className="hover:text-[#FFCB74] transition-colors">
              Contact
            </a>
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Store</span>
            </Link>
          </nav>

          {/* Mobile Right Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setOpen((o) => !o)}
              className={`p-2 rounded-xl border transition-colors ${
                scrolled
                  ? 'border-[#E5E5E5] bg-[#F6F6F6] text-[#111111] hover:bg-[#EEEEEE]'
                  : 'border-white/20 bg-white/10 text-white hover:text-[#FFCB74]'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Backdrop & Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 z-40 w-[85vw] max-w-sm bg-[#FFFFFF] text-[#111111] border-l border-[#E5E5E5] p-6 pt-24 flex flex-col justify-between transition-transform duration-300 ease-out lg:hidden shadow-2xl ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation Menu"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
            <img src="/assets/logo.png" alt="BMY Logo" className="h-8 w-auto" />
            <div>
              <p className="font-heading text-base font-bold text-[#111111]">
                BMY Atelier
              </p>
              <p className="font-mono text-[10px] text-[#6F6F6F] uppercase">
                Gombe, Nigeria
              </p>
            </div>
          </div>

          <nav className="space-y-3 font-heading text-lg font-medium">
            <a
              href="#home"
              onClick={close}
              className="block py-2 text-[#2F2F2F] hover:text-[#111111] transition-colors border-b border-[#F6F6F6]"
            >
              Home Showcase
            </a>
            <a
              href="#collection"
              onClick={close}
              className="block py-2 text-[#2F2F2F] hover:text-[#111111] transition-colors border-b border-[#F6F6F6]"
            >
              The Collection
            </a>
            <a
              href="#about"
              onClick={close}
              className="block py-2 text-[#2F2F2F] hover:text-[#111111] transition-colors border-b border-[#F6F6F6]"
            >
              Atelier Story
            </a>
            <a
              href="#services"
              onClick={close}
              className="block py-2 text-[#2F2F2F] hover:text-[#111111] transition-colors border-b border-[#F6F6F6]"
            >
              Services &amp; Pricing
            </a>
            <a
              href="#contact"
              onClick={close}
              className="block py-2 text-[#2F2F2F] hover:text-[#111111] transition-colors border-b border-[#F6F6F6]"
            >
              Contact &amp; Studio
            </a>
          </nav>

          <div className="pt-2">
            <Link
              href="/shop"
              onClick={close}
              className="w-full py-3.5 rounded-xl bg-[#FFCB74] hover:bg-[#E6B35C] text-[#111111] font-heading text-xs uppercase tracking-widest font-bold shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Online Store</span>
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E5E5E5] space-y-1.5 text-center text-xs font-mono text-[#6F6F6F]">
          <p>Hotline: +234 814 333 9349</p>
          <p>© {new Date().getFullYear()} BMY Collection &amp; Kaftan</p>
        </div>
      </aside>
    </>
  );
}
