"use client";

import Link from "next/link";
import { trackTiendaClick } from "@/lib/tienda/analytics";
import { RUTA_TIENDA } from "@/lib/tienda-routes";
import type { TiendaCategoria } from "@/lib/tienda/types";

type TiendaSidebarProps = {
  categoriaActiva?: string | null;
  categorias: TiendaCategoria[];
};

function trackCategoria(slug: string | "todas", location: string) {
  trackTiendaClick({
    button: "filtrar_categoria",
    location,
    product_name: slug,
  });
}

export function TiendaSidebar({ categoriaActiva, categorias }: TiendaSidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
      <h2 className="text-sm font-bold text-[#1a1a1a]">Filtrar por</h2>

      <div className="mt-5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#666]">
          Categorías
        </h3>
        <ul className="mt-3 space-y-2.5">
          <li>
            <Link
              href={RUTA_TIENDA}
              onClick={() => trackCategoria("todas", "sidebar")}
              className={`text-sm transition-colors hover:text-[#2d4a22] ${
                !categoriaActiva ? "font-semibold text-[#2d4a22]" : "text-[#444]"
              }`}
            >
              Todas
            </Link>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`${RUTA_TIENDA}?categoria=${cat.slug}`}
                onClick={() => trackCategoria(cat.slug, "sidebar")}
                className={`text-sm transition-colors hover:text-[#2d4a22] ${
                  categoriaActiva === cat.slug
                    ? "font-semibold text-[#2d4a22]"
                    : "text-[#444]"
                }`}
              >
                {cat.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function TiendaCategoryPills({ categoriaActiva, categorias }: TiendaSidebarProps) {
  return (
    <div className="mt-5 mb-2 flex gap-2 overflow-x-auto pb-3 lg:hidden">
      <Link
        href={RUTA_TIENDA}
        onClick={() => trackCategoria("todas", "pills")}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
          !categoriaActiva
            ? "bg-[#2d4a22] text-white"
            : "border border-[#ddd] bg-white text-[#444]"
        }`}
      >
        Todas
      </Link>
      {categorias.map((cat) => (
        <Link
          key={cat.id}
          href={`${RUTA_TIENDA}?categoria=${cat.slug}`}
          onClick={() => trackCategoria(cat.slug, "pills")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
            categoriaActiva === cat.slug
              ? "bg-[#2d4a22] text-white"
              : "border border-[#ddd] bg-white text-[#444]"
          }`}
        >
          {cat.nombre}
        </Link>
      ))}
    </div>
  );
}
