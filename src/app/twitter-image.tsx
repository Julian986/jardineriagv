import { ImageResponse } from "next/og";
import { BrandSocialImageMarkup } from "@/components/brand-social-image";

export const alt = "Jardinería GV — Diseño y mantenimiento de jardines en Bahía Blanca";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Twitter / X card por defecto (misma marca que Open Graph). */
export default function TwitterImage() {
  return new ImageResponse(<BrandSocialImageMarkup />, { ...size });
}
