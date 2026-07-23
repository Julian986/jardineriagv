import { z, type ZodError } from "zod";
import { getMaderaMpCheckoutFeeRate } from "@/lib/madera/pricing";
import { TiendaCheckoutSchema } from "@/lib/tienda/checkout";

export const COL_TIENDA_PEDIDOS = "tienda_pedidos";

export const TiendaPedidoPendingSchema = TiendaCheckoutSchema.extend({
  items: z
    .array(
      z.object({
        productoId: z.string().trim().min(1),
        cantidad: z.coerce.number().int().min(1).max(99),
      }),
    )
    .min(1, "El carrito está vacío.")
    .max(40),
});

export type TiendaPedidoPendingInput = z.infer<typeof TiendaPedidoPendingSchema>;

export type TiendaPedidoItemSnapshot = {
  productoId: string;
  slug: string;
  nombre: string;
  categoriaId: string;
  categoriaSlug: string;
  categoriaNombre: string;
  precioUnitarioArs: number;
  cantidad: number;
  subtotalArs: number;
  imagen: string;
};

export function formatTiendaPedidoValidationError(error: ZodError): string {
  return error.issues[0]?.message ?? "Revisá los datos del pedido.";
}

export function buildTiendaPedidoCodigo(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `TGV-${n}`;
}

/** Misma lógica que madera: comisión MP a cargo del comprador. */
export function calcTiendaCheckoutAmounts(subtotalArs: number, feeRate = getMaderaMpCheckoutFeeRate()) {
  const montoNetoArs = Math.round(subtotalArs);
  const montoTotalCobroArs = Math.ceil(montoNetoArs / (1 - feeRate));
  const montoCargoMpArs = montoTotalCobroArs - montoNetoArs;
  return {
    montoNetoArs,
    montoCargoMpArs,
    montoTotalCobroArs,
    feeRate,
  };
}

export function getTiendaMpCheckoutFeeRatePublic(): number {
  const raw = process.env.NEXT_PUBLIC_MERCADOPAGO_MADERA_CHECKOUT_FEE_RATE?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0 && n < 0.5) return n;
  }
  return getMaderaMpCheckoutFeeRate();
}
