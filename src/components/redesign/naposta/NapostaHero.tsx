import Image from "next/image";
import { ArrowLeft, Calendar, CheckCircle2, MapPin } from "lucide-react";
import { HistoryBackLink } from "@/components/HistoryBackLink";
import {
  NAPOSTA_HERO_BADGE,
  NAPOSTA_HERO_DESCRIPCION,
  NAPOSTA_HERO_IMAGEN,
  NAPOSTA_HERO_TITULO_LINEA1,
  NAPOSTA_HERO_TITULO_LINEA2,
  NAPOSTA_META,
} from "@/lib/naposta-redesign-contenido";

const META_ICONS = {
  pin: MapPin,
  calendar: Calendar,
  check: CheckCircle2,
} as const;

export function NapostaHero() {
  return (
    <section className="relative flex min-h-[420px] flex-col justify-end overflow-hidden md:min-h-[520px] lg:min-h-[560px]">
      <Image
        src={NAPOSTA_HERO_IMAGEN}
        alt="Proyecto Río Napostá"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1a2f14]/95 via-[#1a2f14]/55 to-[#1a2f14]/25"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 z-10 mx-auto max-w-6xl px-4 pt-4 md:px-6 md:pt-5">
        <HistoryBackLink
          fallbackHref="/proteccion-biodiversidad"
          aria-label="Volver"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#2d4a22]/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-[#2d4a22]"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
          Volver
        </HistoryBackLink>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-0 pt-24 md:px-6 md:pt-28">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c4933f]/50 bg-[#c4933f]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c88a] md:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c4933f]" aria-hidden />
          {NAPOSTA_HERO_BADGE}
        </span>

        <h1 className="font-display mt-4 max-w-3xl text-balance">
          <span className="block text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            {NAPOSTA_HERO_TITULO_LINEA1}
          </span>
          <span className="mt-1 block text-4xl font-bold text-[#c4933f] md:text-5xl lg:text-6xl">
            {NAPOSTA_HERO_TITULO_LINEA2}
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/88 md:text-base lg:text-lg">
          {NAPOSTA_HERO_DESCRIPCION}
        </p>
      </div>

      <div className="mt-8 w-full border-t border-white/15 bg-[#2d4a22]/75 py-4 backdrop-blur-sm md:mt-10 md:py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-nowrap items-center justify-between px-4 md:justify-start md:gap-x-6 md:px-6">
          {NAPOSTA_META.map((item, index) => {
            const Icon = META_ICONS[item.icon];
            return (
              <div
                key={item.label}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-white/90 ${
                  index > 0 ? "md:border-l md:border-white/15 md:pl-6" : ""
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 text-[#c4933f]" aria-hidden />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
