"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { changeLicense, removeItem, toggleItemAddOn, updateQuantity } from "@/lib/actions/cart";
import { formatPrice } from "@/lib/utils";

type AddOnOption = { id: string; name: string; price: number; extraDays: number; selected: boolean };

/** Sepetteki tek ürün satırı: lisans değişimi, ek hizmetler, adet ve silme. */
export function CartItemRow({
  itemId,
  productName,
  productSlug,
  categoryName,
  coverImage,
  basePrice,
  quantity,
  licenseId,
  licenses,
  addOns,
  lineTotal,
  deliveryDays,
}: {
  itemId: string;
  productName: string;
  productSlug: string;
  categoryName: string;
  coverImage: string;
  basePrice: number;
  quantity: number;
  licenseId: string;
  licenses: { id: string; name: string; priceDelta: number }[];
  addOns: AddOnOption[];
  lineTotal: number;
  deliveryDays: number;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showAddOns, setShowAddOns] = useState(false);
  const router = useRouter();

  function run(fn: () => Promise<{ ok: true; message?: string } | { ok: false; error: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) setError(result.error);
      router.refresh();
    });
  }

  const selectedAddOns = addOns.filter((a) => a.selected);

  return (
    <li className="flex flex-col gap-5 border-b border-ink-100 py-6 last:border-0 sm:flex-row">
      <Link href={`/urun/${productSlug}`} className="shrink-0" aria-hidden tabIndex={-1}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-50 sm:w-40">
          <Image src={coverImage} alt="" fill sizes="160px" className="object-cover" />
        </div>
      </Link>

      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-ink-400">{categoryName}</p>
            <h3 className="mt-0.5 font-semibold text-ink-900">
              <Link href={`/urun/${productSlug}`} className="hover:text-brand-700">
                {productName}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-ink-500">Ürün fiyatı: {formatPrice(basePrice)} + KDV</p>
          </div>
          <p className="text-lg font-semibold text-ink-900">{formatPrice(lineTotal)}</p>
        </div>

        {/* Lisans seçimi */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor={`lisans-${itemId}`} className="text-sm text-ink-600">
            Lisans
          </label>
          <select
            id={`lisans-${itemId}`}
            value={licenseId}
            disabled={pending}
            onChange={(e) => run(() => changeLicense(itemId, e.target.value))}
            className="h-10 rounded-xl border border-ink-200 bg-surface px-3 text-sm focus:border-brand-500 focus:outline-none"
          >
            {licenses.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
                {l.priceDelta > 0 ? ` (+${formatPrice(l.priceDelta)})` : ""}
              </option>
            ))}
          </select>

          <label htmlFor={`adet-${itemId}`} className="ml-2 text-sm text-ink-600">
            Adet
          </label>
          <input
            id={`adet-${itemId}`}
            type="number"
            min={1}
            max={20}
            defaultValue={quantity}
            disabled={pending}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (value !== quantity) run(() => updateQuantity(itemId, value));
            }}
            className="h-10 w-20 rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Ek hizmetler */}
        {addOns.length > 0 && (
          <div className="mt-4">
            {selectedAddOns.length > 0 && (
              <ul className="mb-2 space-y-1 text-sm text-ink-600">
                {selectedAddOns.map((a) => (
                  <li key={a.id} className="flex justify-between gap-3">
                    <span>+ {a.name}</span>
                    <span>{formatPrice(a.price)}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => setShowAddOns((v) => !v)}
              aria-expanded={showAddOns}
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              {showAddOns ? "Ek hizmetleri gizle" : `Ek hizmetleri düzenle (${addOns.length} seçenek)`}
            </button>

            {showAddOns && (
              <div className="mt-3 max-h-64 space-y-1 overflow-y-auto rounded-2xl border border-ink-100 bg-surface-2 p-3">
                {addOns.map((a) => (
                  <label key={a.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface">
                    <input
                      type="checkbox"
                      checked={a.selected}
                      disabled={pending}
                      onChange={() => run(() => toggleItemAddOn(itemId, a.id))}
                      className="size-4 accent-[var(--color-brand-600)]"
                    />
                    <span className="flex-1 text-ink-700">{a.name}</span>
                    <span className="text-ink-600">+{formatPrice(a.price)}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="mt-3 text-xs text-ink-500">Tahmini teslim: {deliveryDays} iş günü</p>

        {error && (
          <p role="alert" className="mt-2 text-sm text-[color:var(--color-accent-sale)]">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => removeItem(itemId))}
            className="text-ink-500 hover:text-[color:var(--color-accent-sale)]"
          >
            Ürünü sil
          </button>
          <Link href={`/urun/${productSlug}`} className="text-ink-500 hover:text-ink-800">
            Ürünü incele
          </Link>
        </div>
      </div>
    </li>
  );
}
