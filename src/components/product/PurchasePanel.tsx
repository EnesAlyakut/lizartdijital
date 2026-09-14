"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_VAT_RATE, whatsappLink } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { addToCart } from "@/lib/actions/cart";
import { CheckCircle2, MessageCircle, FileText, Zap, Shield, ChevronRight, ShoppingCart } from "lucide-react";

type License = {
  id: string;
  key: string;
  name: string;
  description: string;
  priceDelta: number;
  bullets: string[];
  domainLimit: number;
  supportMonths: number;
  updateMonths: number;
  sourceIncluded: boolean;
};

type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
  extraDays: number;
  group: string;
  isRecommended: boolean;
  image?: string | null;
  gallery?: string[] | null;
};

const GROUP_LABELS: Record<string, string> = {
  kurulum: "Kurulum & Yapılandırma",
  icerik: "İçerik ve Marka Uyarlaması",
  entegrasyon: "Entegrasyonlar & Sanal POS",
  yayin: "Mağaza Yayını & Alan Adı",
  destek: "Eğitim ve Öncelikli Destek",
};

export function PurchasePanel({
  productId,
  productName,
  basePrice,
  comparePrice,
  deliveryDays,
  licenses,
  addOns,
}: {
  productId: string;
  productName: string;
  basePrice: number;
  comparePrice: number | null;
  deliveryDays: number;
  licenses: License[];
  addOns: AddOn[];
}) {
  const router = useRouter();
  const [licenseId, setLicenseId] = useState(licenses[0]?.id ?? "");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const license = licenses.find((l) => l.id === licenseId) ?? licenses[0];

  const handlePurchase = async () => {
    if (!license) return;
    setIsAdding(true);
    try {
      const res = await addToCart({
        productId,
        licenseId: license.id,
        addOnIds: selectedAddOns,
      });
      if (res.ok) {
        router.push("/sepet");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const { net, vat, total, days, discountPercent } = useMemo(() => {
    const addOnTotal = addOns
      .filter((a) => selectedAddOns.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0);
    const extraDays = addOns
      .filter((a) => selectedAddOns.includes(a.id))
      .reduce((max, a) => Math.max(max, a.extraDays), 0);
    const netTotal = basePrice + (license?.priceDelta ?? 0) + addOnTotal;
    const vatTotal = Math.round((netTotal * DEFAULT_VAT_RATE) / 100);
    const discount =
      comparePrice && comparePrice > basePrice
        ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
        : 0;
    return {
      net: netTotal,
      vat: vatTotal,
      total: netTotal + vatTotal,
      days: deliveryDays + extraDays,
      discountPercent: discount,
    };
  }, [addOns, selectedAddOns, basePrice, license, deliveryDays, comparePrice]);

  const groups = useMemo(() => {
    const map = new Map<string, AddOn[]>();
    for (const a of addOns) {
      const list = map.get(a.group) ?? [];
      list.push(a);
      map.set(a.group, list);
    }
    return [...map.entries()];
  }, [addOns]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl">

      {/* ── Üst Başlık ─────────────────────────────── */}
      <div className="flex items-center justify-between bg-[#0f1f17] px-6 py-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#86efac]" />
          <span className="text-xs font-bold text-white/90">
            Resmi Kurumsal Lisans & Altyapı
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/70">
          <span className="size-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          Anında Teslimat
        </span>
      </div>

      <div className="p-6 sm:p-7">

        {/* ── Fiyat Bloğu ─────────────────────────────── */}
        <div className="rounded-2xl bg-[#f8faf8] border border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Paket Bedeli
            </span>
            {discountPercent > 0 && (
              <span className="rounded-full bg-red-50 border border-red-100 px-2.5 py-0.5 text-xs font-bold text-red-500">
                %{discountPercent} İndirim
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {formatPrice(net)}
            </span>
            {comparePrice && comparePrice > basePrice && (
              <span className="text-base text-slate-300 line-through">
                {formatPrice(comparePrice + (license?.priceDelta ?? 0))}
              </span>
            )}
            <span className="text-xs font-medium text-slate-400">+ KDV</span>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-white border border-slate-200/60 px-3.5 py-2.5 text-xs shadow-sm">
            <span className="text-slate-500">KDV Dahil Toplam</span>
            <span className="font-bold text-slate-900">
              {formatPrice(total)}
              <span className="ml-1 text-[10px] font-normal text-slate-400">
                (KDV {formatPrice(vat)})
              </span>
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <CheckCircle2 size={12} className="text-[#2d5a41] shrink-0" />
            <span>
              Şirketiniz adına resmi <strong className="text-slate-700">E-Fatura</strong> düzenlenir.
            </span>
          </div>
        </div>

        {/* ── 1. Lisans Seçimi ─────────────────────────── */}
        <fieldset className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <legend className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#0f1f17] text-[10px] font-extrabold text-[#86efac]">
                1
              </span>
              Lisans Türünü Seçin
            </legend>
            <span className="text-[11px] text-slate-400">Hukuki güvenceli</span>
          </div>

          <div className="space-y-2">
            {licenses.map((l) => {
              const active = l.id === licenseId;
              const isStandard = l.key === "standart";
              return (
                <label
                  key={l.id}
                  className={cn(
                    "group relative flex cursor-pointer gap-3.5 rounded-2xl border p-4 transition-all duration-150",
                    active
                      ? "border-[#2d5a41] bg-[#f0f5f1] ring-2 ring-[#2d5a41]/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                  )}
                >
                  <input
                    type="radio"
                    name="lisans"
                    value={l.id}
                    checked={active}
                    onChange={() => setLicenseId(l.id)}
                    className="mt-1 size-4 shrink-0"
                    style={{ accentColor: "#2d5a41" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{l.name}</span>
                        {isStandard && (
                          <span className="rounded-full bg-[#dcfce7] text-[#15803d] px-2 py-0.5 text-[10px] font-bold">
                            En Çok Tercih Edilen
                          </span>
                        )}
                        {active && !isStandard && (
                          <span className="rounded-full bg-[#0f1f17] text-[#86efac] px-2 py-0.5 text-[10px] font-bold">
                            Seçildi
                          </span>
                        )}
                      </div>
                      <span className={cn("text-xs font-bold shrink-0", active ? "text-[#2d5a41]" : "text-slate-700")}>
                        {l.priceDelta === 0 ? "Pakete Dahil" : `+${formatPrice(l.priceDelta)}`}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{l.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="text-[#2d5a41]">✓</span>
                        {l.domainLimit >= 999 ? "Sınırsız Domain" : `${l.domainLimit} Domain`}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-[#2d5a41]">✓</span>
                        {l.supportMonths} Ay Ücretsiz Destek
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-[#2d5a41]">✓</span>
                        {l.updateMonths} Ay Güncelleme
                      </span>
                      {l.sourceIncluded && (
                        <span className="flex items-center gap-1 text-[#2d5a41] font-semibold">
                          <span>✓</span>
                          Açık Kaynak Kod Dahil
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* ── 2. Ek Hizmetler ──────────────────────────── */}
        {groups.length > 0 && (
          <fieldset className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <legend className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#0f1f17] text-[10px] font-extrabold text-[#86efac]">
                  2
                </span>
                Anahtar Teslim Ek Hizmetler
              </legend>
              <span className="text-[11px] text-slate-400">İsteğe Bağlı</span>
            </div>
            <p className="mb-3 text-[11px] text-slate-400">
              İhtiyaç duyduğunuz kurulum ve uyarlama hizmetlerini tek tıkla ekleyin.
            </p>

            <div className="space-y-3">
              {groups.map(([group, items]) => (
                <div key={group} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {GROUP_LABELS[group] ?? group}
                  </p>
                  <div className="space-y-1.5">
                    {items.map((a) => {
                      const isChecked = selectedAddOns.includes(a.id);
                      return (
                        <label
                          key={a.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-xl border p-2.5 text-xs transition-all",
                            isChecked
                              ? "border-[#2d5a41]/30 bg-[#f0f5f1]"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setSelectedAddOns((prev) =>
                                prev.includes(a.id)
                                  ? prev.filter((x) => x !== a.id)
                                  : [...prev, a.id]
                              )
                            }
                            className="mt-0.5 size-4 shrink-0"
                            style={{ accentColor: "#2d5a41" }}
                          />
                          {a.image && (
                            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={a.image}
                                alt={a.name}
                                className="size-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                                {a.name}
                                {a.isRecommended && (
                                  <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold">
                                    Önerilen
                                  </span>
                                )}
                              </span>
                              <span className="font-bold text-[#2d5a41] shrink-0">
                                +{formatPrice(a.price)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-slate-400 text-[11px] leading-relaxed">
                              {a.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        )}

        {/* ── Eylem Butonları ───────────────────────────── */}
        <div className="mt-6 space-y-2.5">
          {/* Satın Al / Sepete Ekle — Birincil Buton */}
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isAdding}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-[#0f1f17] px-6 py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1a3327] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/15"
          >
            <ShoppingCart size={18} className="text-[#86efac] transition-transform group-hover:scale-110" />
            <span>{isAdding ? "Sepete Ekleniyor..." : "Hemen Satın Al / Sepete Ekle"}</span>
            <ChevronRight size={16} className="text-white/40 transition-transform group-hover:translate-x-1" />
          </button>

          {/* WhatsApp — Hızlı Sipariş / İletişim */}
          <a
            href={whatsappLink(
              `Merhaba, "${productName}" hazır web sitesini (Lisans: ${license?.name}) satın almak istiyorum. Detayları görüşebilir miyiz?`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1ebd5a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#25D366]/25"
          >
            {/* Shimmer */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <svg viewBox="0 0 24 24" className="size-5 fill-white shrink-0">
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.235-.245-.587-.494-.508-.678-.517-.176-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.122 3.24 5.14 4.544.718.31 1.279.495 1.716.634.722.23 1.379.197 1.9.119.58-.088 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.2-.578-.35z" />
            </svg>
            <span>WhatsApp ile İletişime Geç</span>
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>

          {/* İletişim Formu — İkincil */}
          <a
            href="/iletisim"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:border-slate-300"
          >
            <FileText size={15} />
            <span>İletişim Formu Doldur</span>
          </a>
        </div>

        {/* ── İkincil Aksiyonlar ──────────────────────── */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <a
            href={whatsappLink(`Merhaba, "${productName}" hakkında bilgi almak istiyorum.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] py-2.5 font-semibold text-[#15803d] transition-colors hover:bg-[#dcfce7]"
          >
            <MessageCircle size={13} />
            <span>WhatsApp Destek</span>
          </a>
          <a
            href="/teklif"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            <Zap size={13} />
            <span>Özel Teklif Al</span>
          </a>
        </div>

        {/* ── Güvence Maddeleri ────────────────────────── */}
        <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
          {[
            { icon: "🛡️", text: <><strong>Resmi Satış Sözleşmesi:</strong> Lisansınız adınıza tescillenir.</> },
            { icon: "📄", text: <><strong>E-Fatura & Kurumsal Belge:</strong> Tüm ödemeler resmi faturalandırılır.</> },
            { icon: "🔒", text: <><strong>256-Bit SSL:</strong> Kart bilgileriniz şifreli işlenir, sistemde tutulmaz.</> },
          ].map(({ icon, text }, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
