import type { Metadata } from "next";
import Link from "next/link";
import { BiodiversidadHero } from "@/components/BiodiversidadHero";
import { BiodiversidadPageFooter } from "@/components/BiodiversidadPageFooter";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import {
  EVENTO_CUMPLE_RAIZ_DATOS,
  EVENTO_CUMPLE_RAIZ_TITULO,
  EVENTO_ETIQUETA,
} from "@/lib/biodiversidad-evento";
import {
  CARD_BIODIVERSIDAD_CLASS,
  CTA_VER_EVENTO,
  CTA_VER_PROYECTO,
  RUTA_EVENTO,
  RUTA_PROYECTO,
} from "@/lib/biodiversidad-rutas";
import { TITULO_BIODIVERSIDAD, TITULO_PROYECTO_NAPOSTA } from "@/lib/biodiversidad-titulos";

export const metadata: Metadata = {
  title: `${TITULO_BIODIVERSIDAD} | JardineríaGV`,
  description: TITULO_BIODIVERSIDAD,
};

export default function ProteccionBiodiversidadPage() {
  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#1c1c1c]">
      <BiodiversidadHero
        title={TITULO_BIODIVERSIDAD}
        actions={
          <WhatsAppLink
            location="hero"
            page="biodiversidad_hub"
            className="inline-flex justify-center rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Consultar por WhatsApp
          </WhatsAppLink>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <section className="mb-10" aria-labelledby="hub-evento-heading">
          <h2 id="hub-evento-heading" className="text-2xl font-bold text-[#2d5016] md:text-3xl">
            {EVENTO_ETIQUETA}
          </h2>
          <article className={`mt-6 ${CARD_BIODIVERSIDAD_CLASS}`}>
            <p className="text-lg font-semibold leading-snug text-[#1c1c1c] md:text-xl">
              {EVENTO_CUMPLE_RAIZ_TITULO}
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-[#e4ead8]/80 bg-[#fafaf7]">
              {EVENTO_CUMPLE_RAIZ_DATOS.map((dato, index) => (
                <div
                  key={dato.etiqueta}
                  className={`px-3 py-2.5 ${index > 0 ? "border-t border-[#e4ead8]/70" : ""}`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2d5016]/75">
                    {dato.etiqueta}
                  </p>
                  <p className="mt-1 text-[15px] font-semibold leading-snug text-[#1c1c1c] md:text-base">
                    {dato.valor}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={RUTA_EVENTO}
              scroll
              className="mt-5 inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-6 py-3 text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#f0f5ea]"
            >
              {CTA_VER_EVENTO}
            </Link>
          </article>
        </section>

        <section className="mb-12" aria-labelledby="hub-proyecto-heading">
          <h2 id="hub-proyecto-heading" className="text-2xl font-bold text-[#2d5016] md:text-3xl">
            Proyecto
          </h2>
          <article className={`mt-6 ${CARD_BIODIVERSIDAD_CLASS}`}>
            <p className="text-lg font-semibold leading-snug text-[#1c1c1c] md:text-xl">
              {TITULO_PROYECTO_NAPOSTA}
            </p>
            <Link
              href={RUTA_PROYECTO}
              scroll
              className="mt-5 inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-6 py-3 text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#f0f5ea]"
            >
              {CTA_VER_PROYECTO}
            </Link>
          </article>
        </section>

        <BiodiversidadPageFooter />
      </div>
    </main>
  );
}
