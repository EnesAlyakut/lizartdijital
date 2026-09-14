import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn, formatPrice, discountPercent } from "@/lib/utils";

/* ------------------------------------------------------------------ Button */

type ButtonVariant = "primary" | "dark" | "outline" | "ghost" | "soft";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-soft disabled:opacity-55 disabled:pointer-events-none active:translate-y-px";

/**
 * Koyu temada kontrast, açık zeminli butonlarla sağlanır.
 * `primary` marka yeşili üzerine koyu metin kullanır; ana çağrı yeşil ışımayla öne çıkar.
 * `dark` varyantı koyu temada "açık kontrast" anlamına gelir (beyaz zemin, koyu metin).
 */
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-canvas hover:bg-brand-400 hover:-translate-y-0.5 glow-brand",
  dark: "bg-ink-900 text-canvas hover:bg-ink-800 hover:-translate-y-0.5",
  outline:
    "border border-ink-200 bg-transparent text-ink-800 hover:border-brand-500 hover:bg-brand-50 hover:text-ink-900",
  ghost: "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
  soft: "bg-brand-100 text-brand-800 hover:bg-brand-200",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], extra);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/* ------------------------------------------------------------------- Badge */

type BadgeTone = "neutral" | "brand" | "sale" | "new" | "dark" | "outline";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  brand: "bg-brand-100 text-brand-800",
  sale: "bg-[color:var(--color-accent-sale)] text-white",
  new: "bg-[color:var(--color-accent-new)] text-white",
  dark: "bg-ink-900 text-canvas",
  outline: "border border-ink-200 text-ink-600 bg-ink-50",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold leading-none tracking-wide",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Rating */

export function Rating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(value * 10) / 10;
  const label = count
    ? `5 üzerinden ${rounded} puan, ${count} değerlendirme`
    : `5 üzerinden ${rounded} puan`;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-ink-600", size === "sm" ? "text-xs" : "text-sm")}
      aria-label={label}
    >
      <span aria-hidden className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 20 20"
            className={cn(size === "sm" ? "size-3.5" : "size-4", i <= Math.round(value) ? "fill-[#f4b400]" : "fill-ink-200")}
          >
            <path d="M10 1.6l2.47 5.24 5.53.79-4 4.06.95 5.71L10 14.7l-4.95 2.7.95-5.71-4-4.06 5.53-.79z" />
          </svg>
        ))}
      </span>
      <span className="font-medium text-ink-700">{rounded.toFixed(1)}</span>
      {count !== undefined && <span className="text-ink-400">({count})</span>}
    </span>
  );
}

/* ------------------------------------------------------------------- Price */

export function Price({
  value,
  compareValue,
  size = "md",
  vatNote = true,
}: {
  value: number;
  compareValue?: number | null;
  size?: "sm" | "md" | "lg";
  vatNote?: boolean;
}) {
  const pct = discountPercent(value, compareValue);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span
        className={cn(
          "font-semibold tracking-tight text-ink-900",
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-3xl sm:text-4xl",
        )}
      >
        {formatPrice(value)}
      </span>
      {compareValue && pct ? (
        <>
          <span className="text-sm text-ink-400 line-through">{formatPrice(compareValue)}</span>
          <Badge tone="sale">%{pct} indirim</Badge>
        </>
      ) : null}
      {vatNote && <span className="text-xs text-ink-400">+ KDV</span>}
    </div>
  );
}

/* ----------------------------------------------------------------- Section */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p>
        )}
        <h2 className="text-balance-title text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl lg:text-[2.1rem]">
          {title}
        </h2>
        {description && <p className="mt-3 text-[0.975rem] leading-relaxed text-ink-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------- Cards */

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-ink-100 bg-surface shadow-[var(--shadow-card)] transition-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------- Empty state */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-ink-200 bg-surface-2 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink-800">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

/* -------------------------------------------------------------- Breadcrumb */

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-400">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="hover:text-ink-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-700">{item.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ Skeleton */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-ink-100", className)} aria-hidden />;
}
