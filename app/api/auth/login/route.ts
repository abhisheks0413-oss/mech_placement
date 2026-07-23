import { NextRequest, NextResponse } from "next/server";
import { adminCookie, signAdminToken, validateAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function POST(request: NextRequest) {
  const { username, password, remember } = await request.json();
  const admin = await validateAdmin(username, password);
  if (!admin) return fail("Invalid username or password", 401);
  const response = ok({ admin });
  response.cookies.set(adminCookie(signAdminToken(admin), Boolean(remember)));
  return response;
}
