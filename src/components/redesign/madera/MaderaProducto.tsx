import {
  EyeOff,
  Hammer,
  Home,
  Ruler,
  Sparkles,
  TreeDeciduous,
} from "lucide-react";
import { formatArs, getMaderaPrecioMetroLinealArsPublic } from "@/lib/madera/pricing";
import { MADERA_VARIANTES } from "@/lib/madera-productos";
import {
  MADERA_CARACTERISTICAS,
  MADERA_PINOTEA_INTRO,
  MADERA_PINOTEA_NOTA_MEDIDA,
  MADERA_PRODUCTO_SECTION_LABEL,
  MADERA_PRODUCTO_SECTION_SUBTITULO,
  MADERA_PRODUCTO_SECTION_TITULO,
} from "@/lib/madera-redesign-contenido";

const CARACTERISTICA_ICONS = {
  ruler: Ruler,
  "eye-off": EyeOff,
  sparkles: Sparkles,
  home: Home,
  tree: TreeDeciduous,
} as const;

export function MaderaProducto() {
  const precioMetro = getMaderaPrecioMetroLinealArsPublic();

  return (
    <section className="px-4 py-12 md:px-6 md:py-16" aria-labelledby="madera-producto-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2d4a22]">
          <Hammer className="h-4 w-4 text-[#c4933f]" aria-hidden />
          {MADERA_PRODUCTO_SECTION_LABEL}
        </p>
        <h2
          id="madera-producto-heading"
          className="font-display mt-3 text-3xl font-bold text-[#2d4a22] md:text-4xl"
        >
          {MADERA_PRODUCTO_SECTION_TITULO}
        </h2>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2d4a22]/70">
          {MADERA_PRODUCTO_SECTION_SUBTITULO}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[#666] md:text-base">
          {MADERA_PINOTEA_INTRO}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 md:mt-12 md:gap-5">
        {MADERA_CARACTERISTICAS.map((item) => {
          const Icon = CARACTERISTICA_ICONS[item.icon];
          return (
            <article
              key={item.id}
              className="flex gap-4 rounded-3xl border border-[#e8ebe3] bg-white p-5 shadow-sm md:p-6"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5ea] text-[#2d4a22] md:h-14 md:w-14">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <p className="min-w-0 flex-1 self-center text-[15px] leading-relaxed text-[#666]">
                {item.texto}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#e8ebe3] bg-white p-6 shadow-sm md:mt-12 md:p-8">
        <h3 className="font-display text-xl font-bold text-[#2d4a22] md:text-2xl">
          Espesores disponibles
        </h3>
        <p className="mt-2 text-[15px] text-[#666]">{MADERA_PINOTEA_NOTA_MEDIDA}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {MADERA_VARIANTES.map((variante) => (
            <div
              key={variante.id}
              className="rounded-2xl border border-[#e8ebe3] bg-[#fafaf7] px-4 py-5 text-center"
            >
              <p className="text-[15px] font-semibold text-[#1c1c1c]">{variante.medidasLabel}</p>
              <p className="mt-2 text-lg font-bold text-[#2d4a22]">
                {formatArs(precioMetro)}
                <span className="text-sm font-medium text-[#666]"> / m lineal</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
