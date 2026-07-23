import { NextRequest } from "next/server";
import { fail, ok, requireAdmin, toNumber } from "@/lib/api";
import { query } from "@/lib/db";
import { opportunityUpdateSchema } from "@/lib/validators";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query("SELECT * FROM opportunity_updates WHERE opportunityId=:id ORDER BY createdAt DESC", { id: toNumber(id) });
  return ok(rows);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  const { id } = await params;
  const payload = opportunityUpdateSchema.parse(await request.json());
  const result = await query<any>("INSERT INTO opportunity_updates (opportunityId, message) VALUES (:opportunityId, :message)", {
    opportunityId: toNumber(id),
    message: payload.message
  });
  return ok({ id: (result as any).insertId, opportunityId: toNumber(id), message: payload.message, createdAt: new Date().toISOString() });
}
