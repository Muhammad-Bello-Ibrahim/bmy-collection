'use client';

import { useRef, useState } from 'react';
import { PhoneCall, MapPin, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/shop-data';

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const name = formData.get('fname') || '';
    const phone = formData.get('fphone') || '';
    const interest = formData.get('finterest') || '';
    const msg = formData.get('fmsg') || '';

    let waText = `✨ *BMY ATELIER ENQUIRY* ✨\n\n`;
    waText += `*Name:* ${name}\n`;
    waText += `*Phone/WhatsApp:* ${phone}\n`;
    waText += `*Service Interest:* ${interest}\n`;
    if (msg) waText += `*Details:* ${msg}\n`;

    setStatus('Thank you — your enquiry has been sent. Opening WhatsApp consultation...');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
    formRef.current.reset();
  };

  return (
    <section id="contact" className="py-20 sm:py-32 bg-[#F6F6F6] border-t border-[#E5E5E5]">
      <div className="wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start text-left">
        {/* Left: Form */}
        <div className="contact-left reveal lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-xs font-mono text-[#111111] uppercase tracking-wider font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCB74]" />
            <span>Contact &amp; Commission</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#111111] font-bold leading-tight tracking-tight">
            Place your commission.
          </h2>

          <p className="lede text-[#4B5563] text-sm sm:text-base font-body leading-relaxed max-w-lg">
            Connect directly with our master tailors in Gombe for bespoke commissions, custom fits, and event inquiries.
          </p>

          <form ref={formRef} id="bespokeForm" onSubmit={onSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="fname" className="text-[11px] font-mono uppercase tracking-wider text-[#111111] block font-bold">
                  Full name *
                </label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="e.g. Bello Ibrahim"
                  required
                  className="w-full h-12 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] px-4 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111] transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="fphone" className="text-[11px] font-mono uppercase tracking-wider text-[#111111] block font-bold">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  id="fphone"
                  name="fphone"
                  placeholder="080... or +234..."
                  required
                  className="w-full h-12 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] px-4 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111] transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="finterest" className="text-[11px] font-mono uppercase tracking-wider text-[#111111] block font-bold">
                Interested in
              </label>
              <select
                id="finterest"
                name="finterest"
                className="w-full h-12 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] px-4 text-sm text-[#111111] focus:border-[#111111] focus:outline-none shadow-sm font-body"
              >
                <option value="Bespoke caftan / agbada">Bespoke caftan / agbada</option>
                <option value="Ready-to-wear pieces">Ready-to-wear pieces</option>
                <option value="Group & family wedding order">Group &amp; family wedding order</option>
                <option value="Fabric — shadda / yards">Fabric — shadda / yards</option>
                <option value="Footwear & accessories">Footwear &amp; accessories</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="fmsg" className="text-[11px] font-mono uppercase tracking-wider text-[#111111] block font-bold">
                Message / Event Timeline
              </label>
              <textarea
                id="fmsg"
                name="fmsg"
                rows={3}
                placeholder="Event date, fabric preference, color tone, custom measurements..."
                className="w-full rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] p-4 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111] transition-all shadow-sm resize-none font-body"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#111111] hover:bg-[#2F2F2F] text-[#FFFFFF] font-heading text-xs uppercase tracking-widest font-bold shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Send className="w-3.5 h-3.5 text-[#FFCB74]" />
                <span>Send WhatsApp Enquiry</span>
              </button>
            </div>

            {status && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{status}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right: Studio Details Card */}
        <div className="reveal lg:col-span-5">
          <div className="studio-block p-7 sm:p-9 rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] shadow-xl space-y-6">
            <div>
              <p className="eyebrow text-[#111111] font-mono text-xs uppercase tracking-widest font-bold mb-1.5">
                Atelier Headquarters
              </p>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                BMY Collection &amp; Kaftan
              </h3>
              <p className="text-xs font-mono text-[#6F6F6F] mt-1">Gombe Central, Gombe State, Nigeria</p>
            </div>

            <div className="space-y-4 pt-2 border-t border-[#E5E5E5] text-xs text-[#2F2F2F]">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111111] block text-sm">Studio Location</span>
                  <span className="text-[#4B5563]">Gombe Central, Gombe State, Nigeria</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111111] block text-sm">Consultation Hours</span>
                  <span className="text-[#4B5563]">Monday – Saturday: 9:00 AM – 7:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <PhoneCall className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111111] block text-sm">Direct Concierge Hotline</span>
                  <span className="text-[#4B5563] font-mono">+234 814 333 9349</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello BMY Collection & Kaftan, I would like to schedule a visit to the Gombe studio.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-[#F6F6F6] hover:bg-[#111111] hover:text-[#FFFFFF] border border-[#E5E5E5] text-[#111111] font-heading text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Chat with Studio Concierge</span>
              </a>

              <div className="flex items-center justify-center gap-4 pt-2">
                <a
                  href="https://www.instagram.com/bmy_collection_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] flex items-center justify-center text-[#2F2F2F] hover:text-[#111111] hover:border-[#111111] transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4"><use href="#ic-ig" /></svg>
                </a>
                <a
                  href="https://www.tiktok.com/@bmycollection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-[#E5E5E5] bg-[#F6F6F6] flex items-center justify-center text-[#2F2F2F] hover:text-[#111111] hover:border-[#111111] transition-all text-xs font-mono font-bold"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4"><use href="#ic-tiktok" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
