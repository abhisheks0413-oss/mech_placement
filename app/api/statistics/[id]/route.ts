import { NextRequest } from "next/server";
import { fail, ok, requireAdmin, toNumber } from "@/lib/api";
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const { id } = await params;
  const payload = statisticSchema.parse(await request.json());
  const years = normalizeYears(payload.years);
  await query("UPDATE placement_statistics SET company=:company, package=:package, year=:year, years=:years, placementMode=:placementMode, notes=:notes WHERE id=:id", {
    company: payload.company,
    package: payload.package ?? null,
    year: years[0],
    years: JSON.stringify(years),
    placementMode: payload.placementMode,
    notes: payload.notes || null,
    id: toNumber(id)
  });
  return ok({ id: toNumber(id), ...payload, years });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const { id } = await params;
  await query("DELETE FROM placement_statistics WHERE id=:id", { id: toNumber(id) });
  return ok(true);
}
