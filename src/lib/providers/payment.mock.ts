import crypto from "node:crypto";
import type {
  PaymentInitInput,
  PaymentInitResult,
  PaymentProvider,
  PaymentVerifyResult,
} from "./types";

/**
 * Geliştirme ortamı ödeme sağlayıcısı.
 * Gerçek kart işlemi yapmaz; imzalı bir callback üreterek gerçek akışın
 * (init → 3D sayfası → imzalı webhook → sipariş güncelleme) birebir aynısını simüle eder.
 *
 * Gerçek sağlayıcıya geçiş: aynı arayüzü uygulayan payment.iyzico.ts / payment.paytr.ts
 * dosyasını yazıp PAYMENT_PROVIDER ortam değişkenini değiştirmek yeterlidir.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  private get secret() {
    return process.env.PAYMENT_WEBHOOK_SECRET ?? "dev-payment-secret";
  }

  async init(input: PaymentInitInput): Promise<PaymentInitResult> {
    const providerRef = `mock_${crypto.randomBytes(8).toString("hex")}`;
    const params = new URLSearchParams({
      ref: providerRef,
      orderId: input.orderId,
      amount: String(input.amount),
      callback: input.callbackUrl,
      installment: String(input.installment ?? 1),
    });
    return {
      providerRef,
      // Sahte 3D Secure sayfası — gerçek sağlayıcıda bankanın adresi döner.
      redirectUrl: `/odeme/simulasyon?${params.toString()}`,
    };
  }

  /** Mock sağlayıcıda webhook imzası HMAC-SHA256 ile üretilir. */
  sign(payload: Record<string, unknown>): string {
    return crypto
      .createHmac("sha256", this.secret)
      .update(JSON.stringify(payload))
      .digest("hex");
  }

  async verify(payload: unknown, signature: string | null): Promise<PaymentVerifyResult> {
    if (!signature) throw new Error("Ödeme bildirimi imzasız geldi.");
    const body = payload as {
      ref: string;
      orderId: string;
      amount: number;
      status: string;
      installment?: number;
    };
    const expected = this.sign(body as unknown as Record<string, unknown>);
    // Zamanlama saldırılarına karşı sabit süreli karşılaştırma
    const ok =
      expected.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!ok) throw new Error("Ödeme bildirimi imzası doğrulanamadı.");

    return {
      providerRef: body.ref,
      orderId: body.orderId,
      status: body.status === "basarili" ? "basarili" : "basarisiz",
      amount: body.amount,
      installment: body.installment ?? 1,
      rawEvent: { ref: body.ref, status: body.status, amount: body.amount },
    };
  }
}
