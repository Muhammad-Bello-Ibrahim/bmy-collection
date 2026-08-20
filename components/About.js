export default function About() {
  return (
    <section id="about">
      <div className="wrap about-grid">
        <div className="photo-frame reveal round" style={{ '--ar': '4/5' }}>
          <div className="pf-content"><img src="/images/showroom.webp" alt="" /></div>
        </div>
        <div className="about-copy reveal">
          <p className="eyebrow">The Atelier Story</p>
          <h2>Where heritage meets the everyday.</h2>
          <p className="pull">A caftan is not simply worn. It is a record of where you come from, cut fresh for how you live now.</p>
          <p className="body">BMY Collection works from the heart of Gombe, pairing the North&apos;s textile heritage — shadda, guinea brocade, atiku — with silhouettes built for the mosque, the wedding hall, and the office alike. Every bespoke piece begins with a conversation, not a size chart; every ready-to-wear piece is finished to the same standard we hold for a custom order.</p>
          <div className="fabric-tags">
            <span>Shadda</span><span>Guinea Brocade</span><span>Atiku</span><span>Cashmere</span><span>Lace</span><span>Damask</span>
          </div>
        </div>
      </div>
    </section>
  );
}
