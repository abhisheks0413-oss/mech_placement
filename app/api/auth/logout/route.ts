import { NextResponse } from "next/server";
import { clearedAdminCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ data: true });
  response.cookies.set(clearedAdminCookie());
  return response;
}
