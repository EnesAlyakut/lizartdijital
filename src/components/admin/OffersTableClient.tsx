"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { AdminTable } from "@/components/admin/ui";
import { EmptyState } from "@/components/ui";
import { OfferStatusControl } from "@/components/admin/OfferControls";
import { OfferDetailModal, type OfferDetailData } from "@/components/admin/OfferDetailModal";
import { Building2, Eye, MessageCircle, Phone, Sparkles } from "lucide-react";

export function OffersTableClient({
  initialOffers,
  filterStatus,
}: {
  initialOffers: OfferDetailData[];
  filterStatus?: string;
}) {
  const [offers, setOffers] = useState<OfferDetailData[]>(initialOffers);
  const [selectedOffer, setSelectedOffer] = useState<OfferDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (offer: OfferDetailData) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  };

  const handleOfferUpdated = (offerId: string, updates: Partial<OfferDetailData>) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, ...updates } : o))
    );
    if (selectedOffer && selectedOffer.id === offerId) {
      setSelectedOffer((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  return (
    <>
      {offers.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Henüz teklif talebi bulunmuyor"
            description="Web siteniz üzerinden yeni bir özel proje veya paket teklif talebi iletildiğinde anlık olarak burada listelenecektir."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <AdminTable
            headers={[
              "Teklif Kodu",
              "Müşteri & Firma",
              "Talep Edilen Hizmetler",
              "Bütçe & Tutar",
              "Tarih",
              "Durum",
              "İşlem",
            ]}
          >
            {offers.map((offer) => {
              const answers = safeAnswers(offer.answers);
              const interests: string[] = Array.isArray(answers.interests)
                ? (answers.interests as string[])
                : [];
              const cleanPhone = offer.phone ? offer.phone.replace(/[^0-9]/g, "") : "";
              const waPhone = cleanPhone.startsWith("0") ? "9" + cleanPhone : cleanPhone;
              const waLink = cleanPhone
                ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
                    `Merhaba ${offer.fullName}, Lizart Dijital'den #${offer.code} kodlu özel proje teklif talebiniz hakkında iletişime geçiyorum.`
                  )}`
                : null;

              return (
                <tr
                  key={offer.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/90 transition group cursor-pointer"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("a") || target.closest("button") || target.closest("select") || target.closest("input")) {
                      return;
                    }
                    handleOpenDetail(offer);
                  }}
                >
                  {/* Teklif Kodu */}
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(offer)}
                      className="group inline-flex flex-col text-left cursor-pointer"
                    >
                      <span className="font-mono text-sm font-bold text-[#223d26] group-hover:underline">
                        #{offer.code}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Özel Proje
                      </span>
                    </button>
                  </td>

                  {/* Müşteri & Firma */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-bold text-slate-900">{offer.fullName}</p>
                    {offer.company && (
                      <p className="mt-0.5 text-xs font-medium text-slate-600 inline-flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" />
                        {offer.company}
                      </p>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      {offer.phone && (
                        <a
                          href={`tel:${offer.phone}`}
                          className="text-slate-600 hover:text-[#223d26] font-medium inline-flex items-center gap-1 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone size={12} className="text-slate-400" />
                          {offer.phone}
                        </a>
                      )}
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={12} />
                          WhatsApp
                        </a>
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500 font-normal">{offer.email}</p>
                  </td>

                  {/* Talep Edilen Hizmetler */}
                  <td className="max-w-64 px-5 py-3.5">
                    {interests.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200/60"
                          >
                            <Sparkles size={10} className="text-[#223d26]" />
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">—</span>
                    )}

                    {offer.message && (
                      <p className="mt-1.5 line-clamp-2 text-xs font-normal text-slate-500 leading-relaxed">
                        {offer.message}
                      </p>
                    )}
                  </td>

                  {/* Bütçe & Tutar */}
                  <td className="px-5 py-3.5">
                    {offer.budget && (
                      <span className="inline-block rounded-md bg-amber-50/80 border border-amber-200/70 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                        {offer.budget}
                      </span>
                    )}
                    {offer.amount ? (
                      <p className="mt-1 text-sm font-bold text-[#223d26] tracking-tight">
                        Teklif: {formatPrice(offer.amount)}
                      </p>
                    ) : null}
                  </td>

                  {/* Tarih */}
                  <td className="px-5 py-3.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {formatDate(offer.createdAt)}
                  </td>

                  {/* Durum */}
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <OfferStatusControl offerId={offer.id} status={offer.status} />
                  </td>

                  {/* İşlem */}
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(offer)}
                        className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] cursor-pointer"
                      >
                        <Eye size={13} className="text-slate-500" />
                        <span>Detaylar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </AdminTable>
        </div>
      )}

      {/* Detail Modal */}
      <OfferDetailModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        onOfferUpdated={handleOfferUpdated}
      />
    </>
  );
}

function safeAnswers(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
