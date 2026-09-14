"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyCoupon, removeCoupon } from "@/lib/actions/cart";

/** Kupon kodu uygulama/kaldırma. Doğrulama tamamen sunucuda yapılır. */
export function CouponForm({ activeCode }: { activeCode: string | null }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (activeCode) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-brand-50 px-4 py-3 text-sm">
        <span className="text-brand-800">
          <strong className="font-semibold">{activeCode}</strong> kuponu uygulandı
        </span>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await removeCoupon();
              router.refresh();
            })
          }
          className="text-ink-500 underline hover:text-ink-800"
        >
          Kaldır
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await applyCoupon(code);
          setMessage(
            result.ok
              ? { type: "ok", text: result.message ?? "Kupon uygulandı." }
              : { type: "error", text: result.error },
          );
          if (result.ok) {
            setCode("");
            router.refresh();
          }
        });
      }}
    >
      <label htmlFor="kupon" className="text-sm font-medium text-ink-800">
        Kupon kodu
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="kupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Örn. HOSGELDIN10"
          className="h-11 w-full min-w-0 rounded-xl border border-ink-200 px-3 text-sm uppercase focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !code.trim()}
          className="h-11 shrink-0 rounded-xl border border-ink-900 px-5 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-900 hover:text-canvas disabled:opacity-50"
        >
          Uygula
        </button>
      </div>
      {message && (
        <p
          aria-live="polite"
          className={`mt-2 text-xs ${message.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
