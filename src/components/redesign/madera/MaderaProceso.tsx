import { Hammer } from "lucide-react";
import {
  MADERA_PINOTEA_PROCESO,
  MADERA_PROCESO_SECTION_LABEL,
  MADERA_PROCESO_SUBTITULO,
  MADERA_PROCESO_TITULO,
} from "@/lib/madera-redesign-contenido";

export function MaderaProceso() {
  return (
    <section className="bg-[#fafaf7] px-4 py-12 md:px-6 md:py-16" aria-labelledby="madera-proceso-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2d4a22]">
          <Hammer className="h-4 w-4 text-[#c4933f]" aria-hidden />
          {MADERA_PROCESO_SECTION_LABEL}
        </p>
        <h2
          id="madera-proceso-heading"
          className="font-display mt-3 text-3xl font-bold text-[#2d4a22] md:text-4xl"
        >
          {MADERA_PROCESO_TITULO}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#666] md:text-base">
          {MADERA_PROCESO_SUBTITULO}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 md:mt-12 md:gap-5">
        {MADERA_PINOTEA_PROCESO.map((paso, index) => (
          <article
            key={paso.titulo}
            className="rounded-3xl border border-[#e8ebe3] bg-white p-5 shadow-sm md:p-6"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[#2d4a22]/60">
              Paso {index + 1}
            </p>
            <h3 className="font-display mt-1 text-lg font-bold text-[#2d4a22] md:text-xl">
              {paso.titulo}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#666]">{paso.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
