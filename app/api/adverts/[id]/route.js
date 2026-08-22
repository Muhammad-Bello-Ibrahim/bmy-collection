import { connectDB } from '@/lib/db';
import { Advert } from '@/lib/models/Advert';
import { verifyAdmin } from '@/lib/auth';

export async function PATCH(request, { params }) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const advert = await Advert.findOneAndUpdate({ id }, body, { new: true });
    if (!advert) {
      return Response.json({ error: 'Advert not found' }, { status: 404 });
    }
    return Response.json({ advert });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    await Advert.findOneAndDelete({ id });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
