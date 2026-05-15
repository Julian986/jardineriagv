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
  const u = process.env.APP_BASE_URL?.trim().replace(/\/+$/, "");
  if (!u) {
    throw new Error("Falta APP_BASE_URL en el entorno (URL pública del sitio)");
  }
  return u;
}

export function getCronSecret(): string | null {
  const s = process.env.CRON_SECRET?.trim();
  return s && s.length > 0 ? s : null;
}
