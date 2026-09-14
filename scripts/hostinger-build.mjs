import { spawnSync } from "node:child_process";
import path from "node:path";

// Build against the content-only bootstrap. Runtime uses LIZART_DATA_DIR instead.
const env = { ...process.env, DATABASE_URL: `file:${path.resolve("prisma/bootstrap.db").replaceAll("\\", "/")}` };
delete env.LIZART_DATA_DIR;
for (const [file, args] of [
  ["node_modules/prisma/build/index.js", ["generate"]],
  ["node_modules/next/dist/bin/next", ["build"]],
]) {
  const result = spawnSync(process.execPath, [file, ...args], { env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
