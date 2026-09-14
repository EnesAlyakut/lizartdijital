"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/actions/cart";
import { cn } from "@/lib/utils";

/**
 * Sepete ekleme butonu — animasyonlu, modern tasarım.
 */
export function AddToCartButton({
  productId,
  licenseId,
  addOnIds = [],
  label = "Satın Al",
  variant = "primary",
  size = "md",
  className,
  redirectToCart = false,
}: {
  productId: string;
  licenseId: string;
  addOnIds?: string[];
  label?: string;
  variant?: "primary" | "dark" | "outline" | "ghost" | "soft";
  size?: "sm" | "md" | "lg";
  className?: string;
  redirectToCart?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const router = useRouter();

  function handleClick() {
    if (pending) return;
    setStatus("idle");
    startTransition(async () => {
      const result = await addToCart({ productId, licenseId, addOnIds });
      if (result.ok) {
        setStatus("ok");
        router.refresh();
        if (redirectToCart) {
          router.push("/sepet");
          return;
        }
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("error");
        setErrorText(result.error);
        setTimeout(() => setStatus("idle"), 3000);
      }
    });
  }

  const isOk = status === "ok";
  const isErr = status === "error";

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || isOk}
        aria-label={label}
        className={cn(
          // Temel stil
          "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl font-bold transition-all duration-200 select-none",
          // Boyut
          size === "sm" && "h-9 px-4 text-xs",
          size === "md" && "h-11 px-5 text-sm",
          size === "lg" && "h-12 px-6 text-sm",
          // Durum renkleri
          isOk
            ? "bg-[#166534] text-white shadow-inner"
            : isErr
            ? "bg-red-600 text-white"
            : [
                "bg-[#1a3a25] text-white shadow-sm",
                "hover:bg-[#16301e] hover:-translate-y-0.5 hover:shadow-md",
                "active:translate-y-0 active:shadow-none",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0",
              ],
        )}
      >
        {/* Parlama efekti */}
        {!isOk && !isErr && (
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        )}

        {/* İçerik */}
        {pending ? (
          <>
            <svg
              className="size-3.5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Ekleniyor…</span>
          </>
        ) : isOk ? (
          <>
            <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Sepete Eklendi</span>
          </>
        ) : isErr ? (
          <span>Hata — Tekrar dene</span>
        ) : (
          <>
            {/* Sepet ikonu */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="size-3.5 transition-transform duration-200 group-hover:scale-110"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {isErr && (
        <p role="alert" className="mt-1.5 text-center text-[11px] text-red-500">
          {errorText}
        </p>
      )}

      <span aria-live="polite" className="sr-only">
        {isOk ? "Ürün sepete eklendi" : isErr ? errorText : ""}
      </span>
    </div>
  );
}
