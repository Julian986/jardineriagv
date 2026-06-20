import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HistoryBackLink } from "@/components/HistoryBackLink";
import { MaderaCheckoutForm } from "@/components/MaderaCheckoutForm";
import { TerekuaMvpBlock } from "@/components/TerekuaMvpBlock";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import {
  MADERA_INTRO_HOME,
  MADERA_PINOTEA_CARACTERISTICAS,
  MADERA_PINOTEA_CIERRE,
  MADERA_PINOTEA_INTRO,
  MADERA_PINOTEA_NOTA_MEDIDA,
  MADERA_PINOTEA_PROCESO,
  MADERA_PINOTEA_SUBTITULO,
  MADERA_PINOTEA_UNICIDAD,
  MADERA_PINOTEA_USOS,
  MADERA_SECCION_SUBTITULO,
  MADERA_SECCION_TITULO,
  MADERA_TAGLINE,
  MADERA_WHATSAPP_HREF,
} from "@/lib/madera-contenido";
import { formatArs, getMaderaPrecioMetroLinealArsPublic } from "@/lib/madera/pricing";
import { MADERA_PRODUCTO_TITULO, MADERA_VARIANTES } from "@/lib/madera-productos";

const CARD_CLASS = "rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm";

export const metadata: Metadata = {
  title: `${MADERA_SECCION_SUBTITULO} | JardineríaGV`,
  description: MADERA_INTRO_HOME,
};

export default function MueblesMaderaRecuperadaPage() {
  const precioMetro = getMaderaPrecioMetroLinealArsPublic();

  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#1c1c1c]">
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
                src="/madera_detail.webp"
                alt={`${MADERA_PRODUCTO_TITULO} instalados en un ambiente`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Muebles con historia
              </p>
              <h1 className="mt-2 text-balance text-2xl font-bold leading-snug md:text-3xl lg:text-4xl">
                <span className="block text-base uppercase tracking-wide text-white/90 md:text-lg">
                  {MADERA_SECCION_TITULO}
                </span>
                <span className="mt-2 block text-[#e8b46a]">{MADERA_SECCION_SUBTITULO}</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {MADERA_INTRO_HOME}
              </p>
              <p className="mt-3 text-sm font-semibold text-[#e8b46a]/95">{MADERA_TAGLINE}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="#comprar"
                  scroll
                  className="inline-flex justify-center rounded-full bg-[#c4933f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Comprar con Mercado Pago
                </Link>
                <WhatsAppLink
                  location="hero"
                  page="madera"
                  href={MADERA_WHATSAPP_HREF}
                  className="inline-flex justify-center rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Consultar por WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <section className="mb-12" aria-labelledby="pinotea-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5016]/70">
            {MADERA_PINOTEA_SUBTITULO}
          </p>
          <h2
            id="pinotea-heading"
            className="mt-2 text-2xl font-bold text-[#2d5016] md:text-3xl"
          >
            {MADERA_PRODUCTO_TITULO}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#333] md:text-lg">
            {MADERA_PINOTEA_INTRO}
          </p>

          <ul className="mt-6 space-y-2">
            {MADERA_PINOTEA_CARACTERISTICAS.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-relaxed text-[#444]">
                <span className="text-[#2d5016]" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className={`mt-8 ${CARD_CLASS}`}>
            <h3 className="text-lg font-bold text-[#2d5016]">Espesores disponibles</h3>
            <p className="mt-2 text-[15px] text-[#555]">{MADERA_PINOTEA_NOTA_MEDIDA}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {MADERA_VARIANTES.map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl border border-[#e4ead8] bg-[#fafaf7] p-4 text-center"
                >
                  <p className="text-[15px] font-semibold text-[#1c1c1c]">{v.medidasLabel}</p>
                  <p className="mt-2 text-lg font-bold text-[#2d5016]">
                    {formatArs(precioMetro)}
                    <span className="text-sm font-medium text-[#555]"> / m lineal</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="proceso-heading">
          <h2 id="proceso-heading" className="text-2xl font-bold text-[#2d5016] md:text-3xl">
            Proceso artesanal
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {MADERA_PINOTEA_PROCESO.map((paso, index) => (
              <article key={paso.titulo} className={CARD_CLASS}>
                <p className="text-xs font-bold uppercase tracking-wide text-[#2d5016]/60">
                  Paso {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#1c1c1c]">{paso.titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{paso.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-labelledby="usos-heading">
          <h2 id="usos-heading" className="text-2xl font-bold text-[#2d5016] md:text-3xl">
            Perfectos para
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {MADERA_PINOTEA_USOS.map((uso) => (
              <div
                key={uso.titulo}
                className="flex flex-col items-center rounded-xl border border-[#e4ead8] bg-white p-4 text-center shadow-sm"
              >
                <span className="text-2xl" aria-hidden>
                  {uso.icono}
                </span>
                <p className="mt-2 text-sm font-semibold text-[#2d5016]">{uso.titulo}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[15px] leading-relaxed text-[#555] md:text-left">
            {MADERA_PINOTEA_UNICIDAD}
          </p>
          <p className="mt-4 text-center text-base font-semibold text-[#2d5016] md:text-left">
            {MADERA_PINOTEA_CIERRE}
          </p>
        </section>

        <TerekuaMvpBlock location="madera_mvp" page="madera" className="mb-12" />

        <MaderaCheckoutForm />

        <div className="mt-12 flex flex-col gap-3 border-t border-[#e4ead8] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <HistoryBackLink
            aria-label="Volver al inicio"
            className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-left"
          >
            ← Volver al inicio
          </HistoryBackLink>
          <WhatsAppLink
            location="footer"
            page="madera"
            href={MADERA_WHATSAPP_HREF}
            className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-right"
          >
            Consultar por WhatsApp →
          </WhatsAppLink>
        </div>
      </div>
    </main>
  );
}
