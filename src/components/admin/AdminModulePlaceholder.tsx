import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";

export function AdminModulePlaceholder({
  eyebrow,
  title,
  description,
  features,
  primaryHref = "/admin",
  primaryLabel = "Panele dön",
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_20rem] lg:p-8">
          <div>
            <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              {eyebrow}
            </span>
            <h1 className="mt-3 max-w-3xl text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-700">
              {description}
            </p>
            <Link
              href={primaryHref.replace(/^\/yonetim/, "/admin")}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-2xl bg-[#1f7a68] px-6 text-sm font-black text-white shadow-md transition hover:bg-[#176956]"
            >
              {primaryLabel}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
            <div className="flex items-center gap-2.5 text-[#1f7a68]">
              <Clock3 size={24} className="stroke-[2.5]" />
              <span className="text-xs font-black uppercase tracking-wider">Planlandı</span>
            </div>
            <p className="mt-3 text-xl font-black text-slate-950">Modül Aktif</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
              Bu ekran admin mimarisine bağlandı. CRUD akışları ve API entegrasyonları hazır veri modeline göre doğrudan bağlanabilir.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_15px_40px_-30px_rgb(15_23_42/.3)]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#1f7a68]/10 text-[#1f7a68]">
              <CheckCircle2 size={20} className="stroke-[2.5]" />
            </span>
            <p className="text-sm font-black leading-6 text-slate-950">{feature}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
