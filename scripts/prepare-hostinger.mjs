import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";

// Run locally once. Never run this against the live database.
const destination = path.resolve("prisma/bootstrap.db");
if (fs.existsSync(destination)) throw new Error("Bootstrap already exists; preserve the current deployment credentials.");
const source = new DatabaseSync(path.resolve("prisma/dev.db"), { readOnly: true });
source.prepare("VACUUM INTO ?").run(destination);
source.close();
const db = new DatabaseSync(destination);
const contentTables = new Set([
  "Role", "ProductCategory", "Technology", "Platform", "Product", "ProductImage",
  "ProductVideo", "ProductTechnology", "ProductPlatform", "ProductVersion",
  "ProductLicense", "AddOnService", "ProductAddOn", "BlogCategory", "BlogPost",
  "PortfolioProject", "Faq", "Page", "Setting", "_prisma_migrations",
]);
db.exec("PRAGMA foreign_keys = OFF; BEGIN;");
for (const { name } of db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()) {
  if (!contentTables.has(name)) db.exec(`DELETE FROM "${name.replaceAll('"', '""')}"`);
}
db.exec("DELETE FROM Setting WHERE key NOT LIKE 'announcement.%' AND key NOT LIKE 'stats.%';");
const password = crypto.randomBytes(24).toString("base64url") + "!9a";
const adminRole = db.prepare("SELECT id FROM Role WHERE key = 'admin'").get();
if (!adminRole) throw new Error("Admin role is missing.");
db.prepare("INSERT INTO User (id,email,passwordHash,fullName,roleId,createdAt,updatedAt,emailVerified) VALUES (?,?,?,?,?,?,?,?)")
  .run(crypto.randomUUID(), "admin@lizartdijital.com", bcrypt.hashSync(password, 12), "Lizart Yönetici", adminRole.id, Date.now(), Date.now(), Date.now());
db.exec("COMMIT; PRAGMA foreign_keys = ON; VACUUM;");
if (db.prepare("PRAGMA foreign_key_check").all().length) throw new Error("Bootstrap has invalid references.");
db.close();
fs.mkdirSync(".deployment", { recursive: true });
fs.writeFileSync(".deployment/yonetici-erisim.txt", `Adres: https://lizartdijital.com/admin\nE-posta: admin@lizartdijital.com\nŞifre: ${password}\n`, { mode: 0o600, flag: "wx" });
console.log("Content-only bootstrap prepared. Admin credentials saved locally in .deployment/yonetici-erisim.txt.");
