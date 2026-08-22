import { verifyAdmin } from '@/lib/auth';
export async function GET(request) {
  const payload = verifyAdmin(request);
  return Response.json({ isAdmin: !!payload });
}
