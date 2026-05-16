import type { Metadata } from "next";

const defaultTitle = "Jardinería GV — Diseño y mantenimiento de jardines en Bahía Blanca";
const defaultDescription =
  "Jardinería profesional en Bahía Blanca. Diseño de jardines desde cero, mantenimiento, riego automático y asesoramiento. Agendá una visita sin cargo.";

/** Base absoluta para `og:image`, iconos y URLs en metadatos (requerido para previews correctas). */
export function siteMetadataBase(): URL {
  const raw = process.env.APP_BASE_URL?.trim() || process.env.NEXT_PUBLIC_APP_BASE_URL?.trim();
  if (raw) {
    const normalized = raw.replace(/\/+$/, "");
    return new URL(`${normalized}/`);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}/`);
  }
  return new URL("http://localhost:6402/");
}

/**
 * URLs opcionales (absolutas, https) cuando tengan logo / arte final en CDN u otro host.
 * Si no están definidas, se usan las rutas generadas `icon`, `opengraph-image` y `twitter-image`.
 */
export function buildSiteMetadata(): Metadata {
  const metadataBase = siteMetadataBase();
  const iconCustom = process.env.NEXT_PUBLIC_BRAND_ICON_URL?.trim();
  const ogCustom = process.env.NEXT_PUBLIC_BRAND_OG_IMAGE_URL?.trim();

  const icons: Metadata["icons"] = iconCustom
    ? { icon: iconCustom, shortcut: iconCustom, apple: iconCustom }
    : { icon: [{ url: "/icon", sizes: "32x32", type: "image/png" }] };

  const ogImageUrl = ogCustom
    ? ogCustom
    : new URL("/opengraph-image", metadataBase).toString();

  const twitterImageUrl = ogCustom
    ? ogCustom
    : new URL("/twitter-image", metadataBase).toString();

  return {
    metadataBase,
    title: defaultTitle,
    description: defaultDescription,
    icons,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      locale: "es_AR",
      type: "website",
      siteName: "Jardinería GV",
      url: metadataBase,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: defaultTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [twitterImageUrl],
    },
  };
}
