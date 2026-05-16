/** JSX compartido para `opengraph-image` y `twitter-image` (motor Satori / `next/og`). */
export function BrandSocialImageMarkup() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #1a3d0f 0%, #2d5016 45%, #3d6b1f 100%)",
        color: "white",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: 48,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em" }}>Jardinería GV</span>
        <span style={{ fontSize: 28, fontWeight: 500, opacity: 0.92 }}>
          Diseño y mantenimiento de jardines · Bahía Blanca
        </span>
      </div>
    </div>
  );
}
