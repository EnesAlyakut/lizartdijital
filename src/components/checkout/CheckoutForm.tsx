"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitCheckout } from "@/lib/actions/checkout";
import { cn } from "@/lib/utils";

/**
 * Ödeme formu. Alan doğrulaması hem tarayıcıda (hızlı geri bildirim)
 * hem de sunucuda (güvenlik) yapılır; sunucu doğrulaması esastır.
 */
export function CheckoutForm() {
  const [customerType, setCustomerType] = useState<"bireysel" | "kurumsal">("bireysel");
  const [paymentMethod, setPaymentMethod] = useState<"kart" | "havale">("kart");

  return (
    <form action={submitCheckout} className="space-y-8">
      {/* Müşteri tipi */}
      <fieldset className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
        <legend className="px-2 text-sm font-semibold text-ink-900">Müşteri tipi</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(["bireysel", "kurumsal"] as const).map((type) => (
            <label
              key={type}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm transition-colors",
                customerType === type ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:border-ink-300",
              )}
            >
              <input
                type="radio"
                name="customerType"
                value={type}
                checked={customerType === type}
                onChange={() => setCustomerType(type)}
                className="size-4 accent-[var(--color-brand-600)]"
              />
              <span className="font-medium text-ink-900">
                {type === "bireysel" ? "Bireysel" : "Kurumsal"}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50/80 p-3 text-xs text-brand-900 border border-brand-200">
          <span className="text-base">📞</span>
          <span>
            <strong>Hesap açmanıza gerek yoktur:</strong> Siparişiniz oluşturulduğunda bilgileriniz doğrudan yetkili ekibimize iletilir ve sizi arayarak veya WhatsApp/SMS ile ulaşarak tüm süreci başlatırız.
          </span>
        </div>
      </fieldset>

      {/* İletişim ve fatura */}
      <fieldset className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
        <legend className="px-2 text-sm font-semibold text-ink-900">İletişim & Fatura Bilgileri</legend>
        <p className="mt-1 text-xs text-ink-500">
          Size telefon ve mesaj yoluyla ulaşabilmemiz için lütfen iletişim bilgilerinizi eksiksiz giriniz.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Ad soyad" name="fullName" autoComplete="name" required />
          <Field label="Telefon numarası" name="phone" type="tel" autoComplete="tel" required />
          <Field label="E-posta adresi" name="email" type="email" autoComplete="email" required />
          {customerType === "kurumsal" && (
            <>
              <Field label="Firma adı" name="companyName" autoComplete="organization" required />
              <Field label="Vergi dairesi" name="taxOffice" />
              <Field label="Vergi numarası" name="taxNumber" required />
            </>
          )}
          <Field label="İl" name="billingCity" autoComplete="address-level1" required />
          <Field label="İlçe" name="billingDistrict" autoComplete="address-level2" required />
          <Field label="Adres" name="billingLine1" autoComplete="street-address" required className="sm:col-span-2" />
        </div>
      </fieldset>

      {/* Ödeme yöntemi */}
      <fieldset className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
        <legend className="px-2 text-sm font-semibold text-ink-900">Ödeme yöntemi</legend>
        <div className="mt-2 space-y-3">
          <label
            className={cn(
              "flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors",
              paymentMethod === "kart" ? "border-brand-500 bg-brand-50" : "border-ink-200",
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="kart"
              checked={paymentMethod === "kart"}
              onChange={() => setPaymentMethod("kart")}
              className="mt-1 size-4 accent-[var(--color-brand-600)]"
            />
            <span>
              <span className="block font-medium text-ink-900">Kredi / banka kartı</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-500">
                Ödeme, lisanslı ödeme kuruluşunun güvenli sayfasında tamamlanır. Kart bilgileriniz
                sistemimize hiç gelmez. Kartınıza ve tutara bağlı taksit seçenekleri ödeme adımında görünür.
              </span>
            </span>
          </label>

          <label
            className={cn(
              "flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors",
              paymentMethod === "havale" ? "border-brand-500 bg-brand-50" : "border-ink-200",
            )}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="havale"
              checked={paymentMethod === "havale"}
              onChange={() => setPaymentMethod("havale")}
              className="mt-1 size-4 accent-[var(--color-brand-600)]"
            />
            <span>
              <span className="block font-medium text-ink-900">Havale / EFT</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-500">
                Sipariş oluşturulduktan sonra banka bilgileri gösterilir. Ödeme onaylandığında teslimat
                yapılır; bu genellikle aynı iş günü içinde tamamlanır.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      {/* Not ve onaylar */}
      <fieldset className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
        <legend className="px-2 text-sm font-semibold text-ink-900">Sipariş notu ve onaylar</legend>

        <label htmlFor="note" className="mt-2 block text-sm text-ink-700">
          Sipariş notu (isteğe bağlı)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={1000}
          placeholder="Kurulum tercihleri, domain bilgisi veya özel talepleriniz…"
          className="mt-1.5 w-full rounded-2xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
        />

        <div className="mt-5 space-y-3 text-sm">
          <label className="flex cursor-pointer gap-3">
            <input type="checkbox" name="distanceSales" required className="mt-0.5 size-4 accent-[var(--color-brand-600)]" />
            <span className="text-ink-600">
              <Link href="/kurumsal/mesafeli-satis-sozlesmesi" className="text-brand-700 underline" target="_blank">
                Mesafeli satış sözleşmesi
              </Link>{" "}
              ve{" "}
              <Link href="/kurumsal/on-bilgilendirme-formu" className="text-brand-700 underline" target="_blank">
                ön bilgilendirme formu
              </Link>
              nu okudum, onaylıyorum.
            </span>
          </label>
          <label className="flex cursor-pointer gap-3">
            <input type="checkbox" name="terms" required className="mt-0.5 size-4 accent-[var(--color-brand-600)]" />
            <span className="text-ink-600">
              Dijital ürünlerde ifaya başlandıktan sonra{" "}
              <Link href="/kurumsal/iptal-ve-iade-politikasi" className="text-brand-700 underline" target="_blank">
                cayma hakkının kullanılamayacağını
              </Link>{" "}
              ve{" "}
              <Link href="/kurumsal/lisans-sozlesmesi" className="text-brand-700 underline" target="_blank">
                lisans koşullarını
              </Link>{" "}
              kabul ediyorum.
            </span>
          </label>
        </div>
      </fieldset>

      <SubmitButton method={paymentMethod} />
    </form>
  );
}

function SubmitButton({ method }: { method: "kart" | "havale" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-14 w-full rounded-full bg-brand-500 text-base font-semibold text-canvas transition-colors hover:bg-brand-400 disabled:opacity-60"
    >
      {pending
        ? "Sipariş oluşturuluyor…"
        : method === "kart"
          ? "Ödemeye geç"
          : "Siparişi oluştur ve banka bilgilerini gör"}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm text-ink-700">
        {label}
        {required && <span className="ml-0.5 text-[color:var(--color-accent-sale)]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </div>
  );
}
