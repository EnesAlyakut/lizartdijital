"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addLicenseDomain, removeLicenseDomain } from "@/lib/actions/account";

/** Lisansa bağlı alan adlarını ekleyip kaldırır. */
export function DomainManager({
  licenseId,
  domains,
  limit,
}: {
  licenseId: string;
  domains: string[];
  limit: number;
}) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(action: () => Promise<{ ok: true; message?: string } | { ok: false; error: string }>) {
    startTransition(async () => {
      const result = await action();
      setMessage(
        result.ok
          ? { type: "ok", text: result.message ?? "Güncellendi." }
          : { type: "error", text: result.error },
      );
      if (result.ok) {
        setValue("");
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-4 border-t border-ink-100 pt-4">
      <p className="text-sm font-medium text-ink-800">
        Tanımlı alan adları{" "}
        <span className="font-normal text-ink-400">
          ({domains.length}/{limit >= 999 ? "∞" : limit})
        </span>
      </p>

      {domains.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {domains.map((d) => (
            <li key={d} className="flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1.5 text-sm">
              <span className="text-ink-800">{d}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() => run(() => removeLicenseDomain(licenseId, d))}
                aria-label={`${d} alan adını kaldır`}
                className="text-ink-400 hover:text-[color:var(--color-accent-sale)]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-xs text-ink-400">Henüz alan adı tanımlanmamış.</p>
      )}

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => addLicenseDomain(licenseId, value));
        }}
      >
        <label htmlFor={`domain-${licenseId}`} className="sr-only">
          Alan adı
        </label>
        <input
          id={`domain-${licenseId}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ornek.com"
          className="h-10 w-full min-w-0 rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !value.trim()}
          className="h-10 shrink-0 rounded-xl border border-ink-900 px-4 text-sm font-medium text-ink-900 hover:bg-ink-900 hover:text-canvas disabled:opacity-50"
        >
          Ekle
        </button>
      </form>

      {message && (
        <p
          aria-live="polite"
          className={`mt-2 text-xs ${message.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
