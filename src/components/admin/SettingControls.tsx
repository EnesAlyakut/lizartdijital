"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSetting } from "@/lib/actions/admin";

/** Tek bir ayar satırı: değeri düzenler ve kaydeder. */
export function SettingRow({
  settingKey,
  label,
  hint,
  value,
}: {
  settingKey: string;
  label: string;
  hint?: string;
  value: string;
}) {
  const [current, setCurrent] = useState(value);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const changed = current !== value;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <label htmlFor={settingKey} className="block text-sm font-black text-slate-950">
        {label}
      </label>
      <div className="mt-2.5 flex flex-wrap gap-2.5">
        <input
          id={settingKey}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="h-11 w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none"
        />
        <button
          type="button"
          disabled={pending || !changed}
          onClick={() =>
            startTransition(async () => {
              const result = await updateSetting(settingKey, current);
              setMessage(result.ok ? (result.message ?? "Kaydedildi.") : result.error);
              if (result.ok) router.refresh();
            })
          }
          className="h-11 shrink-0 rounded-xl bg-[#1f7a68] px-6 text-sm font-black text-white shadow-sm hover:bg-[#176956] disabled:opacity-40 transition"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {hint && <p className="text-xs font-semibold text-slate-600">{hint}</p>}
        <span className="font-mono text-xs font-bold text-slate-400">({settingKey})</span>
        {message && (
          <p aria-live="polite" className="text-xs font-black text-[#1f7a68]">
            ✓ {message}
          </p>
        )}
      </div>
    </div>
  );
}
