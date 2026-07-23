import { NextRequest } from "next/server";
import { fail, ok, requireAdmin, toNumber } from "@/lib/api";
import { columnExists, query } from "@/lib/db";
import { opportunitySchema } from "@/lib/validators";

async function ensureSchema() {
  if (!(await columnExists("opportunities", "status"))) {
    await query("ALTER TABLE opportunities ADD COLUMN status ENUM('Applications Open', 'Applications Closed') NOT NULL DEFAULT 'Applications Open' AFTER type");
  }
}

function isPastDeadline(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.getTime() < Date.now();
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const { id } = await params;
  const existingRows = await query<{ deadline: string }>("SELECT deadline FROM opportunities WHERE id = :id LIMIT 1", { id: toNumber(id) });
  const existingDeadline = existingRows[0]?.deadline || "";
  const payload = opportunitySchema.parse(await request.json());
  if (!payload.deadline || (isPastDeadline(payload.deadline) && payload.deadline !== existingDeadline)) return fail("Deadline cannot be earlier than the current date and time", 400);
  const primaryLink = payload.applicationLinks[0]?.url || payload.applicationLink || "";
  await query(
    "UPDATE opportunities SET type=:type, status=:status, company=:company, description=:description, applicationLink=:applicationLink, applicationLinks=:applicationLinks, deadline=:deadline, compensation=:compensation, documents=:documents, logo=:logo WHERE id=:id",
    { ...payload, applicationLink: primaryLink, applicationLinks: JSON.stringify(payload.applicationLinks), compensation: JSON.stringify(payload.compensation), documents: JSON.stringify(payload.documents), logo: payload.logo || null, id: toNumber(id) }
  );
  return ok({ id: toNumber(id), ...payload });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const { id } = await params;
  await query("DELETE FROM opportunities WHERE id=:id", { id: toNumber(id) });
  return ok(true);
}
