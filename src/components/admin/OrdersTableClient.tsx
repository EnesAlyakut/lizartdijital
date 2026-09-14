"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { AdminTable } from "@/components/admin/ui";
import { EmptyState } from "@/components/ui";
import { OrderStatusControl, ConfirmTransferButton } from "@/components/admin/OrderControls";
import { OrderDetailModal, type OrderDetailData } from "@/components/admin/OrderDetailModal";
import { Eye, MessageCircle, Phone, Sparkles, CheckCircle2, Clock } from "lucide-react";

export function OrdersTableClient({
  initialOrders,
  filterStatus,
}: {
  initialOrders: OrderDetailData[];
  filterStatus?: string;
}) {
  const [orders, setOrders] = useState<OrderDetailData[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (order: OrderDetailData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <>
      {orders.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title="Henüz sipariş kaydı bulunmuyor"
            description="Canlı sipariş akışı başladığında tüm yeni siparişler detaylarıyla birlikte anlık olarak burada listelenecektir."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <AdminTable
            headers={[
              "Sipariş No",
              "Müşteri Bilgisi",
              "Satın Alınanlar & Ek Opsiyonlar",
              "Ödeme & Tutar",
              "Tarih",
              "Sipariş Durumu",
              "İşlem",
            ]}
          >
            {orders.map((order) => {
              const isBankTransfer = order.payments.some((p) => p.provider === "havale");
              const cleanPhone = order.phone.replace(/[^0-9]/g, "");
              const waLink = `https://wa.me/${cleanPhone.startsWith("0") ? "9" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                `Merhaba ${order.fullName}, Lizart Dijital'den #${order.orderNumber} numaralı siparişiniz hakkında ulaşıyorum.`
              )}`;

              return (
                <tr
                  key={order.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/90 transition group cursor-pointer"
                  onClick={(e) => {
                    // Don't trigger modal if clicking interactive controls inside row
                    const target = e.target as HTMLElement;
                    if (target.closest("a") || target.closest("button") || target.closest("select") || target.closest("input")) {
                      return;
                    }
                    handleOpenDetail(order);
                  }}
                >
                  {/* Sipariş No */}
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(order)}
                      className="group inline-flex flex-col text-left cursor-pointer"
                    >
                      <span className="font-mono text-sm font-bold text-[#223d26] group-hover:underline">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {order.items.length} Kalem
                      </span>
                    </button>
                  </td>

                  {/* Müşteri Bilgisi */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{order.fullName}</span>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
                        {order.customerType === "kurumsal" ? "Kurumsal" : "Bireysel"}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <a
                        href={`tel:${order.phone}`}
                        className="text-slate-600 hover:text-[#223d26] font-medium inline-flex items-center gap-1 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={12} className="text-slate-400" />
                        {order.phone}
                      </a>
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
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500 font-normal">{order.email}</p>
                    {order.billingCity && (
                      <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                        📍 {order.billingCity} {order.billingDistrict ? `/ ${order.billingDistrict}` : ""}
                      </p>
                    )}
                  </td>

                  {/* Satın Alınanlar & Ek Opsiyonlar */}
                  <td className="max-w-72 px-5 py-3.5">
                    <div className="space-y-1.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-xs">
                          <p className="font-semibold text-slate-900">
                            {item.productName}
                            <span className="ml-1 text-[11px] font-medium text-[#223d26]">
                              ({item.licenseName})
                            </span>
                          </p>

                          {/* Ek Hizmetler */}
                          {item.addOns && item.addOns.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.addOns.map((addon) => (
                                <span
                                  key={addon.id}
                                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200/60"
                                >
                                  <Sparkles size={10} className="text-slate-500" />
                                  {addon.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Ödeme & Tutar */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">{formatPrice(order.total)}</p>
                    <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {isBankTransfer ? "Havale / EFT" : "Kredi Kartı"}
                    </span>
                  </td>

                  {/* Tarih */}
                  <td className="px-5 py-3.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* Sipariş Durumu */}
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <OrderStatusControl
                      orderId={order.id}
                      status={order.status}
                    />
                  </td>

                  {/* İşlem */}
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      {order.status === "bekliyor" && isBankTransfer && (
                        <ConfirmTransferButton orderId={order.id} />
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] cursor-pointer"
                        title="Sipariş detaylarını incele"
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

      {/* Modal for detailed inspection */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
        onStatusChanged={handleStatusChange}
      />
    </>
  );
}
