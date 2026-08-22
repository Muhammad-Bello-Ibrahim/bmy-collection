import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: 1 }).lean();
    return Response.json({ products });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!verifyAdmin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    return Response.json({ product }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
