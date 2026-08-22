import jwt from 'jsonwebtoken';
export function verifyAdmin(request) {
  const cookie = request.cookies?.get?.('bmy_admin_token')?.value
    || request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('bmy_admin_token='))?.split('=')[1];
  if (!cookie) return null;
  try {
    return jwt.verify(cookie, process.env.JWT_SECRET || 'fallback_secret');
  } catch { return null; }
}
