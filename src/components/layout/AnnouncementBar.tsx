"use client";

import Link from "next/link";
import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "lz-duyuru-kapali";

/** Kapatma tercihini dinleyen basit bir dış depo (sessionStorage). */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => l());
}

function readDismissed(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // Depolama kapalıysa banner görünür kalır.
    return null;
  }
}

/**
 * Kapatılabilir kampanya/duyuru bandı.
 * Tercih sessionStorage'da tutulur; sunucuda daima görünür render edilir.
 */
export function AnnouncementBar({ text, href }: { text: string; href: string }) {
  const dismissed = useSyncExternalStore(
    subscribe,
    readDismissed,
    // Sunucu anlık görüntüsü: kapatılmamış kabul edilir.
    () => null,
  );

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, text);
    } catch {
      /* depolama kullanılamıyorsa tercih saklanamaz */
    }
    notify();
  }, [text]);

  if (dismissed === text) return null;

  return (
    <div className="relative bg-surface-2 text-ink-700">
      <div className="container-page flex min-h-11 items-center justify-center gap-3 py-2 text-center">
        <Link href={href} className="text-[0.8rem] font-medium hover:text-brand-300 sm:text-sm">
          {text}
          <span className="ml-2 text-brand-400" aria-hidden>
            →
          </span>
        </Link>
        <button
          type="button"
          aria-label="Duyuruyu kapat"
          onClick={dismiss}
          className="absolute right-4 grid size-7 place-items-center rounded-full text-ink-400 hover:bg-ink-800 hover:text-ink-900"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
