/**
 * Üçüncü taraf servisler için soyut sözleşmeler.
 * Uygulama kodu daima bu arayüzlerle konuşur; gerçek servis yalnızca
 * ortam değişkeniyle seçilen bir implementasyondur.
 */

export type Money = number; // kuruş

export interface PaymentInitInput {
  orderId: string;
  orderNumber: string;
  amount: Money;
  email: string;
  fullName: string;
  callbackUrl: string;
  installment?: number;
}

export interface PaymentInitResult {
  /** Sağlayıcı işlem kimliği */
  providerRef: string;
  /** Kullanıcının yönlendirileceği 3D Secure / ödeme sayfası adresi */
  redirectUrl: string;
}

export interface PaymentVerifyResult {
  providerRef: string;
  orderId: string;
  status: "basarili" | "basarisiz";
  amount: Money;
  installment: number;
  /** Hassas alanlardan arındırılmış olay özeti */
  rawEvent: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly name: string;
  /** Ödeme oturumu başlatır. */
  init(input: PaymentInitInput): Promise<PaymentInitResult>;
  /**
   * Sağlayıcıdan gelen webhook/callback gövdesini imzasıyla birlikte doğrular.
   * Ödeme durumu ASLA istemciden gelen veriye bakılarak belirlenmez.
   */
  verify(payload: unknown, signature: string | null): Promise<PaymentVerifyResult>;
}

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailProvider {
  readonly name: string;
  send(message: MailMessage): Promise<{ id: string }>;
}

export interface StorageProvider {
  readonly name: string;
  /** Depolama anahtarı için süreli, imzalı indirme adresi üretir. */
  signedDownloadUrl(key: string, expiresInSeconds: number): Promise<string>;
  /** Dosya içeriğini okur (mock sağlayıcıda yerel dosya sisteminden). */
  read(key: string): Promise<{ body: Buffer; contentType: string; fileName: string }>;
}
