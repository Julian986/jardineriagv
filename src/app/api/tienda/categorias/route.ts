import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { createCategoria, listCategorias } from "@/lib/tienda/categorias";
import { requirePanelSession } from "@/lib/tienda/panel-session";
import {
  formatTiendaValidationError,
  normalizeCategoriaWrite,
  TiendaCategoriaWriteSchema,
} from "@/lib/tienda/producto-schema";
import { seedTiendaIfEmpty } from "@/lib/tienda/seed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "1";

    if (admin) {
      const auth = await requirePanelSession();
      if (!auth.ok) return auth.response;
      await seedTiendaIfEmpty();
      const categorias = await listCategorias();
      return NextResponse.json({ ok: true, categorias });
    }

    const categorias = await listCategorias({ soloActivas: true });
    return NextResponse.json({ ok: true, categorias });
  } catch (error) {
    console.error("[tienda/categorias GET]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar las categorías" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = TiendaCategoriaWriteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: formatTiendaValidationError(parsed.error) },
      { status: 400 },
    );
  }

  const data = normalizeCategoriaWrite(parsed.data);

  try {
    const categoria = await createCategoria({
      nombre: data.nombre,
      slug: data.slug,
      orden: data.orden,
      activa: data.activa,
    });
    return NextResponse.json({ ok: true, categoria }, { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { ok: false, error: "Ya existe una categoría con ese slug." },
        { status: 409 },
      );
    }
    console.error("[tienda/categorias POST]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo crear la categoría" },
      { status: 500 },
    );
  }
}
