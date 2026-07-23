"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { formatArs } from "@/lib/madera/pricing";
import { RUTA_CHECKOUT, RUTA_TIENDA } from "@/lib/tienda-routes";
import { useTiendaCart } from "@/components/tienda/TiendaCartContext";

const DRAWER_TRANSITION_MS = 280;

export function TiendaCartDrawer() {
  const { items, subtotalArs, isOpen, closeCart, removeItem, setQuantity } = useTiendaCart();

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={closeCart}
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Cerrar carrito"
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        style={{ transitionDuration: `${DRAWER_TRANSITION_MS}ms` }}
      >
        <div className="flex items-center justify-between border-b border-[#eee] px-5 py-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Carrito de compras</h2>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#444] transition-colors hover:bg-[#f3f3f3]"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-[15px] text-[#555]">El carrito de compras está vacío.</p>
            <Link
              href={RUTA_TIENDA}
              onClick={closeCart}
              className="mt-6 text-sm font-semibold text-[#2d4a22] underline underline-offset-2"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li
                  key={item.productoId}
                  className="flex gap-3 border-b border-[#f0f0f0] py-4 last:border-b-0"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-[#eee] bg-[#fafafa]">
                    <Image
                      src={item.imagen}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm leading-snug text-[#333]">{item.nombre}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productoId)}
                        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#999] transition-colors hover:bg-[#f8ecec] hover:text-[#b42318]"
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded border border-[#ddd]">
                        <button
                          type="button"
                          onClick={() =>
                            item.cantidad <= 1
                              ? removeItem(item.productoId)
                              : setQuantity(item.productoId, item.cantidad - 1)
                          }
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-[#444] hover:bg-[#f5f5f5]"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.productoId, item.cantidad + 1)}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-[#444] hover:bg-[#f5f5f5]"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-[#1a1a1a]">
                        {formatArs(item.precioArs * item.cantidad)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#eee] bg-[#fafafa] px-5 py-5">
              <div className="space-y-2 text-sm text-[#444]">
                <div className="flex justify-between">
                  <span>Subtotal (sin envío)</span>
                  <span className="font-semibold text-[#1a1a1a]">{formatArs(subtotalArs)}</span>
                </div>
                <div className="flex justify-between text-[#666]">
                  <span>Envío</span>
                  <span>Coordinamos por WhatsApp</span>
                </div>
                <div className="flex justify-between border-t border-[#e8e8e8] pt-3 text-base font-bold text-[#1a1a1a]">
                  <span>Total</span>
                  <span>{formatArs(subtotalArs)}</span>
                </div>
              </div>

              <Link
                href={RUTA_CHECKOUT}
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center rounded-md bg-[#2d4a22] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#243c1c]"
              >
                Iniciar compra
              </Link>
              <p className="mt-2 text-center text-[11px] text-[#888]">
                Completá tus datos y prepará el pago en el checkout.
              </p>

              <Link
                href={RUTA_TIENDA}
                onClick={closeCart}
                className="mt-4 block text-center text-sm font-medium text-[#2d4a22] underline underline-offset-2"
              >
                Ver más productos
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
