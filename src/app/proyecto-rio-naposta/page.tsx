import type { Metadata } from "next";
import { BiodiversidadHero } from "@/components/BiodiversidadHero";
import { BiodiversidadPageFooter } from "@/components/BiodiversidadPageFooter";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import {
  PROYECTO_NAPOSTA_INTRO,
  PROYECTO_NAPOSTA_SECCIONES,
} from "@/lib/biodiversidad-naposta-contenido";
import { CARD_BIODIVERSIDAD_CLASS } from "@/lib/biodiversidad-rutas";
import { TITULO_PROYECTO_NAPOSTA } from "@/lib/biodiversidad-titulos";

type NapostaItem = (typeof PROYECTO_NAPOSTA_SECCIONES)[number]["items"][number];

function napostaItemKey(item: NapostaItem, index: number) {
  return "titulo" in item && item.titulo ? item.titulo : `item-${index}`;
}

export const metadata: Metadata = {
  title: `${TITULO_PROYECTO_NAPOSTA} | JardineríaGV`,
  description: TITULO_PROYECTO_NAPOSTA,
};

export default function ProyectoRioNapostaPage() {
  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#1c1c1c]">
      <BiodiversidadHero
        label="Proyecto"
        title={TITULO_PROYECTO_NAPOSTA}
        actions={
          <WhatsAppLink
            location="hero"
            page="biodiversidad_proyecto"
            className="inline-flex justify-center rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Consultar sobre el Río Napostá
          </WhatsAppLink>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <section aria-labelledby="estrategias-heading">
          <h2
            id="estrategias-heading"
            className="text-2xl font-bold text-[#2d5016] md:text-3xl"
          >
            Estrategias del proyecto
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#333] md:text-lg">
            {PROYECTO_NAPOSTA_INTRO}
          </p>

          <div className="mt-8 space-y-12">
            {PROYECTO_NAPOSTA_SECCIONES.map((seccion) => (
              <div key={seccion.titulo}>
                <h3 className="text-lg font-bold text-[#2d5016] md:text-xl">{seccion.titulo}</h3>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {seccion.items.map((item, index) => (
                    <article key={napostaItemKey(item, index)} className={CARD_BIODIVERSIDAD_CLASS}>
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
              page="biodiversidad_proyecto"
              className="inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-6 py-3 text-sm font-semibold text-[#2d5016] shadow-sm transition-colors hover:bg-[#f0f5ea]"
            >
              Consultar sobre el Río Napostá
            </WhatsAppLink>
          </div>
        </section>

        <section
          className="mt-12 rounded-2xl border border-dashed border-[#c8d9b8] bg-[#f0f5ea]/60 p-6 text-center"
          aria-label="Encuesta próximamente"
        >
          <p className="text-sm font-semibold text-[#2d5016]">Próximamente</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#555]">
            Encuesta para conocer tu opinión sobre el proyecto.
          </p>
        </section>

        <div className="mt-12">
          <BiodiversidadPageFooter />
        </div>
      </div>
    </main>
  );
}
