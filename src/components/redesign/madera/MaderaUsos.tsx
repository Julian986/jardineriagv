import { BookOpen, Coffee, Hammer, Sparkles, Sprout } from "lucide-react";
import {
  MADERA_PINOTEA_CIERRE,
  MADERA_PINOTEA_UNICIDAD,
  MADERA_USOS,
  MADERA_USOS_SECTION_LABEL,
  MADERA_USOS_TITULO,
} from "@/lib/madera-redesign-contenido";

const USO_ICONS = {
  sprout: Sprout,
  book: BookOpen,
  sparkles: Sparkles,
  coffee: Coffee,
} as const;

export function MaderaUsos() {
  return (
    <section className="px-4 py-12 md:px-6 md:py-16" aria-labelledby="madera-usos-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2d4a22]">
          <Hammer className="h-4 w-4 text-[#c4933f]" aria-hidden />
          {MADERA_USOS_SECTION_LABEL}
        </p>
        <h2
          id="madera-usos-heading"
          className="font-display mt-3 text-3xl font-bold text-[#2d4a22] md:text-4xl"
        >
          {MADERA_USOS_TITULO}
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 md:mt-12">
        {MADERA_USOS.map((uso) => {
          const Icon = USO_ICONS[uso.icon];
          return (
            <article
              key={uso.id}
              className="flex flex-col items-center rounded-3xl border border-[#e8ebe3] bg-white px-4 py-6 text-center shadow-sm"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f5ea] text-[#2d4a22]">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#2d4a22]">{uso.titulo}</p>
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-10 max-w-2xl text-center md:mt-12">
        <p className="text-[15px] leading-relaxed text-[#666] md:text-base">
          {MADERA_PINOTEA_UNICIDAD}
        </p>
        <p className="font-display mt-4 text-lg font-bold text-[#2d4a22] md:text-xl">
          {MADERA_PINOTEA_CIERRE}
        </p>
      </div>
    </section>
  );
}
