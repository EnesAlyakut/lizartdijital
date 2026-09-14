import { MockPaymentProvider } from "./payment.mock";
import { MockMailProvider } from "./mail.mock";
import { SmtpMailProvider } from "./mail.smtp";
import { LocalStorageProvider } from "./storage.local";
import type { MailProvider, PaymentProvider } from "./types";

/**
 * Provider seçimi tek noktadan yapılır. Yeni bir sağlayıcı eklemek için
 * arayüzü uygulayan sınıfı yazıp aşağıdaki switch'e bir satır eklemek yeterlidir.
 */

let paymentInstance: PaymentProvider | null = null;
export function getPaymentProvider(): PaymentProvider {
  if (paymentInstance) return paymentInstance;
  switch (process.env.PAYMENT_PROVIDER ?? "mock") {
    case "mock":
    default:
      paymentInstance = new MockPaymentProvider();
  }
  return paymentInstance;
}

let mailInstance: MailProvider | null = null;
export function getMailProvider(): MailProvider {
  if (mailInstance) return mailInstance;
  const provider = process.env.MAIL_PROVIDER ?? "smtp";
  switch (provider) {
    case "mock":
      mailInstance = new MockMailProvider();
      break;
    case "smtp":
    default:
      mailInstance = new SmtpMailProvider();
      break;
  }
  return mailInstance;
}

let storageInstance: LocalStorageProvider | null = null;
export function getStorageProvider(): LocalStorageProvider {
  if (!storageInstance) storageInstance = new LocalStorageProvider();
  return storageInstance;
}

export { MockPaymentProvider, LocalStorageProvider };
