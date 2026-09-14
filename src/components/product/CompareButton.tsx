"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clearComparison, toggleComparison, toggleFavorite } from "@/lib/actions/wishlist";
import { cn } from "@/lib/utils";

/** Ürünü karşılaştırma listesine ekler/çıkarır. */
export function CompareButton({ productId, active }: { productId: string; active?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        disabled={pending}
        aria-pressed={active}
        onClick={() =>
          startTransition(async () => {
            const result = await toggleComparison(productId);
            if (!result.ok) setError(result.error);
            else {
              setError(null);
              router.refresh();
            }
          })
        }
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
          active ? "border-brand-500 bg-brand-50 text-brand-800" : "border-ink-200 text-ink-600 hover:border-ink-400",
        )}
      >
        {active ? "Karşılaştırmada" : "Karşılaştır"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-[color:var(--color-accent-sale)]">
          {error}
        </p>
      )}
    </>
  );
}

/** Favorilere ekleme/çıkarma. Giriş yoksa kullanıcı bilgilendirilir. */
export function FavoriteButton({ productId, active }: { productId: string; active?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        disabled={pending}
        aria-pressed={active}
        aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
        onClick={() =>
          startTransition(async () => {
            const result = await toggleFavorite(productId);
            if (!result.ok) setError(result.error);
            else {
              setError(null);
              router.refresh();
            }
          })
        }
        className={cn(
          "grid size-8 place-items-center rounded-full border transition-colors",
          active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-500 hover:border-ink-400",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 20s-7-4.5-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.5 12 20 12 20z" strokeLinejoin="round" />
        </svg>
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-[color:var(--color-accent-sale)]">
          {error}
        </p>
      )}
    </>
  );
}

/** Karşılaştırma listesini temizler. */
export function ClearComparisonButton() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await clearComparison();
          router.refresh();
        })
      }
      className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
    >
      {pending ? "Temizleniyor…" : "Listeyi temizle"}
    </button>
  );
}
