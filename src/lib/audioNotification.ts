"use client";

/**
 * Web Audio API kullanarak kristal netliğinde iki tonlu resepsiyon / çağrı zili sesi üretir.
 * Harici dosya indirmeye gerek kalmadan tüm tarayıcılarda anında ve yüksek sesle çalar.
 */
/**
 * Web Audio API kullanarak kristal netliğinde, hafif ve zarif bir "ting" zil sesi üretir.
 * Kulak tırmalamayacak şekilde kısık ve pürüzsüz bir desibel seviyesine ayarlanmıştır.
 */
export function playLoudBellChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const duration = 1.0;

    // Zarif, kristal "ting" çınlaması
    const oscPrimary = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Ana berrak frekans (1567.98 Hz - G6)
    oscPrimary.type = "sine";
    oscPrimary.frequency.setValueAtTime(1567.98, now);

    // Hafif üst çınlama harmonisi (3135.96 Hz - G7)
    oscHarmonic.type = "sine";
    oscHarmonic.frequency.setValueAtTime(3135.96, now);

    // Kısık, kulak yormayan hafif ses seviyesi (0.14)
    const volume = 0.14;
    gainNode.gain.setValueAtTime(volume, now);
    // Pürüzsüz sönümlenme
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscPrimary.connect(gainNode);
    oscHarmonic.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscPrimary.start(now);
    oscHarmonic.start(now);

    oscPrimary.stop(now + duration);
    oscHarmonic.stop(now + duration);
  } catch (err) {
    console.warn("Zil sesi çalınamadı:", err);
  }
}

/** Masaüstü bildirim izni ister. */
export async function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }
}

/** Masaüstü sistem bildirimi gönderir. */
export function sendDesktopNotification(title: string, body: string, url?: string) {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      const notif = new Notification(title, {
        body,
        icon: "/favicon.ico",
      });
      if (url) {
        notif.onclick = () => {
          window.focus();
          window.location.href = url;
        };
      }
    }
  }
}
