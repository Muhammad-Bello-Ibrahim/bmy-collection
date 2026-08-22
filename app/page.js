import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import Showcase from '@/components/Showcase';
import About from '@/components/About';
import CollectionMarquee from '@/components/CollectionMarquee';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import SiteFooter from '@/components/SiteFooter';
import BackTop from '@/components/BackTop';
import MobileFloatingBar from '@/components/MobileFloatingBar';

export default function Home() {
  return (
    <div className="bg-[#F6F6F6] text-[#111111] font-body selection:bg-[#FFCB74] selection:text-[#111111]">
      <SiteHeader />

      <Hero />

      <Showcase />

      <About />

      {/* Collection Section */}
      <section className="py-20 sm:py-32 bg-[#F6F6F6] border-t border-[#E5E5E5]" id="collection">
        <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-head reveal mb-10 max-w-2xl text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono text-[#111111] uppercase tracking-wider font-bold shadow-sm">
              <span>✦</span>
              <span>The Wardrobe Collection</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#111111] font-bold leading-tight tracking-tight">
              Pieces from the atelier.
            </h2>
            <p className="text-[#4B5563] text-sm sm:text-base font-body leading-relaxed max-w-xl">
              Ceremonial agbadas, bespoke caftans, authentic yardage fabrics, and luxury accessories — handcrafted with precision.
            </p>
          </div>
        </div>

        <CollectionMarquee />

        <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
          <Link
            href="/shop"
            className="px-8 py-4 rounded-2xl bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-widest font-bold shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFCB74]" />
            <span>Shop Full Catalog</span>
          </Link>
          <a
            href="#services"
            className="px-8 py-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#F6F6F6] border border-[#E5E5E5] text-[#111111] font-heading text-xs uppercase tracking-widest font-bold shadow-sm transition-all text-center"
          >
            Services &amp; Pricing
          </a>
        </div>
      </section>

      <Services />

      <Contact />

      <SiteFooter />
      <BackTop />
      <MobileFloatingBar />
    </div>
  );
}
