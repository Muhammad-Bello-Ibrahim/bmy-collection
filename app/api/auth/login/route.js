import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { Admin } from '@/lib/models/Admin';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    await connectDB();
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    const token = jwt.sign({ sub: admin._id, username: admin.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    const res = Response.json({ ok: true });
    res.headers.set('Set-Cookie', `bmy_admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
    return res;
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
