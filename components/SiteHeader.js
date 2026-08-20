'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={scrolled ? 'site-nav scrolled' : 'site-nav'} id="siteNav">
      <div className="wrap">
        <a href="#home" className="brandmark" onClick={close}>
          <svg><use href="#ic-logo" /></svg>
          <span className="word">BMY</span>
          <span className="sub">menswear atelier</span>
        </a>
        <nav className={open ? 'nav-links open' : 'nav-links'} id="navLinks">
          <a href="#collection" onClick={close}>Collection</a>
          <a href="#about" onClick={close}>About</a>
          <a href="#services" onClick={close}>Services</a>
          <a href="#contact" onClick={close}>Contact</a>
          <Link href="/shop" className="btn btn-solid" onClick={close}>Order</Link>
        </nav>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg><use href={open ? '#ic-close' : '#ic-menu'} /></svg>
        </button>
      </div>
    </header>
  );
}
