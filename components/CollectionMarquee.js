'use client';

import Link from 'next/link';

const PIECES = [
  { n: '01', name: 'Bespoke Caftan', mat: 'Shadda · Hand embroidery', occ: 'Made to measure', img: '/images/476025.jpg' },
  { n: '02', name: 'Bespoke Agbada', mat: 'Brocade · Gold thread', occ: 'Ceremonial · Made to measure', img: '/images/476031.jpg' },
  { n: '03', name: 'Ready-to-Wear Caftan', mat: 'Cotton blend', occ: 'Ready to wear', img: '/images/476034.jpg' },
  { n: '04', name: 'Waistcoat Vest', mat: 'Structured cotton', occ: 'Ready to wear', img: '/images/476040.jpg' },
  { n: '05', name: 'Tapered Trousers', mat: 'Tapered fit', occ: 'Ready to wear · Bespoke', img: '/images/476043.jpg' },
  { n: '06', name: 'Shadda Yardage', mat: 'Traditional weave', occ: 'Sold by the yard', img: '/images/476046.jpg' },
  { n: '07', name: 'Guinea Brocade', mat: 'Guinea brocade · Atiku', occ: 'Sold by the yard', img: '/images/476049.jpg' },
  { n: '08', name: 'Leather Loafers', mat: 'Genuine leather', occ: 'Footwear', img: '/images/476058.jpg' },
  { n: '09', name: 'Classic Timepiece', mat: 'Stainless & leather', occ: 'Accessory', img: '/images/476061.jpg' },
  { n: '10', name: 'Artisan Wristband', mat: 'Beaded & leather', occ: 'Accessory', img: '/images/476064.jpg' },
  { n: '11', name: 'Perfume Oils', mat: 'Oils & spray extrait', occ: 'Fragrance', img: '/images/476072.jpg' },
  { n: '12', name: 'Embroidered Cap', mat: 'Hand embroidered', occ: 'Headwear', img: '/images/476079.jpg' }
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
            className="w-64 sm:w-72 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-[#111111] transition-all flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F6F6F6] border border-[#EEEEEE] mb-3">
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = '/products/476025.jpg';
                }}
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#111111]/80 backdrop-blur-md text-[#FFCB74] text-[10px] font-mono font-bold shadow-sm">
                № {p.n}
              </span>
            </div>

            <div className="space-y-1 text-left px-1">
              <h4 className="font-heading text-base font-semibold text-[#111111] group-hover:text-[#2F2F2F] transition-colors truncate">
                {p.name}
              </h4>
              <p className="text-xs text-[#6F6F6F] font-body truncate">{p.mat}</p>
              <div className="pt-2 flex items-center justify-between border-t border-[#E5E5E5] text-[11px] font-mono">
                <span className="text-[#111111] font-semibold">{p.occ}</span>
                <span className="text-[#6F6F6F] group-hover:text-[#111111] transition-colors font-bold">Explore →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
