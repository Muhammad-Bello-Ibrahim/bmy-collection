'use client';

import Link from 'next/link';

const PIECES = [
  { n: '01', name: 'Bespoke Caftan', mat: 'Shadda · Hand embroidery', occ: 'Made to measure', img: '/images/501811.jpg' },
  { n: '02', name: 'Bespoke Agbada', mat: 'Brocade · Gold thread', occ: 'Ceremonial Bespoke', img: '/images/501812.jpg' },
  { n: '03', name: 'Ready-to-Wear Caftan', mat: 'Cotton blend pre-finished', occ: 'Ready to Wear', img: '/images/501814.jpg' },
  { n: '04', name: 'Tailored Waistcoat Vest', mat: 'Structured cotton blend', occ: 'Ready to Wear', img: '/images/501815.jpg' },
  { n: '05', name: 'Tapered Trousers', mat: 'Structured cotton twill', occ: 'Ready to Wear', img: '/images/501816.jpg' },
  { n: '06', name: 'Shadda Yardage', mat: 'Traditional Guinea weave', occ: 'Sold by the Yard', img: '/images/501817.jpg' },
  { n: '07', name: 'Guinea Brocade', mat: 'Guinea brocade · Atiku', occ: 'Sold by the Yard', img: '/images/501819.jpg' },
  { n: '08', name: 'Leather Loafers', mat: 'Hand-finished genuine leather', occ: 'Footwear', img: '/images/501820.jpg' },
  { n: '09', name: 'Classic Timepiece', mat: 'Stainless steel & leather', occ: 'Horology', img: '/images/501821.jpg' },
  { n: '10', name: 'Artisan Wristband', mat: 'Natural beads & leather', occ: 'Accessory', img: '/images/501822.jpg' },
  { n: '11', name: 'Concentrated Perfume Oil', mat: 'Alcohol-free extrait', occ: 'Fragrance', img: '/images/501823.jpg' },
  { n: '12', name: 'Embroidered Cap', mat: 'Hand-embroidered cotton', occ: 'Traditional Cap', img: '/images/501824.jpg' },
  { n: '13', name: 'Ceremonial Brocade Robe', mat: 'Silk-finish brocade', occ: 'Ceremonial', img: '/images/501825.jpg' },
  { n: '14', name: 'Luxury Eau de Parfum', mat: 'Curated 50ml spray', occ: 'Fragrance', img: '/images/501826.jpg' },
];

export default function CollectionMarquee() {
  const row = [...PIECES, ...PIECES];
  return (
    <div className="overflow-x-auto no-scrollbar py-6">
      <div className="flex gap-4 sm:gap-6 px-4 sm:px-8 w-max">
        {row.map((p, i) => (
          <Link
            href="/shop"
            key={i}
            className="w-64 sm:w-72 rounded-3xl bg-[#FFFFFF] border border-[#E5E5E5] p-3.5 sm:p-4 shadow-sm hover:shadow-xl hover:border-[#111111] transition-all flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F6F6F6] border border-[#EEEEEE] mb-3.5">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/images/501811.jpg';
                }}
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#111111]/90 backdrop-blur-md text-[#FFCB74] text-[10px] font-mono font-bold tracking-wider shadow-md border border-white/10">
                № {p.n}
              </span>
            </div>

            <div className="space-y-1.5 text-left px-1">
              <h4 className="font-heading text-base font-bold text-[#111111] group-hover:text-[#2F2F2F] transition-colors truncate">
                {p.name}
              </h4>
              <p className="text-xs text-[#4B5563] font-body truncate">{p.mat}</p>
              <div className="pt-2.5 flex items-center justify-between border-t border-[#E5E5E5] text-[11px] font-mono">
                <span className="text-[#111111] font-bold uppercase tracking-wider">{p.occ}</span>
                <span className="text-[#111111] group-hover:text-[#FFCB74] transition-colors font-bold flex items-center gap-1">
                  <span>Explore</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
