"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Result = { ok: true; message?: string; slug?: string } | { ok: false; error: string };

/**
 * Yönetim panelinde tekrar eden işlem butonu.
 * Sunucu işlemini çağırır, sonucu gösterir ve sayfayı tazeler.
 */
export function ActionButton({
  action,
  label,
  pendingLabel = "İşleniyor…",
  variant = "outline",
  confirmText,
  className,
  buttonClassName,
  size = "md",
  icon,
}: {
  action: () => Promise<Result>;
  label: string;
  pendingLabel?: string;
  variant?: "primary" | "outline" | "danger" | "soft" | "warning";
  confirmText?: string;
  className?: string;
  buttonClassName?: string;
  size?: "xs" | "sm" | "md";
  icon?: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<Result | null>(null);
  const router = useRouter();

  const variantStyles = {
    primary: "bg-[#223d26] text-white hover:bg-[#2b4c30] shadow-2xs border border-transparent active:scale-[0.98]",
    outline: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs",
    danger: "border border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100/80 hover:border-rose-300 shadow-2xs",
    soft: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent",
    warning: "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 shadow-2xs",
  };

  const sizeStyles = {
    xs: "h-7 px-2 text-[11px] font-semibold rounded-lg gap-1",
    sm: "h-8.5 px-3 text-xs font-semibold rounded-xl gap-1.5",
    md: "h-10 px-4 text-sm font-semibold rounded-xl gap-2",
  };

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirmText && !window.confirm(confirmText)) return;
          startTransition(async () => {
            const result = await action();
            setMessage(result);
            if (result.ok) router.refresh();
          });
        }}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition disabled:opacity-60 cursor-pointer select-none whitespace-nowrap",
          sizeStyles[size],
          variantStyles[variant],
          buttonClassName,
        )}
      >
        {pending ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{pendingLabel}</span>
          </span>
        ) : (
          <>
            {icon}
            <span>{label}</span>
          </>
        )}
      </button>
      {message && (
        <span
          aria-live="polite"
          className={cn(
            "text-xs font-semibold whitespace-nowrap",
            message.ok ? "text-[#223d26]" : "text-rose-600",
          )}
        >
          {message.ok ? message.message : message.error}
        </span>
      )}
    </span>
  );
}

/** Seçim kutusuyla durum değiştirme. */
export function StatusSelect({
  value,
  options,
  action,
  label,
  className,
  selectClassName,
}: {
  value: string;
  options: { value: string; label: string }[];
  action: (next: string) => Promise<Result>;
  label: string;
  className?: string;
  selectClassName?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<Result | null>(null);
  const router = useRouter();

  return (
    <span className={cn("inline-flex flex-col gap-1", className)}>
      <label className="sr-only">{label}</label>
      <select
        value={value}
        disabled={pending}
        onChange={(e) =>
          startTransition(async () => {
            const result = await action(e.target.value);
            setMessage(result);
            if (result.ok) router.refresh();
          })
        }
        aria-label={label}
        className={cn(
          "h-8.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-2xs outline-none transition focus:border-[#223d26] focus:ring-2 focus:ring-[#223d26]/10 disabled:opacity-60 cursor-pointer hover:border-slate-300",
          selectClassName
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {message && !message.ok && (
        <span className="text-xs text-rose-600">{message.error}</span>
      )}
    </span>
  );
}

/** Form gönderimi için ortak sarmalayıcı. */
export function AdminForm({
  action,
  children,
  submitLabel,
  className,
  redirectTo,
  onSuccess,
  cancelHref,
  onSubmit,
}: {
  action: (formData: FormData) => Promise<Result>;
  children: ReactNode;
  submitLabel: string;
  className?: string;
  redirectTo?: string;
  onSuccess?: (result: Result) => void;
  cancelHref?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<Result | null>(null);
  const router = useRouter();

  return (
    <form
      className={className}
      onSubmit={onSubmit}
      action={(formData) =>
        startTransition(async () => {
          const result = await action(formData);
          setMessage(result);
          if (result.ok) {
            if (onSuccess) onSuccess(result);
            if (redirectTo) {
              const target =
                typeof redirectTo === "string" && redirectTo.includes("[slug]") && result.slug
                  ? redirectTo.replace("[slug]", result.slug)
                  : redirectTo;
              router.push(target);
              router.refresh();
            } else {
              router.refresh();
            }
          } else {
            alert(result.error || "İşlem kaydedilemedi.");
          }
        })
      }
    >
      {children}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1f7a68] px-8 text-sm font-black text-white shadow-sm transition hover:bg-[#176956] disabled:opacity-60 cursor-pointer"
          >
            {pending ? "Kaydediliyor…" : submitLabel}
          </button>
          {cancelHref && (
            <a
              href={cancelHref}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
            >
              Vazgeç
            </a>
          )}
        </div>
        {message && (
          <p
            aria-live="polite"
            className={cn(
              "text-sm font-black",
              message.ok ? "text-[#1f7a68]" : "text-red-600",
            )}
          >
            {message.ok ? message.message : message.error}
          </p>
        )}
      </div>
    </form>
  );
}

export type AdminTableHeader =
  | string
  | {
      label: string;
      align?: "left" | "center" | "right";
      className?: string;
      width?: string;
    };

/** Yönetim tabloları için ortak kabuk. */
export function AdminTable({
  headers,
  children,
  minWidth = "min-w-[56rem]",
  className,
}: {
  headers: AdminTableHeader[];
  children: ReactNode;
  minWidth?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs", className)}>
      <div className="overflow-x-auto">
        <table className={cn("w-full text-[0.9375rem]", minWidth)}>
          <thead className="bg-[#f8f9fc] border-b border-slate-200">
            <tr>
              {headers.map((h, i) => {
                const isObj = typeof h === "object";
                const label = isObj ? h.label : h;
                const align = isObj
                  ? h.align ?? "left"
                  : label.toLowerCase() === "işlemler" || label.toLowerCase() === "aksiyon" || i === headers.length - 1
                  ? "right"
                  : "left";
                const customClass = isObj ? h.className : "";
                const width = isObj ? h.width : undefined;

                return (
                  <th
                    key={label || i}
                    scope="col"
                    style={width ? { width } : undefined}
                    className={cn(
                      "px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 select-none whitespace-nowrap",
                      align === "right" && "text-right",
                      align === "center" && "text-center",
                      align === "left" && "text-left",
                      customClass,
                    )}
                  >
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-900">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
