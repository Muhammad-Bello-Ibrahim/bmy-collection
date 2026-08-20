'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-fallback"><div className="drift d1"></div><div className="drift d2"></div></div>
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/images/hero-vid.mp4"
        >
          <source src="/images/hero-vid.mp4" type="video/mp4" />
        </video>
        <div className="hero-grain"></div>
        <div className="hero-vignette"></div>
      </div>

      <div className="wrap hero-inner reveal in">
        <p className="eyebrow">Bespoke &amp; Ready-to-Wear · Gombe</p>
        <h1>Cut with care, <em>worn with pride.</em></h1>
        <p className="lede">Hand-tailored menswear for the North — caftans, agbada, shadda and yards, finished with the shoes, watches and scent to match. One atelier, the complete wardrobe.</p>
        <div className="hero-ctas">
          <a href="#collection" className="btn btn-solid">Explore Collection</a>
        </div>
      </div>

      <div className="scroll-cue"><span className="arrow"><svg width="14" height="14"><use href="#ic-arrow-down" /></svg></span> Scroll</div>
    </section>
  );
}
