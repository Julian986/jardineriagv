"use client";

import Image from "next/image";
import Link from "next/link";
import { formatArs } from "@/lib/madera/pricing";
import { getTiendaCuotaArs, type TiendaProducto } from "@/lib/tienda/types";
import { rutaProductoTienda } from "@/lib/tienda-routes";
import { useTiendaCart } from "@/components/tienda/TiendaCartContext";

type TiendaProductCardProps = {
  producto: TiendaProducto;
};

export function TiendaProductCard({ producto }: TiendaProductCardProps) {
  const { addProduct } = useTiendaCart();
  const cuota = getTiendaCuotaArs(producto);
  const href = rutaProductoTienda(producto.slug);

  return (
    <article className="group flex flex-col">
      <Link href={href} className="block overflow-hidden rounded-sm border border-[#e8e8e8] bg-white">
        <div className="bg-[#2d4a22] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:text-[11px]">
          {producto.categoriaLabel} <span aria-hidden>&gt;&gt;&gt;</span>
        </div>
        <div className="relative aspect-square bg-[#f7f7f7]">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c4933f]/80" aria-hidden />
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col px-0.5">
        <Link href={href}>
          <h3 className="line-clamp-2 text-[13px] leading-snug text-[#333] transition-colors group-hover:text-[#2d4a22] sm:text-sm">
            {producto.nombre}
          </h3>
        </Link>
        <p className="mt-2 text-lg font-bold text-[#1a1a1a] sm:text-xl">
          {formatArs(producto.precioArs)}
        </p>
        {cuota && producto.cuotas ? (
          <p className="mt-1 text-xs text-[#666]">
            {producto.cuotas} x {formatArs(cuota)} sin interés
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => addProduct(producto)}
          className="mt-3 w-full cursor-pointer rounded-md border border-[#2d4a22] bg-white py-2 text-xs font-semibold text-[#2d4a22] transition-colors hover:bg-[#f0f5ea] sm:text-sm"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
