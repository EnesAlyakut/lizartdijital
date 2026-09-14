"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAddress, saveAddress } from "@/lib/actions/account";
import { Badge } from "@/components/ui";

type Address = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  line1: string;
  postalCode: string | null;
  isDefault: boolean;
};

const FIELDS = [
  { name: "title", label: "Adres başlığı", placeholder: "Ofis, Ev…" },
  { name: "fullName", label: "Ad soyad", autoComplete: "name" },
  { name: "phone", label: "Telefon", autoComplete: "tel" },
  { name: "city", label: "İl", autoComplete: "address-level1" },
  { name: "district", label: "İlçe", autoComplete: "address-level2" },
  { name: "postalCode", label: "Posta kodu (isteğe bağlı)", autoComplete: "postal-code" },
] as const;

/** Adres listesi ve yeni adres formu. */
export function AddressList({ addresses }: { addresses: Address[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const router = useRouter();

  return (
    <div className="mt-5 space-y-6">
      {addresses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-ink-900">{a.title}</p>
                {a.isDefault && <Badge tone="brand">Varsayılan</Badge>}
              </div>
              <p className="mt-2 text-sm text-ink-700">{a.fullName}</p>
              <p className="text-sm text-ink-600">{a.phone}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {a.line1}
                <br />
                {a.district} / {a.city} {a.postalCode}
              </p>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteAddress(a.id);
                    if (!result.ok) setMessage({ type: "error", text: result.error });
                    router.refresh();
                  })
                }
                className="mt-3 text-sm text-ink-500 hover:text-[color:var(--color-accent-sale)]"
              >
                Adresi sil
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <form
          className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6"
          action={(formData) =>
            startTransition(async () => {
              const result = await saveAddress(formData);
              setMessage(
                result.ok
                  ? { type: "ok", text: result.message ?? "Kaydedildi." }
                  : { type: "error", text: result.error },
              );
              if (result.ok) {
                setShowForm(false);
                router.refresh();
              }
            })
          }
        >
          <p className="font-medium text-ink-900">Yeni adres</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="block text-sm text-ink-700">
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  required={f.name !== "postalCode"}
                  placeholder={"placeholder" in f ? f.placeholder : undefined}
                  autoComplete={"autoComplete" in f ? f.autoComplete : undefined}
                  className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="line1" className="block text-sm text-ink-700">
                Adres
              </label>
              <textarea
                id="line1"
                name="line1"
                rows={2}
                required
                autoComplete="street-address"
                className="mt-1.5 w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="h-11 rounded-full bg-brand-500 px-6 text-sm font-semibold text-canvas hover:bg-brand-400 disabled:opacity-60"
            >
              {pending ? "Kaydediliyor…" : "Adresi kaydet"}
            </button>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-ink-500 hover:text-ink-800"
              >
                Vazgeç
              </button>
            )}
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
        >
          Yeni adres ekle
        </button>
      )}

      {message && (
        <p
          aria-live="polite"
          className={`text-sm ${message.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
