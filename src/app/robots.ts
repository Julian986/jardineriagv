import type { MetadataRoute } from "next";
import { siteMetadataBase } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const base = siteMetadataBase();
  const siteUrl = base.toString().replace(/\/$/, "");

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
