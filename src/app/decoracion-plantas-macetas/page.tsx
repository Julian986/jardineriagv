import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const WA_HREF =
  "https://wa.me/5492914315080?text=Hola%20Guillermo%2C%20quisiera%20coordinar%20una%20visita%20para%20ver%20mi%20jard%C3%ADn%20y%20pedir%20presupuesto.";

const CTA_RESERVAR_LABEL = "Empecemos a diseñar tu espacio";

const INTRO =
  "Llevamos la naturaleza a donde vos estés. Ya sea en el corazón de tu hogar o en el espacio de trabajo de tu empresa, nuestro servicio de decoración botánica transforma ambientes comunes en espacios vibrantes y saludables.";

const CURADURIA =
  "Trabajamos con una curaduría exclusiva de macetas y especies vegetales adaptadas tanto para interiores con luz controlada como para exteriores exigentes.";

const QUE_OFRECEMOS = [
  {
    titulo: "Asesoramiento Personalizado",
    texto:
      "Analizamos las condiciones de luz y clima de tu espacio para garantizar que cada planta prospere.",
  },
  {
    titulo: "Diseño y estilo",
    texto:
      "Seleccionamos macetas que complementen tu decoración actual, desde líneas minimalistas y modernas hasta texturas orgánicas y artesanales.",
  },
  {
    titulo: "Instalación y Montaje",
    texto:
      "Nos ocupamos de todo el proceso para que recibas tu espacio listo para disfrutar, con la garantía de calidad que nos define.",
  },
  {
    titulo: "Soluciones para Empresas",
    texto:
      "Creamos entornos corporativos más humanos y productivos a través del diseño biofílico.",
  },
] as const;

export const metadata: Metadata = {
  title: "Decoración con plantas y macetas | JardineríaGV",
  description: CURADURIA,
};

export default function DecoracionPlantasMacetasPage() {
  return (
    <main className="min-h-screen bg-[#fafaf7] text-[#1c1c1c]">
      <div className="border-b border-[#e4ead8] bg-[#2d5016] text-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-4 md:pb-14 md:pt-5">
          <div className="mb-6 flex justify-start md:mb-8">
            <Link
              href="/"
              aria-label="Volver al inicio"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/15"
            >
              <span aria-hidden className="text-sm leading-none">
                ←
              </span>
              Volver
            </Link>
          </div>
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
            <div className="relative mx-auto h-56 w-full max-w-md shrink-0 overflow-hidden rounded-2xl md:mx-0 md:h-72 md:w-96">
              <Image
                src="/canteros con plantas/portada.png"
                alt="Decoración con plantas y macetas"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 384px"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Servicio
              </p>
              <h1 className="mt-2 text-balance text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                <span className="block text-lg uppercase tracking-wide text-white/90 md:text-xl">
                  DECORACIÓN CON PLANTAS Y MACETAS:
                </span>
                <span className="mt-2 block text-[#e8b46a]">Vida en cada rincón</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                {INTRO}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/reservar"
                  className="inline-flex justify-center rounded-full bg-[#c4933f] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {CTA_RESERVAR_LABEL}
                </Link>
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <section className="mb-12">
          <p className="text-[17px] leading-relaxed text-[#333] md:text-lg">{CURADURIA}</p>
        </section>

        <section className="mb-12" aria-labelledby="que-ofrecemos-heading">
          <h2
            id="que-ofrecemos-heading"
            className="text-2xl font-bold text-[#2d5016] md:text-3xl"
          >
            ¿Qué ofrecemos?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {QUE_OFRECEMOS.map((item) => (
              <article
                key={item.titulo}
                className="rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#1c1c1c]">{item.titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{item.texto}</p>
              </article>
            ))}
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
          <Link
            href="/"
            className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-left"
          >
            ← Volver al inicio
          </Link>
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-right"
          >
            Consultar por WhatsApp →
          </a>
        </div>
      </div>
    </main>
  );
}
