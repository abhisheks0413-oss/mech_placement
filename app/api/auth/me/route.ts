import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const admin = await getAdminFromRequest(request);
  if (!admin) return fail("Unauthorized", 401);
  return ok({ admin });
}
