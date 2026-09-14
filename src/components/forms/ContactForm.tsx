"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { submitContactForm } from "@/lib/actions/marketing";

const DEPARTMENTS = [
  { value: "satis", label: "Satış ve ürün soruları" },
  { value: "destek", label: "Teknik destek" },
  { value: "proje", label: "Proje ve teklif" },
  { value: "kurumsal", label: "Kurumsal / iş birliği" },
];

/** İletişim formu. Departman seçimine göre talep ilgili ekibe iletilir. */
export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  return (
    <form
      className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6 sm:p-8"
      action={(formData) =>
        startTransition(async () => {
          const result = await submitContactForm(formData);
          setMessage(
            result.ok
              ? { type: "ok", text: result.message ?? "Mesajınız iletildi." }
              : { type: "error", text: result.error },
          );
        })
      }
    >
      <h2 className="text-lg font-semibold text-ink-900">Bize yazın</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Ad soyad" name="fullName" autoComplete="name" required />
        <Field label="E-posta" name="email" type="email" autoComplete="email" required />
        <Field label="Telefon (isteğe bağlı)" name="phone" type="tel" autoComplete="tel" />
        <div>
          <label htmlFor="department" className="block text-sm text-ink-700">
            Departman<span className="ml-0.5 text-[color:var(--color-accent-sale)]">*</span>
          </label>
          <select
            id="department"
            name="department"
            required
            defaultValue="satis"
            className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Konu" name="subject" required className="sm:col-span-2" />
      </div>

      <div className="mt-4">
        <label htmlFor="body" className="block text-sm text-ink-700">
          Mesajınız<span className="ml-0.5 text-[color:var(--color-accent-sale)]">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={6}
          required
          maxLength={4000}
          className="mt-1.5 w-full rounded-2xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
      </div>

      <label className="mt-5 flex cursor-pointer gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-0.5 size-4 accent-[var(--color-brand-600)]" />
        <span className="text-ink-600">
          <Link href="/kurumsal/kvkk-aydinlatma-metni" className="text-brand-700 underline" target="_blank">
            KVKK aydınlatma metnini
          </Link>{" "}
          okudum. Bilgilerimin talebimin değerlendirilmesi amacıyla işlenmesini kabul ediyorum.
        </span>
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-full bg-brand-500 px-8 font-semibold text-canvas transition-colors hover:bg-brand-400 disabled:opacity-60"
        >
          {pending ? "Gönderiliyor…" : "Mesajı gönder"}
        </button>
        {message && (
          <p
            aria-live="polite"
            className={`text-sm ${message.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
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
