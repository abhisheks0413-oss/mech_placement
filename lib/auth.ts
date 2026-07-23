import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { query } from "./db";

const COOKIE_NAME = "cet_admin_token";

export type AdminToken = {
  id: number;
  username: string;
  role: "admin";
};

export function signAdminToken(payload: AdminToken) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret-change-me", {
    expiresIn: "7d"
  });
}

export function verifyAdminToken(token?: string): AdminToken | null {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "dev-secret-change-me") as AdminToken;
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(request: NextRequest) {
  return verifyAdminToken(request.cookies.get(COOKIE_NAME)?.value);
}

export async function getAdminFromCookies() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(COOKIE_NAME)?.value);
}

export function adminCookie(token: string, remember: boolean) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 8
  };
}

export function clearedAdminCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  };
}

export async function validateAdmin(username: string, password: string) {
  const rows = await query<{ id: number; username: string; passwordHash: string }>(
    "SELECT id, username, passwordHash FROM admins WHERE username = :username LIMIT 1",
    { username }
  );
  const admin = rows[0];
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  return valid ? { id: admin.id, username: admin.username, role: "admin" as const } : null;
}
