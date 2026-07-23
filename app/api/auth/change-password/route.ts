import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { getAdminFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return fail("Unauthorized", 401);

  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) return fail("Both passwords are required");
  if (String(newPassword).length < 8) return fail("New password must be at least 8 characters");

  const rows = await query<{ passwordHash: string }>("SELECT passwordHash FROM admins WHERE id = :id LIMIT 1", { id: admin.id });
  const row = rows[0];
  if (!row) return fail("Admin not found", 404);

  const valid = await bcrypt.compare(currentPassword, row.passwordHash);
  if (!valid) return fail("Current password is incorrect", 400);

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await query("UPDATE admins SET passwordHash = :passwordHash WHERE id = :id", { passwordHash, id: admin.id });
  return ok(true);
}
