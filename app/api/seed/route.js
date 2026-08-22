import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { Admin } from '@/lib/models/Admin';
import { Product } from '@/lib/models/Product';

const SEED_PRODUCTS = [
  { id: 'p01', name: 'Bespoke Caftan', cat: 'bespoke', tag: 'Bespoke', price: null, mat: 'Shadda or brocade · hand embroidery', desc: 'A one-of-one caftan cut to your measurements. Choose your fabric, embroidery pattern and finish at consultation.', img: '/products/476025.jpg', stock: 0, sizes: [], inStock: true, featured: true },
  { id: 'p02', name: 'Bespoke Agbada', cat: 'bespoke', tag: 'Bespoke', price: null, mat: 'Brocade · gold thread embroidery', desc: 'Full three-piece ceremonial agbada, tailored for weddings, Sallah and formal occasions.', img: '/products/476031.jpg', stock: 0, sizes: [], inStock: true, featured: true },
  { id: 'p03', name: 'Ready-to-Wear Caftan — Indigo', cat: 'rtw', tag: 'Ready to Wear', price: 35000, mat: 'Cotton blend, pre-finished', desc: 'A pre-finished caftan in deep indigo, ready to take home today. True to size, available S–XXL.', img: '/products/476034.jpg', stock: 12, sizes: ['S','M','L','XL','XXL'], inStock: true, featured: true },
  { id: 'p04', name: 'Ready-to-Wear Caftan — Ivory', cat: 'rtw', tag: 'Ready to Wear', price: 35000, mat: 'Cotton blend, pre-finished', desc: 'The same silhouette in ivory — a versatile piece for daytime and formal wear alike.', img: '/products/476037.jpg', stock: 8, sizes: ['S','M','L','XL','XXL'], inStock: true, featured: false },
  { id: 'p05', name: 'Tailored Vest', cat: 'rtw', tag: 'Ready to Wear', price: 18000, mat: 'Structured cotton', desc: 'A structured waistcoat to layer over a caftan or shirt. Available in charcoal and navy.', img: '/products/476040.jpg', stock: 15, sizes: ['S','M','L','XL'], inStock: true, featured: false },
  { id: 'p06', name: 'Tapered Trousers', cat: 'rtw', tag: 'Ready to Wear', price: 22000, mat: 'Cotton twill, tapered fit', desc: 'Classic tapered trousers, made in-house. Can also be tailored to your exact measurements.', img: '/products/476043.jpg', stock: 10, sizes: ['S','M','L','XL','XXL'], inStock: true, featured: false },
  { id: 'p07', name: 'Shadda Fabric', cat: 'fabric', tag: 'Fabric · Per Yard', price: 12000, mat: 'Traditional shadda weave', desc: 'Premium traditional shadda cloth, sold by the yard for your own tailoring project.', img: '/products/476046.jpg', stock: 50, sizes: [], inStock: true, featured: false },
  { id: 'p08', name: 'Guinea Brocade', cat: 'fabric', tag: 'Fabric · Per Yard', price: 15000, mat: 'Guinea brocade', desc: 'Rich brocade yardage, popular for agbada and formal caftans.', img: '/products/476049.jpg', stock: 40, sizes: [], inStock: true, featured: false },
  { id: 'p09', name: 'Atiku Fabric', cat: 'fabric', tag: 'Fabric · Per Yard', price: 13000, mat: 'Atiku weave', desc: 'A lighter-weight yard fabric, well suited to daily-wear caftans.', img: '/products/476052.jpg', stock: 60, sizes: [], inStock: true, featured: false },
  { id: 'p10', name: 'Leather Loafers', cat: 'accessory', tag: 'Footwear', price: 40000, mat: 'Genuine leather', desc: 'Hand-finished leather loafers to complete a caftan or agbada look.', img: '/products/476058.jpg', stock: 6, sizes: ['40','41','42','43','44','45'], inStock: true, featured: true },
  { id: 'p11', name: 'Classic Watch', cat: 'accessory', tag: 'Watch', price: 55000, mat: 'Stainless steel, leather strap', desc: 'A timeless finishing piece for any outfit, formal or casual.', img: '/products/476061.jpg', stock: 4, sizes: [], inStock: true, featured: true },
  { id: 'p12', name: 'Beaded Wristband', cat: 'accessory', tag: 'Wristband', price: 8000, mat: 'Natural beads', desc: 'Worn solo or stacked with a watch — a subtle traditional accent.', img: '/products/476064.jpg', stock: 20, sizes: [], inStock: true, featured: false },
  { id: 'p13', name: 'Leather Wristband', cat: 'accessory', tag: 'Wristband', price: 9500, mat: 'Genuine leather', desc: 'A minimal leather cuff, easy to pair with any watch.', img: '/products/476067.jpg', stock: 18, sizes: [], inStock: true, featured: false },
  { id: 'p14', name: 'Perfume Oil', cat: 'accessory', tag: 'Fragrance', price: 12000, mat: 'Concentrated oil, 6ml', desc: 'A long-lasting oil-based fragrance, alcohol-free.', img: '/products/476072.jpg', stock: 25, sizes: [], inStock: true, featured: false },
  { id: 'p15', name: 'Perfume Spray', cat: 'accessory', tag: 'Fragrance', price: 18000, mat: 'Eau de parfum, 50ml', desc: 'A daily-wear spray fragrance, curated for the modern gentleman.', img: '/products/476075.jpg', stock: 15, sizes: [], inStock: true, featured: false },
  { id: 'p16', name: 'Embroidered Cap — Black', cat: 'accessory', tag: 'Cap', price: 10000, mat: 'Hand embroidered cotton', desc: 'A traditional embroidered cap, finished by hand.', img: '/products/476079.jpg', stock: 12, sizes: [], inStock: true, featured: false },
  { id: 'p17', name: 'Embroidered Cap — Green', cat: 'accessory', tag: 'Cap', price: 10000, mat: 'Hand embroidered cotton', desc: 'The same cap in a rich forest green, embroidered to order.', img: '/products/476082.jpg', stock: 10, sizes: [], inStock: true, featured: false },
  { id: 'p18', name: 'Group & Aṣọ-ẹbí Package', cat: 'group', tag: 'Group Order', price: null, mat: 'Coordinated fabric, quoted by group', desc: 'One fabric, unified across grooms, groomsmen and family — quoted per group size and fabric choice.', img: '/products/476085.jpg', stock: 0, sizes: [], inStock: true, featured: false },
];

export async function GET() {
  try {
    await connectDB();
    // Seed admin
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'bmyadmin2024';
    const existing = await Admin.findOne({ username });
    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      await Admin.create({ username, passwordHash });
    }
    // Seed products
    for (const p of SEED_PRODUCTS) {
      await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
    }
    return Response.json({ ok: true, message: 'Seeded admin + ' + SEED_PRODUCTS.length + ' products' });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
