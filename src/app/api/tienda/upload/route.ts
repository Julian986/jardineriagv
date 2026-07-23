import { NextResponse } from "next/server";
import { requirePanelSession } from "@/lib/tienda/panel-session";
import { uploadTiendaImage } from "@/lib/tienda/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No se recibió ninguna imagen." },
        { status: 400 },
      );
    }

    const result = await uploadTiendaImage(file);
    return NextResponse.json({ ok: true, url: result.url, storage: result.storage });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo subir la imagen.";
    console.error("[tienda/upload]", error);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
