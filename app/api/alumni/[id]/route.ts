import { NextRequest } from "next/server";
import { fail, ok, requireAdmin, toNumber } from "@/lib/api";
import { columnExists, query } from "@/lib/db";
import { alumniSchema } from "@/lib/validators";

async function ensureSchema() {
  if (!(await columnExists("alumni_insights", "placementMode"))) {
    await query("ALTER TABLE alumni_insights ADD COLUMN placementMode ENUM('On Campus', 'Off Campus') NOT NULL DEFAULT 'On Campus' AFTER position");
  }
}

async function hasBatchColumn() {
  return columnExists("alumni_insights", "batch");
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const { id } = await params;
  const payload = alumniSchema.parse(await request.json());
  const batch = (await hasBatchColumn()) ? { batch: payload.passoutYear } : {};
  await query("UPDATE alumni_insights SET name=:name, company=:company, passoutYear=:passoutYear, position=:position, placementMode=:placementMode, ctc=:ctc, review=:review" + ((await hasBatchColumn()) ? ", batch=:batch" : "") + " WHERE id=:id", { ...payload, ...batch, id: toNumber(id) });
  return ok({ id: toNumber(id), ...payload, ...batch });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const { id } = await params;
  await query("DELETE FROM alumni_insights WHERE id=:id", { id: toNumber(id) });
  return ok(true);
}
