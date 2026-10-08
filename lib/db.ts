import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as {
  mysqlPool?: mysql.Pool;
};

export const pool = globalForMysql.mysqlPool ?? (function() {
  let dbConfig: mysql.PoolOptions = {
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || (process.env.VERCEL ? 5 : 10)),
    namedPlaceholders: true,
  };

  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  
  // Clean up env vars in case Vercel strings them with quotes
  const rejectAuthRaw = (process.env.DB_SSL_REJECT_UNAUTHORIZED || "").replace(/['"]/g, "").trim();
  const rejectUnauthorized = rejectAuthRaw !== "false";
  
  const sslConfig = isProduction ? {
    rejectUnauthorized,
    ca: process.env.DB_SSL_CA ? process.env.DB_SSL_CA.replace(/\\n/g, '\n').replace(/^["']|["']$/g, "") : undefined,
  } : undefined;

  const rawUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^["']|["']$/g, "").trim() : "";

  if (rawUrl) {
    try {
      const url = new URL(rawUrl);
      const isSslRequired = url.searchParams.get("ssl-mode") === "REQUIRED" || isProduction;
      
      dbConfig = {
        ...dbConfig,
        host: url.hostname,
        port: Number(url.port) || 3306,
        user: url.username,
        password: decodeURIComponent(url.password),
        database: url.pathname.slice(1),
        ssl: isSslRequired ? sslConfig : undefined
      };
    } catch (err) {
      console.error("Invalid DATABASE_URL configuration", err);
    }
  } else {
    dbConfig = {
      ...dbConfig,
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "cet_mech_placement",
      ssl: sslConfig
    };
  }

  return mysql.createPool(dbConfig);
})();

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
