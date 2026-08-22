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
          <div className="section-head reveal mb-10 max-w-2xl text-left">
            <p className="eyebrow text-[#111111] font-mono text-xs uppercase tracking-widest font-bold">
              The Wardrobe Collection
            </p>
            <h2 className="font-heading text-3xl sm:text-5xl text-[#111111] font-bold leading-tight mt-3">
              Pieces from the atelier.
            </h2>
            <p className="text-[#6F6F6F] text-sm sm:text-base font-body mt-2">
              Ceremonial agbada, tailored caftans, and luxury accessories.
            </p>
          </div>
        </div>

        <CollectionMarquee />

        <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col sm:flex-row items-center justify-start gap-4">
          <Link
            href="/shop"
            className="px-8 py-4 rounded-xl bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-widest font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFCB74]" />
            <span>Shop Full Catalog</span>
          </Link>
          <a
            href="#services"
            className="px-7 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#F6F6F6] border border-[#E5E5E5] text-[#111111] font-heading text-xs uppercase tracking-widest font-semibold transition-all"
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
