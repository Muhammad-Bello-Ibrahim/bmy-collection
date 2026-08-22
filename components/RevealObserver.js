'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Flag that JavaScript is active
    document.documentElement.classList.add('js-reveal');

    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Immediately reveal elements near or in the viewport
    const checkAndReveal = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight + 120) {
          el.classList.add('in');
        }
      });
    };

    checkAndReveal();

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0 }
    );

    els.forEach((el) => {
      if (!el.classList.contains('in')) {
        io.observe(el);
      }
    });

    window.addEventListener('scroll', checkAndReveal, { passive: true });
    window.addEventListener('resize', checkAndReveal, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', checkAndReveal);
      window.removeEventListener('resize', checkAndReveal);
    };
  }, [pathname]);

  return null;
}
