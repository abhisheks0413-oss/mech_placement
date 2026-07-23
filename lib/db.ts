import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as {
  mysqlPool?: mysql.Pool;
};

export const pool =
  globalForMysql.mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cet_mech_placement",
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });

if (process.env.NODE_ENV !== "production") {
  globalForMysql.mysqlPool = pool;
}

export async function query<T>(sql: string, values?: Record<string, unknown> | unknown[]) {
  const [rows] = await pool.execute(sql, values as any);
  return rows as T[];
}

export async function columnExists(table: string, column: string) {
  const rows = await query<{ exists: number }>(
    "SELECT COUNT(*) AS `exists` FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = :tableName AND column_name = :columnName",
    { tableName: table, columnName: column }
  );
  return Boolean(rows[0]?.exists);
}

export function parseJsonArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseNamedLinks(value: unknown, fallbackUrl?: unknown) {
  const parsed = parseJson(value);
  const links = Array.isArray(parsed) ? parsed : [];
  const normalized = links
    .map((item) => typeof item === "string" ? { name: "Application Link", url: item } : item)
    .filter((item) => item?.name && item?.url);
  if (!normalized.length && fallbackUrl) return [{ name: "Application Link", url: String(fallbackUrl) }];
  return normalized;
}

export function parseNamedDocuments(value: unknown) {
  const parsed = parseJson(value);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item) => typeof item === "string" ? { name: fileNameFromPath(item), url: item } : item)
    .filter((item) => item?.name && item?.url);
}

export function parseNumberArray(value: unknown) {
  const parsed = parseJson(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item) => Number(item)).filter((item) => Number.isFinite(item));
}

export function parseCompensation(value: unknown) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseJson(value: unknown) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return [];
  }
}

function fileNameFromPath(value: string) {
  return value.split("/").pop()?.replace(/^\d+-/, "") || "Document";
}
