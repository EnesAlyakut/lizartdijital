import { SITE, whatsappLink } from "@/lib/constants";

/**
 * Sayfanın sağ alt köşesinde sabit duran resmi WhatsApp çağrı butonu.
 * Tek parça, derli toplu ve kayma yapmayan modern tasarım.
 */
export function WhatsAppButton() {
  const href = whatsappLink("Merhaba, web siteniz üzerinden ulaşıyorum. Bilgi almak istiyorum.");

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp üzerinden yazın: ${SITE.phone}`}
        className="group relative flex items-center gap-2 sm:gap-3 rounded-full bg-[#2db660] hover:bg-[#29a857] p-2 sm:pl-3.5 sm:pr-5 sm:py-3 shadow-[0_8px_24px_-6px_rgba(26,158,69,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
      >
        {/* Beyaz Daire İçinde WhatsApp İkonu */}
        <div className="relative flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1a9e45] shadow-xs">
          <svg viewBox="0 0 32 32" className="size-4.5 sm:size-5 fill-current" aria-hidden="true">
            <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.2-4.4 1.2 1.2-4.3-.3-.4A11.6 11.6 0 1 1 16 27.5zm6.4-8.7c-.3-.2-2-.1-2.3-.1s-.6.2-.9.6-1 1.2-1.2 1.5-.5.3-.9.1a11.3 11.3 0 0 1-3.3-2 12.5 12.5 0 0 1-2.3-2.9c-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.6.1-.2 0-.4 0-.6s-.9-2.2-1.2-3-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5s-1.5 1.5-1.5 3.6 1.5 4.2 1.7 4.5c.3.3 3 4.6 7.4 6.4 1 .4 1.9.7 2.5.9 1.1.3 2.1.3 2.9.2.9-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6s-.3-.3-.7-.5z" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 size-2 sm:size-2.5 rounded-full bg-green-600 border-2 border-white" />
        </div>

        {/* Metin — Tek parça, mobilde temiz, masaüstünde tam metin */}
        <div className="flex flex-col text-left pr-1.5 sm:pr-0">
          <span className="hidden sm:inline text-[10px] font-semibold text-black/60 uppercase tracking-wider leading-none">
            Canlı Destek
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-black leading-tight whitespace-nowrap mt-0.5">
            WhatsApp
          </span>
        </div>
      </a>
    </div>
  );
}

