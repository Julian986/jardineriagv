/** Aliado comercial Terekua — MVP derivación con código de Guille. */

export const TEREKUA_SITE_URL = "https://www.terekua.com.ar/";

export const TEREKUA_LOGO_PATH = "/terekua-logo.webp";

const UTM = {
  source: "jardineriagv",
  medium: "partner",
  campaign: "terekua_mvp",
} as const;

/** URL con código de referido que entrega Terekua (ej. https://www.terekua.com.ar/?ref=XXXX). */
export function getTerekuaPartnerUrlRaw(): string | null {
  const raw = process.env.NEXT_PUBLIC_TEREKUA_PARTNER_URL?.trim();
  return raw && raw.length > 0 ? raw : null;
}

/** true cuando Guille cargó el link con código; false = vista previa (diseño visible, sin atribución). */
export function isTerekuaPartnerConfigured(): boolean {
  return getTerekuaPartnerUrlRaw() != null;
}

/** URL final con UTM para medición (preserva query del código de Guille). */
export function buildTerekuaPartnerHref(location: string): string {
  const raw = getTerekuaPartnerUrlRaw();
  if (!raw) return TEREKUA_SITE_URL;

  try {
    const url = new URL(raw);
    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", UTM.source);
    }
    if (!url.searchParams.has("utm_medium")) {
      url.searchParams.set("utm_medium", UTM.medium);
    }
    if (!url.searchParams.has("utm_campaign")) {
      url.searchParams.set("utm_campaign", UTM.campaign);
    }
    url.searchParams.set("utm_content", location);
    return url.toString();
  } catch {
    return raw;
  }
}

export const TEREKUA_CTA_LABEL = "Ir a Terekua";
export const TEREKUA_MVP_TITULO = "Comprá en Terekua";
export const TEREKUA_MVP_DESCRIPCION =
  "Productos para jardín y hogar a través de nuestro aliado comercial.";
export const TEREKUA_MVP_NOTA = "La compra y el envío los gestiona Terekua.";
export const TEREKUA_MVP_PREVIEW_NOTA =
  "Vista previa del diseño. El enlace con tu código de referido se activa al publicar la URL de partner.";
