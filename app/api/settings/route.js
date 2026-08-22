import { connectDB } from '@/lib/db';
import { Setting } from '@/lib/models/Setting';
import { verifyAdmin } from '@/lib/auth';

const DEFAULT_SETTINGS = {
  maintenanceMode: false,
  maintenanceMessage:
    'We are currently refining our atelier collection and updating catalog inventory. We sincerely apologize for any inconvenience. For bespoke orders and urgent commissions, our concierge is available on WhatsApp.',
};

export async function GET() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'app_settings' }).lean();
    if (!doc) {
      return Response.json({ settings: DEFAULT_SETTINGS });
    }
    return Response.json({ settings: { ...DEFAULT_SETTINGS, ...doc.value } });
  } catch (e) {
    // If DB is offline or error, return defaults gracefully
    return Response.json({ settings: DEFAULT_SETTINGS, error: e.message });
  }
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const existing = await Setting.findOne({ key: 'app_settings' });
    const currentVal = existing ? existing.value : DEFAULT_SETTINGS;
    const newVal = { ...currentVal, ...body };

    const doc = await Setting.findOneAndUpdate(
      { key: 'app_settings' },
      { key: 'app_settings', value: newVal },
      { upsert: true, new: true }
    );

    return Response.json({ ok: true, settings: doc.value });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
