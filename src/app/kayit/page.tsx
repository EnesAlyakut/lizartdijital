import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Üyelik Bilgilendirmesi",
  description: "Lizart Dijital'de üyelik zorunluluğu yoktur; siparişleriniz doğrudan müşteri temsilcimize iletilir.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="container-page flex min-h-[65vh] items-center justify-center py-16">
      <Card className="w-full max-w-lg p-8 text-center sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl text-brand-600">
          ✨
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Hesap Açmanıza Gerek Yok!
        </h1>

        <p className="mt-4 text-base leading-relaxed text-ink-600">
          Lizart Dijital&apos;de kullanıcı kaydı veya şifre oluşturma zorunluluğu bulunmamaktadır.
          İhtiyacınız olan hazır web sitesi veya dijital hizmeti doğrudan sepetinize ekleyip siparişinizi oluşturabilirsiniz.
        </p>

        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/70 p-4 text-left text-sm text-brand-900">
          <p className="font-semibold flex items-center gap-1.5">
            <span>📞</span> Siparişiniz Nasıl İlerler?
          </p>
          <p className="mt-1 text-xs text-brand-800 leading-relaxed">
            Sipariş verdiğinizde girdiğiniz iletişim bilgileri doğrudan yönetim panelimize düşer.
            Uzman müşteri temsilcimiz sizi arayarak veya WhatsApp/mesaj yoluyla ulaşarak tüm kurulum ve teslimat sürecini sizinle birlikte yürütür.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/magaza" size="lg">
            Ürünleri İncele
          </ButtonLink>
          <ButtonLink href="/hizmetler" variant="outline" size="lg">
            Hizmetlerimiz
          </ButtonLink>
        </div>

        <p className="mt-6 text-xs text-ink-400">
          Bir sorunuz mu var?{" "}
          <Link href="/iletisim" className="font-medium text-brand-700 hover:underline">
            Bize Ulaşın
          </Link>
        </p>
      </Card>
    </div>
  );
}
