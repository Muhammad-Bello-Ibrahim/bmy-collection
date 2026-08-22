import { connectDB } from '@/lib/db';
import { Advert } from '@/lib/models/Advert';
import { verifyAdmin } from '@/lib/auth';

const DEFAULT_ADVERTS = [
  {
    id: 'adv-01',
    badge: 'Limited Sale',
    title: 'Up to 35% Off Caftans',
    desc: 'Signature ready-to-wear tailored silhouettes.',
    img: '/products/476034.jpg',
    metricLabel: 'Special Deal',
    metricValue: 'From ₦18,000',
    active: true,
    order: 1,
  },
  {
    id: 'adv-02',
    badge: '2026 Collection',
    title: 'Royal Brocade & Agbada',
    desc: 'Gold embroidery on traditional Guinea brocade.',
    img: '/products/476031.jpg',
    metricLabel: 'Status',
    metricValue: 'New in Studio',
    active: true,
    order: 2,
  },
  {
    id: 'adv-03',
    badge: 'Wedding Entourage',
    title: 'Bespoke Groom & Aṣọ-ẹbí',
    desc: 'Coordinated wedding packages & custom fittings.',
    img: '/products/476085.jpg',
    metricLabel: 'Orders',
    metricValue: 'By Consultation',
    active: true,
    order: 3,
  },
  {
    id: 'adv-04',
    badge: 'Artisan Essentials',
    title: 'Leather Shoes & Scent Oils',
    desc: 'Hand-finished footwear & alcohol-free extraits.',
    img: '/products/476058.jpg',
    metricLabel: 'Prices',
    metricValue: 'From ₦8,000',
    active: true,
    order: 4,
  },
];

export async function GET(request) {
  try {
    await connectDB();
    const isAdmin = verifyAdmin(request);
    let adverts = await Advert.find(isAdmin ? {} : { active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Auto-seed if adverts collection is empty
    if (!adverts || adverts.length === 0) {
      for (const adv of DEFAULT_ADVERTS) {
        await Advert.findOneAndUpdate({ id: adv.id }, adv, { upsert: true, new: true });
      }
      adverts = await Advert.find(isAdmin ? {} : { active: true })
        .sort({ order: 1, createdAt: 1 })
        .lean();
    }

    return Response.json({ adverts });
  } catch (e) {
    return Response.json({ error: e.message, adverts: DEFAULT_ADVERTS }, { status: 200 });
  }
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    if (!body.title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }
    const advert = await Advert.create({
      ...body,
      id: body.id || `adv-${Date.now()}`,
    });
    return Response.json({ advert }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
