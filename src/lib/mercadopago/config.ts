/**
 * Configuración Mercado Pago (solo servidor).
 * @see https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integration-configuration
 */

export function getMercadoPagoAccessToken(): string {
  const t = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!t) {
    throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN en el entorno");
  }
  return t;
}

/** URL pública sin barra final (ej: https://tudominio.com) */
export function getAppBaseUrl(): string {
  const u = (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    ""
  )
    .trim()
    .replace(/\/+$/, "");
  if (!u) {
    throw new Error(
      "Falta APP_BASE_URL (o NEXT_PUBLIC_APP_BASE_URL) en el entorno — URL pública del sitio",
    );
  }
  return u;
}

export function getCronSecret(): string | null {
  const s = process.env.CRON_SECRET?.trim();
  return s && s.length > 0 ? s : null;
}

/** Monto de la visita en ARS (preferencia MP y validación). Misma variable que Marcelo Ponzio pero para reserva completa. */
export function getReservaVisitaMontoArs(): number {
  const raw =
    process.env.MERCADOPAGO_RESERVA_MONTO_ARS?.trim() ??
    process.env.RESERVA_VISITA_MONTO_ARS?.trim() ??
    "30";
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("MERCADOPAGO_RESERVA_MONTO_ARS inválido");
  }
  return Math.round(n);
}

/** Monto mostrado en el cliente (`NEXT_PUBLIC_*` o el mismo valor de servidor). */
export function getReservaVisitaMontoArsPublic(): number {
  const raw =
    process.env.NEXT_PUBLIC_MERCADOPAGO_RESERVA_MONTO_ARS?.trim() ??
    process.env.MERCADOPAGO_RESERVA_MONTO_ARS?.trim() ??
    process.env.RESERVA_VISITA_MONTO_ARS?.trim() ??
    "25000";
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 25000;
}
