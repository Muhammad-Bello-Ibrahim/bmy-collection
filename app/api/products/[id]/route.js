import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { verifyAdmin } from '@/lib/auth';

export async function PATCH(request, { params }) {
  if (!verifyAdmin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const product = await Product.findOneAndUpdate({ id }, body, { new: true });
    if (!product) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ product });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!verifyAdmin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { id } = await params;
    await Product.findOneAndDelete({ id });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
