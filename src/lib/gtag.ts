/** ID de medición GA4 (formato G-XXXXXXXXXX). Solo se usa en producción. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export const isGAEnabled =
  process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID.length > 0;

type GtagCommand = "config" | "event" | "js" | "set";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: GtagCommand,
      targetId: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

function gtag(
  command: GtagCommand,
  targetId: string | Date,
  params?: Record<string, unknown>,
) {
  if (!isGAEnabled || typeof window === "undefined" || !window.gtag) return;
  window.gtag(command, targetId, params);
}

/** Registra una vista de página (rutas App Router / SPA). */
export function pageview(url: string) {
  if (!isGAEnabled) return;
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/** Evento personalizado GA4. */
export function event(
  action: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  if (!isGAEnabled) return;
  gtag("event", action, params);
}
