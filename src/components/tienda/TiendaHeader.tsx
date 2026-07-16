import Link from "next/link";
import { Search, User } from "lucide-react";
import { BrandLogo } from "@/components/redesign/BrandLogo";
import { TiendaCartButton } from "@/components/tienda/TiendaCartButton";
import { RUTA_TIENDA } from "@/lib/tienda-routes";

function TiendaPromoBar() {
  return (
    <div className="bg-[#1a1a1a] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white sm:text-xs">
      <span>Consultá por WhatsApp</span>
      <span className="mx-2 text-white/40" aria-hidden>
        ·
      </span>
      <span>Productos para tu jardín en Bahía Blanca</span>
    </div>
  );
}

function TiendaMainNav() {
  return (
    <nav
      className="border-b border-[#e8e8e8] bg-white"
      aria-label="Navegación de la tienda"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#333] sm:px-6 sm:text-xs">
        <span className="text-[#2d4a22]">Categorías</span>
        <Link href="/" className="transition-colors hover:text-[#2d4a22]">
          Inicio
        </Link>
        <Link href={RUTA_TIENDA} className="text-[#2d4a22]">
          Productos
        </Link>
        <Link href="/#contacto" className="transition-colors hover:text-[#2d4a22]">
          Contacto
        </Link>
      </div>
    </nav>
  );
}

export function TiendaHeader() {
  return (
    <header className="border-b border-[#e8e8e8] bg-white">
      <TiendaPromoBar />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-5">
        <BrandLogo href={RUTA_TIENDA} className="shrink-0" />

        <div className="hidden min-w-0 flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">Buscar productos (próximamente)</span>
            <input
              type="search"
              disabled
              placeholder="Buscar productos..."
              title="Buscador disponible en una próxima actualización"
              className="w-full rounded-md border border-[#ddd] bg-[#fafafa] px-4 py-2.5 pr-10 text-sm text-[#999] shadow-inner"
            />
            <Search
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]"
              aria-hidden
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-4 text-[#333] sm:gap-6">
          <span
            className="hidden items-center gap-2 text-xs text-[#888] sm:inline-flex"
            title="Cuentas de usuario — próximamente"
          >
            <User className="h-4 w-4" aria-hidden />
            <span>Mi cuenta</span>
          </span>
          <TiendaCartButton />
        </div>
      </div>
      <TiendaMainNav />
    </header>
  );
}
