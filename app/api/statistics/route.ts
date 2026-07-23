import { NextRequest } from "next/server";
import { fail, ok, requireAdmin } from "@/lib/api";
import { columnExists, parseNumberArray, query } from "@/lib/db";
import { statisticSchema } from "@/lib/validators";

async function ensureSchema() {
  const hasYears = await columnExists("placement_statistics", "years");
  const hasYear = await columnExists("placement_statistics", "year");
  const hasPlacementMode = await columnExists("placement_statistics", "placementMode");
  if (!hasYears) {
    await query("ALTER TABLE placement_statistics ADD COLUMN years JSON NULL AFTER package");
  }
  if (!hasYear) {
    await query("ALTER TABLE placement_statistics ADD COLUMN year INT NULL AFTER package");
  }
  if (!hasPlacementMode) {
    await query("ALTER TABLE placement_statistics ADD COLUMN placementMode ENUM('On Campus', 'Off Campus') NOT NULL DEFAULT 'On Campus' AFTER year");
  }
  await query("ALTER TABLE placement_statistics MODIFY package DECIMAL(6,2) NULL");
  await query("UPDATE placement_statistics SET years = JSON_ARRAY(year) WHERE (years IS NULL OR JSON_LENGTH(years) = 0) AND year IS NOT NULL");
  await query("UPDATE placement_statistics SET year = JSON_UNQUOTE(JSON_EXTRACT(years, '$[0]')) WHERE (year IS NULL OR year = 0) AND JSON_LENGTH(years) > 0");
}

function normalizeYears(years: unknown[]) {
  const normalized = Array.from(new Set(years.map((year) => Number(year)).filter((year) => Number.isFinite(year)))).sort((a, b) => b - a);
  return normalized.length ? normalized : [new Date().getFullYear()];
}

async function hasColumn(name: string) {
  return columnExists("placement_statistics", name);
}

async function buildInsertColumns() {
  const hasYear = await hasColumn("year");
  const hasYears = await hasColumn("years");
  const hasPlacementMode = await hasColumn("placementMode");
  const columns = ["company", "package"];
  const values = [":company", ":package"];
  if (hasYear) {
    columns.push("year");
    values.push(":year");
  }
  if (hasYears) {
    columns.push("years");
    values.push(":years");
  }
  if (hasPlacementMode) {
    columns.push("placementMode");
    values.push(":placementMode");
  }
  columns.push("notes");
  values.push(":notes");
  return { columns, values };
}

export async function GET() {
  await ensureSchema();
  const rows = await query<any>("SELECT * FROM placement_statistics ORDER BY package DESC");
  return ok(rows.map((row) => ({ ...row, years: parseNumberArray(row.years) })));
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const payload = statisticSchema.parse(await request.json());
  const years = normalizeYears(payload.years);
  const { columns, values } = await buildInsertColumns();
  const result = await query<any>(
    `INSERT INTO placement_statistics (${columns.join(", ")}) VALUES (${values.join(", ")})`,
    {
      company: payload.company,
      package: payload.package ?? null,
      year: years[0],
      years: JSON.stringify(years),
      placementMode: payload.placementMode,
      notes: payload.notes || null
    }
  );
  return ok({ id: (result as any).insertId, ...payload, years });
}
