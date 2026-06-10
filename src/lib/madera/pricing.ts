import { MADERA_PRECIO_METRO_LINEAL_ARS } from "@/lib/madera-productos";

/** Tasa efectiva de costo MP (comisión + IVA) absorbida por el comprador. Configurable en .env */
export function getMaderaMpCheckoutFeeRate(): number {
  const raw =
    process.env.MERCADOPAGO_MADERA_CHECKOUT_FEE_RATE?.trim() ??
    process.env.NEXT_PUBLIC_MERCADOPAGO_MADERA_CHECKOUT_FEE_RATE?.trim() ??
    "0.076";
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n >= 0.5) return 0.076;
  return n;
}

export function getMaderaMpCheckoutFeeRatePublic(): number {
  const raw = process.env.NEXT_PUBLIC_MERCADOPAGO_MADERA_CHECKOUT_FEE_RATE?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0 && n < 0.5) return n;
  }
  return getMaderaMpCheckoutFeeRate();
}

export function getMaderaPrecioMetroLinealArsPublic(): number {
  const raw = process.env.NEXT_PUBLIC_MADERA_PRECIO_METRO_LINEAL_ARS?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return Math.round(n);
  }
  return MADERA_PRECIO_METRO_LINEAL_ARS;
}

export type MaderaCheckoutAmounts = {
  metros: number;
  precioMetroArs: number;
  montoNetoArs: number;
  montoCargoMpArs: number;
  montoTotalCobroArs: number;
  feeRate: number;
};

/** Neto = lo que cobra Guille; total = lo que paga el cliente vía MP (comisión a cargo del comprador). */
export function calcMaderaCheckoutAmounts(
  metros: number,
  precioMetroArs = getMaderaPrecioMetroLinealArsPublic(),
  feeRate = getMaderaMpCheckoutFeeRate(),
): MaderaCheckoutAmounts {
  const montoNetoArs = Math.round(metros * precioMetroArs);
  const montoTotalCobroArs = Math.ceil(montoNetoArs / (1 - feeRate));
  const montoCargoMpArs = montoTotalCobroArs - montoNetoArs;
  return {
    metros,
    precioMetroArs,
    montoNetoArs,
    montoCargoMpArs,
    montoTotalCobroArs,
    feeRate,
  };
}

export function formatArs(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFeeRatePercent(feeRate: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(feeRate);
}
