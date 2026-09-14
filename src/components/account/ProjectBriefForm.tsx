"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProjectBrief } from "@/lib/actions/account";

const FIELDS = [
  { name: "domain", label: "Alan adı (domain)", placeholder: "ornek.com" },
  { name: "hosting", label: "Hosting bilgisi", placeholder: "Sağlayıcı adı veya panel adresi" },
  { name: "brandName", label: "Marka adı", placeholder: "Firmanızın kullanılacak adı" },
  { name: "brandColors", label: "Kurumsal renkler", placeholder: "Örn. #0A994C, #12171A" },
  { name: "contactInfo", label: "İletişim bilgileri", placeholder: "Telefon, e-posta, adres", textarea: true },
  { name: "socialLinks", label: "Sosyal medya bağlantıları", placeholder: "Instagram, LinkedIn…", textarea: true },
  { name: "contentNotes", label: "Ürün / hizmet içerikleri", placeholder: "Siteye girilecek metinler, ürün listesi…", textarea: true },
  { name: "specialRequests", label: "Özel talepler", placeholder: "Eklenmesini istediğiniz özel notlar", textarea: true },
] as const;

/**
 * Kurulum içeren siparişlerde müşteriden alınan bilgiler.
 * Dosya yükleme, dosyaların güvenli saklanması gerektiği için destek talebi
 * üzerinden yürütülür; form burada yalnızca metin bilgisi toplar.
 */
export function ProjectBriefForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial: Record<string, string>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const router = useRouter();

  return (
    <form
      className="mt-4"
      action={(formData) =>
        startTransition(async () => {
          const result = await saveProjectBrief(projectId, formData);
          setMessage(
            result.ok
              ? { type: "ok", text: result.message ?? "Kaydedildi." }
              : { type: "error", text: result.error },
          );
          if (result.ok) router.refresh();
        })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className={"textarea" in field && field.textarea ? "sm:col-span-2" : undefined}>
            <label htmlFor={`${projectId}-${field.name}`} className="block text-sm text-ink-700">
              {field.label}
            </label>
            {"textarea" in field && field.textarea ? (
              <textarea
                id={`${projectId}-${field.name}`}
                name={field.name}
                rows={3}
                defaultValue={initial[field.name] ?? ""}
                placeholder={field.placeholder}
                className="mt-1.5 w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
              />
            ) : (
              <input
                id={`${projectId}-${field.name}`}
                name={field.name}
                defaultValue={initial[field.name] ?? ""}
                placeholder={field.placeholder}
                className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-500">
        Logo ve diğer dosyalarınızı, güvenli şekilde iletmek için{" "}
        <a href="/hesabim/destek" className="text-brand-700 underline">
          destek talebi
        </a>{" "}
        üzerinden gönderebilirsiniz.
      </p>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-brand-500 px-6 text-sm font-semibold text-canvas hover:bg-brand-400 disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Bilgileri kaydet"}
        </button>
        {message && (
          <p
            aria-live="polite"
            className={`text-sm ${message.type === "error" ? "text-[color:var(--color-accent-sale)]" : "text-brand-700"}`}
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
