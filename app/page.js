import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import Showcase from '@/components/Showcase';
import About from '@/components/About';
import CollectionMarquee from '@/components/CollectionMarquee';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import SiteFooter from '@/components/SiteFooter';
import BackTop from '@/components/BackTop';

export default function Home() {
  return (
    <>
      <SiteHeader />

      <Hero />

      <hr className="hair" />

      <Showcase />

      <hr className="hair" />

      <About />

      <hr className="hair" />

      <section className="collection" id="collection">
        <div className="wrap">
          <div className="section-head reveal">
            <p className="eyebrow">The Collection</p>
            <h2>Pieces from the wardrobe.</h2>
            <p>From ceremonial agbada to the accessories that finish a look — every category, hand-finished in-house.</p>
          </div>
        </div>

        <CollectionMarquee />

        <div className="wrap collection-foot">
          <a href="#services" className="btn btn-line">See Services &amp; Pricing</a>
        </div>
      </section>

      <hr className="hair" />

      <Services />

      <hr className="hair" />

      <Contact />

      <SiteFooter />
      <BackTop />
    </>
  );
}
