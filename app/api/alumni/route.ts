import { NextRequest } from "next/server";
import { fail, ok, requireAdmin } from "@/lib/api";
import { columnExists, query } from "@/lib/db";
import { alumniSchema } from "@/lib/validators";

async function ensureSchema() {
  if (!(await columnExists("alumni_insights", "placementMode"))) {
    await query("ALTER TABLE alumni_insights ADD COLUMN placementMode ENUM('On Campus', 'Off Campus') NOT NULL DEFAULT 'On Campus' AFTER position");
  }
}

async function buildColumns() {
  const hasBatch = await columnExists("alumni_insights", "batch");
  const columns = ["name", "company", "passoutYear", "position", "placementMode", "ctc", "review"];
  const values = [":name", ":company", ":passoutYear", ":position", ":placementMode", ":ctc", ":review"];
  if (hasBatch) {
    columns.splice(3, 0, "batch");
    values.splice(3, 0, ":batch");
  }
  return { columns, values, hasBatch };
}

export async function GET() {
  await ensureSchema();
  return ok(await query("SELECT * FROM alumni_insights ORDER BY createdAt DESC"));
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const payload = alumniSchema.parse(await request.json());
  const { columns, values, hasBatch } = await buildColumns();
  const result = await query<any>(
    `INSERT INTO alumni_insights (${columns.join(", ")}) VALUES (${values.join(", ")})`,
    {
      ...payload,
      batch: payload.passoutYear
    }
  );
  return ok({ id: (result as any).insertId, ...payload, ...(hasBatch ? { batch: payload.passoutYear } : {}) });
}
