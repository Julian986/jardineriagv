"use client";

import { ShoppingBag } from "lucide-react";
import { formatArs } from "@/lib/madera/pricing";
import { useTiendaCart } from "@/components/tienda/TiendaCartContext";

export function TiendaCartButton() {
  const { itemCount, subtotalArs, openCart } = useTiendaCart();
  const hasItems = itemCount > 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className={`relative inline-flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-2 text-xs font-semibold transition-colors sm:px-3.5 sm:text-sm ${
        hasItems
          ? "bg-[#2d4a22] text-white hover:bg-[#243c1c]"
          : "border border-[#2d4a22]/35 bg-white text-[#2d4a22] hover:border-[#2d4a22] hover:bg-[#f3f5f0]"
      }`}
      aria-label={`Abrir carrito, ${itemCount} productos`}
    >
      <span className="relative inline-flex">
        <ShoppingBag className="h-[18px] w-[18px] sm:h-5 sm:w-5" aria-hidden />
        {/* Badge mobile: solo número sobre el ícono */}
        <span
          className={`absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none sm:hidden ${
            hasItems ? "bg-[#c4933f] text-white" : "bg-[#e8ebe3] text-[#666]"
          }`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      </span>

      <span className="hidden sm:inline">
        Carrito
        <span className={`ml-1 font-medium ${hasItems ? "text-white/80" : "text-[#2d4a22]/70"}`}>
          ({itemCount})
        </span>
      </span>

      {hasItems ? (
        <span className="hidden border-l border-white/25 pl-2 font-medium text-white/90 md:inline">
          {formatArs(subtotalArs)}
        </span>
      ) : null}
    </button>
  );
}
