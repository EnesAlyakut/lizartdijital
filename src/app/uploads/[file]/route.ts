import { readFile } from "node:fs/promises";
import path from "node:path";
import { dataPath } from "@/lib/production-data";

const types: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
};

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (file !== path.basename(file) || file.includes("\\") || !types[path.extname(file).toLowerCase()]) {
    return new Response(null, { status: 404 });
  }
  const roots = process.env.LIZART_DATA_DIR
    ? [dataPath("uploads"), path.join(process.cwd(), "public", "uploads")]
    : [path.join(process.cwd(), "public", "uploads")];
  for (const root of roots) {
    try {
      const bytes = await readFile(path.join(root, file));
      return new Response(bytes, { headers: {
        "Content-Type": types[path.extname(file).toLowerCase()],
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      } });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  return new Response(null, { status: 404 });
}
