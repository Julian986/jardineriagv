"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RUTA_TIENDA } from "@/lib/tienda-routes";

const linkClass =
  "inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium text-[#666] transition-colors hover:bg-[#f3f5f0] hover:text-[#2d4a22] sm:px-2.5 sm:text-[13px]";

export function TiendaHeaderBackLink() {
  const pathname = usePathname();
  // Ficha de producto, checkout u otras subrutas de /tienda
  const enSubrutaTienda =
    pathname.startsWith(`${RUTA_TIENDA}/`) && pathname !== RUTA_TIENDA;

  if (enSubrutaTienda) {
    return (
      <Link
        href={RUTA_TIENDA}
        className={linkClass}
        title="Volver al catálogo de productos"
      >
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Productos</span>
      </Link>
    );
  }

  return (
    <Link href="/" className={linkClass} title="Volver al sitio de Jardinería GV">
      <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="sm:hidden">Sitio</span>
      <span className="hidden sm:inline">Sitio web</span>
    </Link>
  );
}
