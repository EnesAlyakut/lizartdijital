"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/lib/actions/marketing";
import { cn } from "@/lib/utils";

/** E-posta aboneliği formu. Kayıt sunucuda doğrulanıp veritabanına yazılır. */
export function NewsletterForm({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  return (
    <form
      className={className}
      suppressHydrationWarning
      action={(formData) =>
        startTransition(async () => {
          const result = await subscribeToNewsletter(formData);
          setMessage(
            result.ok
              ? { type: "ok", text: result.message ?? "Kaydınız alındı." }
              : { type: "error", text: result.error },
          );
        })
      }
    >
      <label htmlFor={`bulten-email-${tone}`} className="sr-only">
        E-posta adresiniz
      </label>
      {/* Dar sütunlarda (footer) alan sıkışmasın diye alan ve buton alt alta;
          geniş alanlarda yan yana durur. */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center" suppressHydrationWarning>
        <div className="relative flex-1">
          <input
            id={`bulten-email-${tone}`}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="E-posta adresinizi giriniz..."
            suppressHydrationWarning
            className={cn(
              "h-12 w-full min-w-0 rounded-xl px-4.5 text-[0.925rem] outline-none transition-all",
              tone === "dark"
                ? "border border-white/12 bg-white/[0.05] text-white placeholder:text-[#8da08c] focus:border-[#dfe9cf] focus:bg-white/[0.08] focus:ring-4 focus:ring-[#dfe9cf]/10"
                : "border border-[#b7d9c8] bg-white text-[#111411] placeholder:text-[#4c5d54] shadow-sm focus:border-[#1f7a68] focus:ring-4 focus:ring-[#9ee7c5]/30",
            )}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "h-12 shrink-0 rounded-xl px-7 text-[0.925rem] font-bold transition-all disabled:pointer-events-none disabled:opacity-60",
            tone === "dark"
              ? "border border-emerald-400/30 bg-gradient-to-r from-emerald-600 via-[#1f7a68] to-teal-700 text-white shadow-lg shadow-black/25 hover:from-emerald-500 hover:to-teal-600 active:scale-[0.99]"
              : "bg-[#1f7a68] text-white shadow-sm hover:bg-[#186454] active:scale-[0.99]",
          )}
        >
          {pending ? "Gönderiliyor…" : "Abone Ol"}
        </button>
      </div>
      <p
        aria-live="polite"
        className={cn(
          "mt-2 text-xs font-semibold",
          message?.type === "error"
            ? tone === "dark" ? "text-rose-300" : "text-[color:var(--color-accent-sale)]"
            : tone === "dark" ? "text-emerald-300" : "text-[#1f7a68]",
        )}
      >
        {message?.text ?? ""}
      </p>
      <p
        className={cn(
          "mt-2 text-xs leading-relaxed",
          tone === "dark" ? "text-[#8da08c]" : "font-bold text-[#111411]",
        )}
      >
        Kaydolarak{" "}
        <Link
          href="/kurumsal/acik-riza-metni"
          className={cn(
            "underline decoration-white/20 underline-offset-2 transition-colors",
            tone === "dark" ? "text-emerald-300 hover:text-emerald-200" : "font-semibold text-[#1f7a68] hover:text-[#111411]",
          )}
        >
          açık rıza metnini
        </Link>{" "}
        kabul etmiş olursunuz. İptal linki her bültende yer alır.
      </p>
    </form>
  );
}
