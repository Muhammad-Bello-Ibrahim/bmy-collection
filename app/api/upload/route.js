import { verifyAdmin } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  if (!verifyAdmin(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!process.env.CLOUDINARY_API_KEY) {
    return Response.json({ error: 'Cloudinary not configured' }, { status: 503 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return Response.json({ error: 'No file' }, { status: 400 });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'bmy-collection', resource_type: 'image' }, (err, res) => {
        if (err) reject(err); else resolve(res);
      }).end(buffer);
    });
    return Response.json({ url: result.secure_url, cloudinaryId: result.public_id });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
