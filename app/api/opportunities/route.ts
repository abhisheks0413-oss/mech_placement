import { NextRequest } from "next/server";
import { fail, ok, requireAdmin } from "@/lib/api";
import { columnExists, parseCompensation, parseNamedDocuments, parseNamedLinks, query } from "@/lib/db";
import { Opportunity } from "@/lib/types";
import { opportunitySchema } from "@/lib/validators";

function mapOpportunity(row: any): Opportunity {
  return { ...row, status: row.status || "Applications Open", applicationLinks: parseNamedLinks(row.applicationLinks, row.applicationLink), compensation: parseCompensation(row.compensation), documents: parseNamedDocuments(row.documents) };
}

async function ensureSchema() {
  if (!(await columnExists("opportunities", "status"))) {
    await query("ALTER TABLE opportunities ADD COLUMN status ENUM('Applications Open', 'Applications Closed') NOT NULL DEFAULT 'Applications Open' AFTER type");
  }
}

function isPastDeadline(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.getTime() < Date.now();
}

export async function GET() {
  await ensureSchema();
  const rows = await query<any>("SELECT * FROM opportunities ORDER BY createdAt DESC");
  return ok(rows.map(mapOpportunity));
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  await ensureSchema();
  const payload = opportunitySchema.parse(await request.json());
  if (!payload.deadline || isPastDeadline(payload.deadline)) return fail("Deadline cannot be earlier than the current date and time", 400);
  const primaryLink = payload.applicationLinks[0]?.url || payload.applicationLink || "";
  const result = await query<any>(
    "INSERT INTO opportunities (type, status, company, description, applicationLink, applicationLinks, deadline, compensation, documents, logo) VALUES (:type, :status, :company, :description, :applicationLink, :applicationLinks, :deadline, :compensation, :documents, :logo)",
    { ...payload, applicationLink: primaryLink, applicationLinks: JSON.stringify(payload.applicationLinks), compensation: JSON.stringify(payload.compensation), documents: JSON.stringify(payload.documents), logo: payload.logo || null }
  );
  return ok({ id: (result as any).insertId, ...payload });
}
