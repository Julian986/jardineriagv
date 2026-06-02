import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HistoryBackLink } from "@/components/HistoryBackLink";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { TITULO_BIODIVERSIDAD, TITULO_PROYECTO_NAPOSTA } from "@/lib/biodiversidad-titulos";
import {
  PROYECTO_NAPOSTA_INTRO,
  PROYECTO_NAPOSTA_SECCIONES,
} from "@/lib/biodiversidad-naposta-contenido";

const CTA_RESERVAR_LABEL = "Empecemos a diseñar tu espacio";

const CARD_CLASS =
  "rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm";

type NapostaItem = (typeof PROYECTO_NAPOSTA_SECCIONES)[number]["items"][number];

function napostaItemKey(item: NapostaItem, index: number) {
  return "titulo" in item && item.titulo ? item.titulo : `item-${index}`;
}

export const metadata: Metadata = {
  title: `${TITULO_BIODIVERSIDAD} | JardineríaGV`,
  description: PROYECTO_NAPOSTA_INTRO,
};

export default function ProteccionBiodiversidadPage() {
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
                src="/biodiversidad.webp"
                alt={TITULO_BIODIVERSIDAD}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Dentro de nuestro compromiso con la biodiversidad
              </p> */}
              <h1 className="mt-2 text-balance text-2xl font-bold leading-snug text-[#e8b46a] md:text-3xl lg:text-4xl">
                {TITULO_PROYECTO_NAPOSTA}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {PROYECTO_NAPOSTA_INTRO}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/reservar"
                  className="inline-flex justify-center rounded-full bg-[#c4933f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {CTA_RESERVAR_LABEL}
                </Link>
                <WhatsAppLink
                  location="hero"
                  page="biodiversidad"
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
        <section className="mb-12" aria-labelledby="estrategias-heading">
          <h2
            id="estrategias-heading"
            className="text-2xl font-bold text-[#2d5016] md:text-3xl"
          >
            Estrategias del proyecto
          </h2>

          <div className="mt-8 space-y-12">
            {PROYECTO_NAPOSTA_SECCIONES.map((seccion) => (
              <div key={seccion.titulo}>
                <h3 className="text-lg font-bold text-[#2d5016] md:text-xl">{seccion.titulo}</h3>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {seccion.items.map((item, index) => (
                    <article key={napostaItemKey(item, index)} className={CARD_CLASS}>
                      {"titulo" in item && item.titulo ? (
                        <>
                          <h4 className="text-lg font-semibold text-[#1c1c1c]">{item.titulo}</h4>
                          <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{item.texto}</p>
                        </>
                      ) : (
                        <p className="text-[15px] leading-relaxed text-[#555]">{item.texto}</p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <WhatsAppLink
              location="naposta_section"
              page="biodiversidad"
              className="inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-6 py-3 text-sm font-semibold text-[#2d5016] shadow-sm transition-colors hover:bg-[#f0f5ea]"
            >
              Consultar sobre el Río Napostá
            </WhatsAppLink>
          </div>
        </section>

        <div className="mb-12 flex flex-col items-center gap-4 border-b border-[#e4ead8] pb-12">
          <Link
            href="/reservar"
            className="inline-flex justify-center rounded-full bg-[#c4933f] px-8 py-3.5 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90"
          >
            {CTA_RESERVAR_LABEL}
          </Link>
        </div>

        <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <HistoryBackLink
            aria-label="Volver al inicio"
            className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-left"
          >
            ← Volver al inicio
          </HistoryBackLink>
          <WhatsAppLink
            location="footer"
            page="biodiversidad"
            className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-right"
          >
            Consultar por WhatsApp →
          </WhatsAppLink>
        </div>
      </div>
    </main>
  );
}
