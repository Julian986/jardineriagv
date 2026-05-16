import { ImageResponse } from "next/og";
import { BrandSocialImageMarkup } from "@/components/brand-social-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon por defecto (sin logo de Vercel). Sobreescribible con `NEXT_PUBLIC_BRAND_ICON_URL` en `layout`. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2d5016",
          color: "white",
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        GV
      </div>
    ),
    { ...size },
  );
}
