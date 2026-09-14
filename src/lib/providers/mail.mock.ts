import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { MailProvider, MailMessage } from "./types";

/**
 * Geliştirme e-posta sağlayıcısı: mesajı göndermek yerine
 * .mail-outbox klasörüne .html olarak yazar ve konsola bildirir.
 * Gerçek servise geçiş: aynı arayüzü uygulayan mail.resend.ts / mail.smtp.ts yazılır.
 */
export class MockMailProvider implements MailProvider {
  readonly name = "mock";

  async send(message: MailMessage) {
    const id = crypto.randomBytes(6).toString("hex");
    const dir = path.join(process.cwd(), ".mail-outbox");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}-${id}.html`);
    await fs.writeFile(
      file,
      `<!-- Alıcı: ${message.to} | Konu: ${message.subject} -->\n${message.html}`,
      "utf8",
    );
    console.info(`[mail:mock] "${message.subject}" → ${message.to} (${file})`);
    return { id };
  }
}
