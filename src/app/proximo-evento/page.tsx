import type { Metadata } from "next";
import { BiodiversidadPageFooter } from "@/components/BiodiversidadPageFooter";
import {
  EVENTO_CUMPLE_RAIZ_DESCRIPCION,
  EVENTO_ETIQUETA,
} from "@/lib/biodiversidad-evento";

export const metadata: Metadata = {
  title: `${EVENTO_ETIQUETA} | JardineríaGV`,
  description: EVENTO_CUMPLE_RAIZ_DESCRIPCION,
};

export default function ProximoEventoPage() {
  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#1c1c1c]">
      {/* <BiodiversidadHero
        label={EVENTO_ETIQUETA}
        title={EVENTO_CUMPLE_RAIZ_TITULO}
        actions={
          <WhatsAppLink
            location="hero"
            page="biodiversidad_evento"
            href={EVENTO_CUMPLE_RAIZ_WHATSAPP_HREF}
            className="inline-flex justify-center rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Consultar sobre el evento
          </WhatsAppLink>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <p className="text-[17px] leading-relaxed text-[#333] md:text-lg">
          {EVENTO_CUMPLE_RAIZ_DESCRIPCION}
        </p>

        <h2 className="mt-10 text-lg font-bold text-[#2d5016]">📅 Datos del Evento</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {EVENTO_CUMPLE_RAIZ_DATOS.map((dato) => (
            <article key={dato.etiqueta} className={CARD_BIODIVERSIDAD_CLASS}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2d5016]/75">
                {dato.etiqueta}
              </p>
              <p className="mt-2 text-lg font-semibold leading-snug text-[#1c1c1c] md:text-xl">
                {dato.valor}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppLink
            location="evento_section"
            page="biodiversidad_evento"
            href={EVENTO_CUMPLE_RAIZ_WHATSAPP_HREF}
            className="inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-6 py-3 text-sm font-semibold text-[#2d5016] shadow-sm transition-colors hover:bg-[#f0f5ea]"
          >
            Consultar sobre el evento
          </WhatsAppLink>
          <a
            href={EVENTO_CUMPLE_RAIZ_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center rounded-full border-2 border-[#2d5016]/40 bg-[#f0f5ea] px-6 py-3 text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#e4ead8]/60"
          >
            Ver ubicación en el mapa
          </a>
        </div> */}

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div>
          <BiodiversidadPageFooter />
        </div>
      </div>
    </main>
  );
}
