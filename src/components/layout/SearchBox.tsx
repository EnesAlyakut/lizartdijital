"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

/** Mağaza aramasına yönlendiren arama kutusu. */
export function SearchBox({
  placeholder = "Ne aramıştınız?",
  autoFocus = false,
  size = "md",
  className,
}: {
  placeholder?: string;
  autoFocus?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/magaza?q=${encodeURIComponent(q)}` : "/magaza");
  }

  return (
    <form role="search" onSubmit={onSubmit} suppressHydrationWarning className={cn("relative", className)}>
      <label htmlFor="site-arama" className="sr-only">
        Ürün ara
      </label>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        id="site-arama"
        type="search"
        name="q"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        suppressHydrationWarning
        className={cn(
          "w-full rounded-full border border-ink-200 bg-surface pl-12 pr-28 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100",
          size === "lg" ? "h-14 text-base" : "h-12 text-[0.95rem]",
        )}
      />
      <button
        type="submit"
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-ink-900 px-5 font-medium text-canvas transition-colors hover:bg-ink-800",
          size === "lg" ? "h-11 text-sm" : "h-9 text-sm",
        )}
      >
        Ara
      </button>
    </form>
  );
}
