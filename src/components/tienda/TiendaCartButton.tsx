"use client";

import { ShoppingBag } from "lucide-react";
import { formatArs } from "@/lib/madera/pricing";
import { useTiendaCart } from "@/components/tienda/TiendaCartContext";

export function TiendaCartButton() {
  const { itemCount, subtotalArs, openCart } = useTiendaCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#333] transition-opacity hover:opacity-80 sm:text-sm"
      aria-label={`Abrir carrito, ${itemCount} productos`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      <span>
        Carrito <span className="font-normal text-[#666]">({itemCount})</span>
      </span>
      <span className="hidden text-[#666] sm:inline">{formatArs(subtotalArs)}</span>
    </button>
  );
}
