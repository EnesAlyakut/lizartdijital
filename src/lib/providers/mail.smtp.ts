import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { MailProvider, MailMessage } from "./types";

/**
 * SMTP tabanlı kurumsal e-posta sağlayıcısı.
 * SMTP bilgileri .env içinde tanımlıysa gerçek e-posta gönderir;
 * tanımlı değilse güvenle .mail-outbox klasörüne yazar.
 */
export class SmtpMailProvider implements MailProvider {
  readonly name = "smtp";
  private transporter: Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      const port = Number(process.env.SMTP_PORT) || 465;
      const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    }
  }

  async send(message: MailMessage): Promise<{ id: string }> {
    const fromAddress =
      process.env.SMTP_FROM ?? `"Lizart Dijital" <${process.env.SMTP_USER ?? "info@lizartdijital.com"}>`;

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text,
        });
        console.info(`[mail:smtp] Gönderildi: "${message.subject}" → ${message.to} (MessageId: ${info.messageId})`);
        return { id: info.messageId };
      } catch (error) {
        console.error("[mail:smtp] SMTP gönderim hatası:", error);
        // Fallback olarak yerel outbox'a da yaz
      }
    }

    // SMTP yapılandırılmamışsa veya hata oluştuysa yerel kayıt tut
    const id = crypto.randomBytes(6).toString("hex");
    const dir = path.join(process.cwd(), ".mail-outbox");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${Date.now()}-${id}.html`);
    await fs.writeFile(
      file,
      `<!-- Alıcı: ${message.to} | Konu: ${message.subject} -->\n${message.html}`,
      "utf8",
    );
    console.info(`[mail:outbox] "${message.subject}" → ${message.to} (${file})`);
    return { id };
  }
}
