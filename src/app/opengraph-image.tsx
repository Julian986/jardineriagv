import { ImageResponse } from "next/og";
import { BrandSocialImageMarkup } from "@/components/brand-social-image";

export const alt = "Jardinería GV — Diseño y mantenimiento de jardines en Bahía Blanca";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen Open Graph por defecto. Sobreescribible con `NEXT_PUBLIC_BRAND_OG_IMAGE_URL` en `layout`. */
export default function OpenGraphImage() {
  return new ImageResponse(<BrandSocialImageMarkup />, { ...size });
}
