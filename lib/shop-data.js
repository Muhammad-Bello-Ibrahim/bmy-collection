export const WHATSAPP_NUMBER = '2348143339349';

export const PRODUCTS = [
  { id: 'p01', name: 'Bespoke Caftan', cat: 'bespoke', tag: 'Bespoke', price: null, mat: 'Shadda or brocade · hand embroidery', desc: 'A one-of-one caftan cut to your measurements. Choose your fabric, embroidery pattern and finish at consultation.', img: '/products/476025.jpg' },
  { id: 'p02', name: 'Bespoke Agbada', cat: 'bespoke', tag: 'Bespoke', price: null, mat: 'Brocade · gold thread embroidery', desc: 'Full three-piece ceremonial agbada, tailored for weddings, Sallah and formal occasions.', img: '/products/476031.jpg' },
  { id: 'p03', name: 'Ready-to-Wear Caftan — Indigo', cat: 'rtw', tag: 'Ready to Wear', price: 35000, mat: 'Cotton blend, pre-finished', desc: 'A pre-finished caftan in deep indigo, ready to take home today. True to size, available S–XXL.', img: '/products/476034.jpg' },
  { id: 'p04', name: 'Ready-to-Wear Caftan — Ivory', cat: 'rtw', tag: 'Ready to Wear', price: 35000, mat: 'Cotton blend, pre-finished', desc: 'The same silhouette in ivory — a versatile piece for daytime and formal wear alike.', img: '/products/476037.jpg' },
  { id: 'p05', name: 'Tailored Vest', cat: 'rtw', tag: 'Ready to Wear', price: 18000, mat: 'Structured cotton', desc: 'A structured waistcoat to layer over a caftan or shirt. Available in charcoal and navy.', img: '/products/476040.jpg' },
  { id: 'p06', name: 'Tapered Trousers', cat: 'rtw', tag: 'Ready to Wear', price: 22000, mat: 'Cotton twill, tapered fit', desc: 'Classic tapered trousers, made in-house. Can also be tailored to your exact measurements.', img: '/products/476043.jpg' },
  { id: 'p07', name: 'Shadda Fabric', cat: 'fabric', tag: 'Fabric · Per Yard', price: 12000, mat: 'Traditional shadda weave', desc: 'Premium traditional shadda cloth, sold by the yard for your own tailoring project.', img: '/products/476046.jpg' },
  { id: 'p08', name: 'Guinea Brocade', cat: 'fabric', tag: 'Fabric · Per Yard', price: 15000, mat: 'Guinea brocade', desc: 'Rich brocade yardage, popular for agbada and formal caftans.', img: '/products/476049.jpg' },
  { id: 'p09', name: 'Atiku Fabric', cat: 'fabric', tag: 'Fabric · Per Yard', price: 13000, mat: 'Atiku weave', desc: 'A lighter-weight yard fabric, well suited to daily-wear caftans.', img: '/products/476052.jpg' },
  { id: 'p10', name: 'Leather Loafers', cat: 'accessory', tag: 'Footwear', price: 40000, mat: 'Genuine leather', desc: 'Hand-finished leather loafers to complete a caftan or agbada look.', img: '/products/476058.jpg' },
  { id: 'p11', name: 'Classic Watch', cat: 'accessory', tag: 'Watch', price: 55000, mat: 'Stainless steel, leather strap', desc: 'A timeless finishing piece for any outfit, formal or casual.', img: '/products/476061.jpg' },
  { id: 'p12', name: 'Beaded Wristband', cat: 'accessory', tag: 'Wristband', price: 8000, mat: 'Natural beads', desc: 'Worn solo or stacked with a watch — a subtle traditional accent.', img: '/products/476064.jpg' },
  { id: 'p13', name: 'Leather Wristband', cat: 'accessory', tag: 'Wristband', price: 9500, mat: 'Genuine leather', desc: 'A minimal leather cuff, easy to pair with any watch.', img: '/products/476067.jpg' },
  { id: 'p14', name: 'Perfume Oil', cat: 'accessory', tag: 'Fragrance', price: 12000, mat: 'Concentrated oil, 6ml', desc: 'A long-lasting oil-based fragrance, alcohol-free.', img: '/products/476072.jpg' },
  { id: 'p15', name: 'Perfume Spray', cat: 'accessory', tag: 'Fragrance', price: 18000, mat: 'Eau de parfum, 50ml', desc: 'A daily-wear spray fragrance, curated for the modern gentleman.', img: '/products/476075.jpg' },
  { id: 'p16', name: 'Embroidered Cap — Black', cat: 'accessory', tag: 'Cap', price: 10000, mat: 'Hand embroidered cotton', desc: 'A traditional embroidered cap, finished by hand.', img: '/products/476079.jpg' },
  { id: 'p17', name: 'Embroidered Cap — Green', cat: 'accessory', tag: 'Cap', price: 10000, mat: 'Hand embroidered cotton', desc: 'The same cap in a rich forest green, embroidered to order.', img: '/products/476082.jpg' },
  { id: 'p18', name: 'Group & Aṣọ-ẹbí Package', cat: 'group', tag: 'Group Order', price: null, mat: 'Coordinated fabric, quoted by group', desc: 'One fabric, unified across grooms, groomsmen and family — quoted per group size and fabric choice.', img: '/products/476085.jpg' }
];

export const CATEGORIES = [
  { cat: 'all', label: 'All' },
  { cat: 'bespoke', label: 'Bespoke' },
  { cat: 'rtw', label: 'Ready-to-Wear' },
  { cat: 'fabric', label: 'Fabric' },
  { cat: 'accessory', label: 'Accessories' },
  { cat: 'group', label: 'Group Orders' }
];

export const fmt = (n) => (n == null ? 'Price on Request' : '₦' + n.toLocaleString('en-NG'));

/** Returns the best available image URL for a product (Cloudinary > local) */
export function productImg(p) {
  return p?.cloudinaryUrl || p?.img || '/products/476025.jpg';
}

