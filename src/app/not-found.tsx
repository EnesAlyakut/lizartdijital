import Link from "next/link";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
        Aradığınız sayfayı bulamadık
      </h1>
      <p className="mt-4 max-w-lg leading-relaxed text-ink-500">
        Bağlantı taşınmış veya kaldırılmış olabilir. Aşağıdaki bölümlerden devam edebilir ya da mağazada
        arama yapabilirsiniz.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Ana sayfaya dön</ButtonLink>
        <ButtonLink href="/magaza" variant="outline">
          Mağazayı gez
        </ButtonLink>
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
        {[
          { href: "/demo-merkezi", label: "Demo Merkezi" },
          { href: "/hizmetler", label: "Hizmetler" },
          { href: "/projeler", label: "Projeler" },
          { href: "/blog", label: "Blog" },
          { href: "/sss", label: "SSS" },
          { href: "/iletisim", label: "İletişim" },
        ].map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-brand-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
