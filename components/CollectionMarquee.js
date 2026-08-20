'use client';

const PIECES = [
  { n: '01', name: 'Bespoke Caftan', mat: 'Shadda · Hand embroidery', occ: 'Made to measure', img: '/images/476025.jpg' },
  { n: '02', name: 'Bespoke Agbada', mat: 'Brocade · Gold thread', occ: 'Ceremonial · Made to measure', img: '/images/476031.jpg' },
  { n: '03', name: 'Ready-to-Wear Caftan', mat: 'Cotton blend', occ: 'Ready to wear', img: '/images/476034.jpg' },
  { n: '04', name: 'Vest', mat: 'Structured cotton', occ: 'Ready to wear', img: '/images/476040.jpg' },
  { n: '05', name: 'Trousers', mat: 'Tapered fit', occ: 'Ready to wear · Bespoke', img: '/images/476043.jpg' },
  { n: '06', name: 'Shadda', mat: 'Traditional weave', occ: 'Sold by the yard', img: '/images/476046.jpg' },
  { n: '07', name: 'Yards & Brocade', mat: 'Guinea brocade · Atiku', occ: 'Sold by the yard', img: '/images/476049.jpg' },
  { n: '08', name: 'Shoes', mat: 'Leather loafers', occ: 'Ready to wear', img: '/images/476058.jpg' },
  { n: '09', name: 'Watches', mat: 'Classic & contemporary', occ: 'Accessory', img: '/images/476061.jpg' },
  { n: '10', name: 'Wristbands', mat: 'Beaded & leather', occ: 'Accessory', img: '/images/476064.jpg' },
  { n: '11', name: 'Perfumes', mat: 'Oils & sprays', occ: 'Fragrance', img: '/images/476072.jpg' },
  { n: '12', name: 'Caps', mat: 'Hand embroidered', occ: 'Accessory', img: '/images/476079.jpg' }
];

export default function CollectionMarquee() {
  const row = [...PIECES, ...PIECES];
  return (
    <div className="marquee-wrap reveal in">
      <div className="marquee-row" id="marqueeRow">
        {row.map((p, i) => (
          <article className="piece-card" key={i}>
            <div className="photo-frame"><div className="pf-content"><img src={p.img} alt={p.name} loading="lazy" /></div></div>
            <div className="piece-meta">
              <span className="num">№ {p.n}</span>
              <h3>{p.name}</h3>
              <p className="mat">{p.mat}</p>
              <p className="occ">{p.occ}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
