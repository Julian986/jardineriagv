import type { ReactNode } from "react";
import Image from "next/image";
import { HistoryBackLink } from "@/components/HistoryBackLink";
import { TITULO_BIODIVERSIDAD } from "@/lib/biodiversidad-titulos";

type BiodiversidadHeroProps = {
  title: string;
  subtitle?: string;
  intro?: string;
  label?: string;
  actions?: ReactNode;
};

export function BiodiversidadHero({
  title,
  subtitle,
  intro,
  label,
  actions,
}: BiodiversidadHeroProps) {
  return (
    <div className="border-b border-[#e4ead8] bg-[#2d5016] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 md:pb-14 md:pt-5">
        <div className="mb-6 flex justify-start md:mb-8">
          <HistoryBackLink
            aria-label="Volver"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
          >
            <span aria-hidden className="text-sm leading-none">
              ←
            </span>
            Volver
          </HistoryBackLink>
        </div>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          <div className="relative mx-auto h-56 w-full max-w-md shrink-0 overflow-hidden rounded-2xl md:mx-0 md:h-72 md:w-96">
            <Image
              src="/biodiversidad.webp"
              alt={TITULO_BIODIVERSIDAD}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 384px"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            {label ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {label}
              </p>
            ) : null}
            <h1 className="mt-2 text-balance text-2xl font-bold leading-snug text-[#e8b46a] md:text-3xl lg:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 text-balance text-lg font-semibold leading-snug text-white/90 md:text-xl">
                {subtitle}
              </p>
            ) : null}
            {intro ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {intro}
              </p>
            ) : null}
            {actions ? <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
