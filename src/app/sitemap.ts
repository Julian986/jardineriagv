import type { MetadataRoute } from "next";
import { siteMetadataBase } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMetadataBase().toString().replace(/\/$/, "");
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/reservar`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${base}/decoracion-plantas-macetas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/parquizacion-diseno-exterior`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/proteccion-biodiversidad`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
