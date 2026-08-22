import mongoose from 'mongoose';

const AdvertSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    badge: { type: String, default: 'Special Promo' },
    title: { type: String, required: true },
    desc: { type: String, default: '' },
    img: { type: String, default: '/products/476031.jpg' },
    cloudinaryId: { type: String },
    cloudinaryUrl: { type: String },
    metricLabel: { type: String, default: 'Offer' },
    metricValue: { type: String, default: 'Exclusive' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Advert = mongoose.models.Advert || mongoose.model('Advert', AdvertSchema);
