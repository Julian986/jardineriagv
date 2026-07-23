import { NextResponse } from "next/server";
import { requirePanelSession } from "@/lib/tienda/panel-session";
import { seedTiendaIfEmpty } from "@/lib/tienda/seed";

/** Sembrar categorías/productos demo si las colecciones están vacías. */
export async function POST() {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  try {
    const result = await seedTiendaIfEmpty();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[tienda/seed POST]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo sembrar el catálogo demo" },
      { status: 500 },
    );
  }
}
