"use client";

import { useState } from "react";
import { Minus, Plus, ShieldCheck, RefreshCw, Truck } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { useTiendaCart } from "@/components/tienda/TiendaCartContext";
import { formatArs } from "@/lib/madera/pricing";
import {
  getTiendaCuotaArs,
  getTiendaPrecioTransferencia,
  type TiendaProductoDemo,
} from "@/lib/tienda-demo";

type TiendaProductBuyBoxProps = {
  producto: TiendaProductoDemo;
};

export function TiendaProductBuyBox({ producto }: TiendaProductBuyBoxProps) {
  const { addProduct } = useTiendaCart();
  const [cantidad, setCantidad] = useState(1);

  const precioTransferencia = getTiendaPrecioTransferencia(producto);
  const cuota = getTiendaCuotaArs(producto);
  const waText = encodeURIComponent(
    `Hola Guillermo, quiero consultar por el producto: ${producto.nombre}`,
  );

  function bump(delta: number) {
    setCantidad((prev) => Math.max(1, Math.min(99, prev + delta)));
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-1">
        <p className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">
          {formatArs(producto.precioArs)}
        </p>
        {precioTransferencia && producto.descuentoTransferenciaPct ? (
          <p className="text-lg font-semibold text-[#2d4a22] sm:text-xl">
            {formatArs(precioTransferencia)}{" "}
            <span className="text-sm font-medium text-[#555]">
              con transferencia o depósito ({producto.descuentoTransferenciaPct}% OFF)
            </span>
          </p>
        ) : null}
        {cuota && producto.cuotas ? (
          <p className="pt-1 text-sm text-[#555]">
            <span className="font-semibold text-[#1a1a1a]">
              {producto.cuotas} cuotas sin interés
            </span>{" "}
            de {formatArs(cuota)}
          </p>
        ) : null}
      </div>

      <p className="mt-5 flex items-start gap-2 text-sm text-[#555]">
        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#2d4a22]" aria-hidden />
        <span>Envío o retiro a coordinar luego de la compra · Bahía Blanca y zona</span>
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          className="inline-flex h-14 w-full items-center justify-between rounded-md border border-[#ddd] bg-white px-1 sm:w-36 sm:shrink-0"
          role="group"
          aria-label="Cantidad"
        >
          <button
            type="button"
            onClick={() => bump(-1)}
            className="flex h-12 w-12 items-center justify-center rounded text-[#333] transition-colors hover:bg-[#f3f5f0]"
            aria-label="Restar cantidad"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2ch] text-center text-base font-semibold tabular-nums">
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => bump(1)}
            className="flex h-12 w-12 items-center justify-center rounded text-[#333] transition-colors hover:bg-[#f3f5f0]"
            aria-label="Sumar cantidad"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => addProduct(producto, cantidad)}
          className="flex h-14 w-full items-center justify-center rounded-md bg-[#2d4a22] px-6 text-sm font-bold text-white transition-all hover:bg-[#243c1c] active:scale-[0.99] sm:min-w-0 sm:flex-1"
        >
          Agregar al carrito
        </button>
      </div>

      <WhatsAppLink
        href={`https://wa.me/5492914315080?text=${waText}`}
        location="producto_detail"
        page="tienda"
        className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[#25d366] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 0 0 .919.919l4.458-1.495A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.357-.212-2.642.884.884-2.642-.212-.357A9.818 9.818 0 1 1 12 21.818z" />
        </svg>
        Consultar por WhatsApp
      </WhatsAppLink>

      <ul className="mt-8 space-y-4 border-t border-[#eee] pt-6">
        <li className="flex gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#2d4a22]" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">Compra protegida</p>
            <p className="text-xs leading-relaxed text-[#666]">
              Coordinamos pago y entrega con vos. Sin sorpresas.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-[#2d4a22]" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">Cambios y consultas</p>
            <p className="text-xs leading-relaxed text-[#666]">
              Si algo no encaja, escribinos y lo resolvemos juntos.
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
