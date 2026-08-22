import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cat: { type: String, required: true },
  tag: { type: String },
  price: { type: Number, default: null },
  mat: { type: String },
  desc: { type: String },
  img: { type: String },           // local /products/ path fallback
  cloudinaryId: { type: String },  // Cloudinary public_id
  cloudinaryUrl: { type: String }, // Cloudinary secure_url
  stock: { type: Number, default: 10 },
  sizes: [{ type: String }],
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
