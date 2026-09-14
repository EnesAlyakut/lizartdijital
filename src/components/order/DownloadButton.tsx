"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDownloadLink } from "@/lib/actions/download";
import { Button } from "@/components/ui";

/**
 * İndirme butonu. Bağlantı her tıklamada sunucuda yeniden üretilir;
 * kalıcı ve paylaşılabilir bir dosya adresi istemciye hiç verilmez.
 */
export function DownloadButton({ downloadId, disabled }: { downloadId: string; disabled?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="text-right">
      <Button
        type="button"
        size="sm"
        disabled={disabled || pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await createDownloadLink(downloadId);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            window.location.href = result.url;
            router.refresh();
          })
        }
      >
        {disabled ? "Limit doldu" : pending ? "Hazırlanıyor…" : "İndir"}
      </Button>
      {error && (
        <p role="alert" className="mt-1.5 max-w-xs text-xs text-[color:var(--color-accent-sale)]">
          {error}
        </p>
      )}
    </div>
  );
}
