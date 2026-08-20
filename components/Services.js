export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">Services &amp; Process</p>
          <h2>Three ways to order.</h2>
          <p>Whether it&apos;s one piece or an entourage, every order starts with a conversation at the atelier.</p>
        </div>

        <div className="services-grid reveal">
          <div className="service-card">
            <span className="num">№ 01</span>
            <h3>Bespoke</h3>
            <p className="meta">4–6 weeks · 2–3 fittings</p>
            <p>A one-of-one garment, built from your measurements. Fabric, embroidery and silhouette are entirely your call — caftan, agbada or full ensemble.</p>
            <span className="price">Price on request</span>
          </div>
          <div className="service-card">
            <span className="num">№ 02</span>
            <h3>Ready-to-Wear</h3>
            <p className="meta">Available now · No fitting required</p>
            <p>Finished caftans, vests and trousers in a range of sizes and colourways — the same standard of finish, ready to take home today.</p>
            <span className="price">Price on request</span>
          </div>
          <div className="service-card">
            <span className="num">№ 03</span>
            <h3>Group &amp; Family Orders</h3>
            <p className="meta">6–8 weeks · Coordinated fittings</p>
            <p>One fabric, unified across grooms, groomsmen and family — shadda and yards sourced and cut as a matching set for the occasion.</p>
            <span className="price">Quoted by group</span>
          </div>
        </div>

        <div className="process-grid reveal">
          <div className="process-step"><span className="num">01</span><h4>Consultation</h4><p>In-studio or via WhatsApp — brief, fabric library, first sketches.</p></div>
          <div className="process-step"><span className="num">02</span><h4>Fabric</h4><p>Shadda, brocade, atiku or your own cloth, chosen together.</p></div>
          <div className="process-step"><span className="num">03</span><h4>Fittings</h4><p>Two to three sessions, calibrated to your body and the occasion.</p></div>
          <div className="process-step"><span className="num">04</span><h4>Delivery</h4><p>Hand-finished and ready — collect in Gombe or have it delivered.</p></div>
        </div>
      </div>
    </section>
  );
}
