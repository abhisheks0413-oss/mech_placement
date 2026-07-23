import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { fail, ok, requireAdmin } from "@/lib/api";

const allowed = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg", "image/webp"]);

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return fail("Unauthorized", 401);
  const form = await request.formData();
  const files = form.getAll("files").filter((file): file is File => file instanceof File);
  if (!files.length) return fail("No files provided");
  await mkdir(path.join(process.cwd(), "public", "uploads"), { recursive: true });
  const saved: string[] = [];
  for (const file of files) {
    if (!allowed.has(file.type)) return fail(`Unsupported file type: ${file.type}`);
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(process.cwd(), "public", "uploads", safeName), bytes);
    saved.push(`/uploads/${safeName}`);
  }
  return ok(saved);
}
