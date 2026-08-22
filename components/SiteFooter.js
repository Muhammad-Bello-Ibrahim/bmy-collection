'use client';

import Link from 'next/link';
import { PhoneCall } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/shop-data';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#2F2F2F] bg-[#111111] text-[#FFFFFF] pt-16 pb-24 sm:pb-16 text-left">
      <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
          {/* Col 1: Brand Info */}
          <div className="foot-brand space-y-4">
            <img
              src="/assets/logo.png"
              alt="BMY Collection & Kaftan"
              className="h-10 w-auto object-contain"
            />
            <div>
              <span className="font-heading text-xl font-bold uppercase tracking-wider block text-[#FFFFFF]">
                BMY Collection &amp; Kaftan
              </span>
              <p className="font-mono text-xs text-[#FFCB74] mt-1 font-semibold">
                Menswear Atelier · Gombe, Nigeria
              </p>
            </div>
            <p className="text-xs text-[#A0A0A0] font-body leading-relaxed max-w-xs">
              Every caftan, agbada, and accessory is tailored by hand with heritage Nigerian textile artistry.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="foot-col space-y-3">
            <h5 className="font-heading text-xs uppercase tracking-widest text-[#FFCB74] font-bold">
              Navigation
            </h5>
            <div className="flex flex-col space-y-2 text-xs font-mono text-[#A0A0A0]">
              <a href="#home" className="hover:text-[#FFFFFF] transition-colors">Home Showcase</a>
              <a href="#collection" className="hover:text-[#FFFFFF] transition-colors">The Collection</a>
              <a href="#about" className="hover:text-[#FFFFFF] transition-colors">Atelier Story</a>
              <a href="#services" className="hover:text-[#FFFFFF] transition-colors">Services &amp; Pricing</a>
              <Link href="/shop" className="text-[#FFCB74] hover:underline flex items-center gap-1 font-bold">
                <span>E-Commerce Store</span>
                <span>→</span>
              </Link>
              <Link href="/admin" className="text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors">
                Admin Console
              </Link>
            </div>
          </div>

          {/* Col 3: Studio Hours */}
          <div className="foot-col space-y-3">
            <h5 className="font-heading text-xs uppercase tracking-widest text-[#FFCB74] font-bold">
              Gombe Studio
            </h5>
            <div className="space-y-1.5 text-xs text-[#A0A0A0] font-body">
              <p className="text-[#FFFFFF] font-medium">Gombe Central, Gombe State</p>
              <p>Nigeria</p>
              <p className="text-[#6F6F6F] pt-1">Mon – Sat: 9:00 AM – 7:00 PM</p>
              <p className="text-[#FFCB74] text-xs font-mono pt-1 font-semibold">By appointment for bespoke fittings</p>
            </div>
          </div>

          {/* Col 4: Connect */}
          <div className="foot-col space-y-3">
            <h5 className="font-heading text-xs uppercase tracking-widest text-[#FFCB74] font-bold">
              Connect &amp; Social
            </h5>
            <div className="flex flex-col space-y-2 text-xs font-mono text-[#A0A0A0]">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFCB74] transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#FFCB74]" />
                <span>WhatsApp Hotline</span>
              </a>
              <a
                href="https://www.instagram.com/bmy_collection_/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFCB74] transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-[#FFCB74]"><use href="#ic-ig" /></svg>
                <span>Instagram (@bmy_collection_)</span>
              </a>
              <a
                href="https://www.tiktok.com/@bmycollection"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFCB74] transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-[#FFCB74]"><use href="#ic-tiktok" /></svg>
                <span>TikTok (@bmycollection)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="foot-bottom pt-8 border-t border-[#2F2F2F] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#A0A0A0]">
          <p>© {new Date().getFullYear()} BMY Collection &amp; Kaftan. Every piece finished by hand.</p>
          <p className="text-[#FFCB74]">Crafted in Gombe, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
