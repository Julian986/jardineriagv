import { BrandLogo } from "@/components/redesign/BrandLogo";
import { TiendaCartButton } from "@/components/tienda/TiendaCartButton";
import { TiendaHeaderBackLink } from "@/components/tienda/TiendaHeaderBackLink";
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

export function TiendaHeader() {
  return (
    <>
      <TiendaPromoBar />

      <div className="sticky top-0 z-40 border-b border-[#e8e8e8] bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
          <BrandLogo href={RUTA_TIENDA} className="shrink-0" />

          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            <TiendaHeaderBackLink />
            <TiendaCartButton />
          </div>
        </div>
      </div>
    </>
  );
}
