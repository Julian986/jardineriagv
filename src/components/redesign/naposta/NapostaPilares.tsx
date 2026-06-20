"use client";

import { useState } from "react";
import { Leaf, Recycle, Sprout, Waves } from "lucide-react";
import {
  NAPOSTA_PILARES,
  NAPOSTA_PILARES_SECTION_LABEL,
  NAPOSTA_PILARES_SUBTITULO,
  NAPOSTA_PILARES_TITULO,
} from "@/lib/naposta-redesign-contenido";

const PILAR_ICONS = {
  waves: Waves,
  leaf: Leaf,
  recycle: Recycle,
} as const;

type NapostaItem = (typeof NAPOSTA_PILARES)[number]["items"][number];

function itemKey(item: NapostaItem, index: number) {
  return "titulo" in item && item.titulo ? item.titulo : `item-${index}`;
}

export function NapostaPilares() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="px-4 py-12 md:px-6 md:py-16" aria-labelledby="naposta-pilares-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2d4a22]">
          <Sprout className="h-4 w-4 text-[#c4933f]" aria-hidden />
          {NAPOSTA_PILARES_SECTION_LABEL}
        </p>
        <h2
          id="naposta-pilares-heading"
          className="font-display mt-3 text-3xl font-bold text-[#2d4a22] md:text-4xl"
        >
          {NAPOSTA_PILARES_TITULO}
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#666] md:text-base">
          {NAPOSTA_PILARES_SUBTITULO}
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 md:mt-12 md:gap-5">
        {NAPOSTA_PILARES.map((pilar) => {
          const Icon = PILAR_ICONS[pilar.icon];
          const expanded = openId === pilar.id;

          return (
            <article
              key={pilar.id}
              className="overflow-hidden rounded-3xl border border-[#e8ebe3] bg-white shadow-sm"
            >
              <div className="flex gap-4 p-5 md:p-6">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5ea] text-[#2d4a22] md:h-14 md:w-14">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold text-[#2d4a22] md:text-xl">
                    {pilar.titulo}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#666]">{pilar.resumen}</p>
                  <button
                    type="button"
                    onClick={() => setOpenId(expanded ? null : pilar.id)}
                    className="mt-3 text-sm font-semibold text-[#c4933f] transition-opacity hover:opacity-80"
                    aria-expanded={expanded}
                  >
                    {expanded ? "Leer menos ↑" : "Leer más →"}
                  </button>
                </div>
              </div>

              {expanded ? (
                <div className="border-t border-[#e8ebe3] bg-white px-5 py-5 md:px-6 md:py-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#2d4a22]/70">
                    {pilar.tituloCompleto}
                  </p>
                  <div className="mt-4 space-y-4">
                    {pilar.items.map((item, index) => (
                      <div key={itemKey(item, index)}>
                        {"titulo" in item && item.titulo ? (
                          <>
                            <h4 className="font-semibold text-[#1c1c1c]">{item.titulo}</h4>
                            <p className="mt-1 text-[15px] leading-relaxed text-[#555]">
                              {item.texto}
                            </p>
                          </>
                        ) : (
                          <p className="text-[15px] leading-relaxed text-[#555]">{item.texto}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
