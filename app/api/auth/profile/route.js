import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { Admin } from '@/lib/models/Admin';
import { verifyAdmin } from '@/lib/auth';

export async function PATCH(request) {
  const payload = verifyAdmin(request);
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newUsername, newPassword, confirmNewPassword } = await request.json();

    if (!currentPassword) {
      return Response.json({ error: 'Current password is required to make security changes.' }, { status: 400 });
    }

    await connectDB();

    // Find current admin by sub or username
    let admin = null;
    if (payload.sub) {
      admin = await Admin.findById(payload.sub);
    }
    if (!admin && payload.username) {
      admin = await Admin.findOne({ username: payload.username.toLowerCase() });
    }
    if (!admin) {
      // Fallback: look for the primary admin document
      admin = await Admin.findOne({});
    }

    if (!admin) {
      return Response.json({ error: 'Admin account not found' }, { status: 404 });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!passwordMatch) {
      return Response.json({ error: 'Incorrect current password. Verification failed.' }, { status: 400 });
    }

    let updated = false;

    // 1. Update Username if provided
    if (newUsername && newUsername.trim()) {
      const cleanUsername = newUsername.trim().toLowerCase();
      if (cleanUsername.length < 3) {
        return Response.json({ error: 'Username must be at least 3 characters long.' }, { status: 400 });
      }

      if (cleanUsername !== admin.username) {
        // Check uniqueness
        const existingWithUsername = await Admin.findOne({ username: cleanUsername });
        if (existingWithUsername && existingWithUsername._id.toString() !== admin._id.toString()) {
          return Response.json({ error: 'This username is already in use by another admin.' }, { status: 400 });
        }
        admin.username = cleanUsername;
        updated = true;
      }
    }

    // 2. Update Password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return Response.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
      }
      if (newPassword !== confirmNewPassword) {
        return Response.json({ error: 'New password and confirmation do not match.' }, { status: 400 });
      }

      admin.passwordHash = await bcrypt.hash(newPassword, 10);
      updated = true;
    }

    if (!updated) {
      return Response.json({ error: 'Please provide a new username or new password to update.' }, { status: 400 });
    }

    await admin.save();

    // Re-issue updated JWT token
    const token = jwt.sign(
      { sub: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    const res = Response.json({
      ok: true,
      username: admin.username,
      message: 'Admin credentials updated successfully.',
    });

    res.headers.set(
      'Set-Cookie',
      `bmy_admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
    );

    return res;
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
