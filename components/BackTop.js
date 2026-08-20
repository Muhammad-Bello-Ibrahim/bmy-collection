'use client';

import { useEffect } from 'react';

export default function BackTop() {
  useEffect(() => {
    const bt = document.getElementById('back-top');
    if (!bt) return;
    const onScroll = () => bt.classList.toggle('show', window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      id="back-top"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg><use href="#ic-arrow-up" /></svg>
    </button>
  );
}
