import { Building2, Compass, Leaf, Palette, Wrench } from "lucide-react";
import {
  MACETAS_OFRECEMOS,
  MACETAS_OFRECEMOS_SECTION_LABEL,
  MACETAS_OFRECEMOS_SUBTITULO,
  MACETAS_OFRECEMOS_TITULO,
} from "@/lib/macetas-redesign-contenido";

const SERVICIO_ICONS = {
  compass: Compass,
  palette: Palette,
  wrench: Wrench,
  building: Building2,
} as const;

export function MacetasOfrecemos() {
  return (
    <section className="px-4 py-12 md:px-6 md:py-16" aria-labelledby="macetas-ofrecemos-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2d4a22]">
          <Leaf className="h-4 w-4 text-[#c4933f]" aria-hidden />
          {MACETAS_OFRECEMOS_SECTION_LABEL}
        </p>
        <h2
          id="macetas-ofrecemos-heading"
          className="font-display mt-3 text-3xl font-bold text-[#2d4a22] md:text-4xl"
        >
          {MACETAS_OFRECEMOS_TITULO}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#666] md:text-base">
          {MACETAS_OFRECEMOS_SUBTITULO}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2 md:mt-12 md:gap-5">
        {MACETAS_OFRECEMOS.map((servicio) => {
          const Icon = SERVICIO_ICONS[servicio.icon];
          return (
            <article
              key={servicio.id}
              className="flex gap-4 rounded-3xl border border-[#e8ebe3] bg-white p-5 shadow-sm md:p-6"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5ea] text-[#2d4a22] md:h-14 md:w-14">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-bold text-[#2d4a22] md:text-xl">
                  {servicio.titulo}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#666]">{servicio.texto}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
