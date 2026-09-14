import fs from "node:fs";
import path from "node:path";

/** Hostinger keeps deployment folders separately from this private data directory. */
export function dataPath(name: string): string {
  const root = process.env.LIZART_DATA_DIR;
  return root ? path.join(root, name) : path.join(process.cwd(), name);
}

export function initializeProductionData() {
  const root = process.env.LIZART_DATA_DIR;
  if (!root) return;
  if (!path.isAbsolute(root)) throw new Error("LIZART_DATA_DIR must be absolute.");
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  const database = path.join(root, "site.db");
  if (!fs.existsSync(database)) {
    // A concurrent worker must never overwrite an already initialized database.
    try {
      fs.copyFileSync(path.join(process.cwd(), "prisma", "bootstrap.db"), database, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(database, 0o600);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    }
  }
  process.env.DATABASE_URL = `file:${database.replaceAll("\\", "/")}`;
}
