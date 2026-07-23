import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import {
  deleteCategoria,
  getCategoriaById,
  updateCategoria,
} from "@/lib/tienda/categorias";
import { requirePanelSession } from "@/lib/tienda/panel-session";
import {
  formatTiendaValidationError,
  TiendaCategoriaWriteSchema,
} from "@/lib/tienda/producto-schema";
import { listProductos } from "@/lib/tienda/productos";
import { slugifyTienda } from "@/lib/tienda/slugify";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const categoria = await getCategoriaById(id);
    if (!categoria) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, categoria });
  } catch (error) {
    console.error("[tienda/categorias/[id] GET]", error);
    return NextResponse.json({ ok: false, error: "Error al cargar" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = TiendaCategoriaWriteSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: formatTiendaValidationError(parsed.error) },
      { status: 400 },
    );
  }

  const raw = parsed.data;
  const patch: Partial<{ nombre: string; slug: string; orden: number; activa: boolean }> = {};
  if (raw.nombre !== undefined) patch.nombre = raw.nombre;
  if (raw.slug !== undefined && raw.slug.trim()) {
    patch.slug = slugifyTienda(raw.slug);
  } else if (raw.nombre !== undefined) {
    patch.slug = slugifyTienda(raw.nombre);
  }
  if (raw.orden !== undefined) patch.orden = raw.orden;
  if (raw.activa !== undefined) patch.activa = raw.activa;

  try {
    const categoria = await updateCategoria(id, patch);
    if (!categoria) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, categoria });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { ok: false, error: "Ya existe una categoría con ese slug." },
        { status: 409 },
      );
    }
    console.error("[tienda/categorias/[id] PATCH]", error);
    return NextResponse.json({ ok: false, error: "No se pudo actualizar" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  try {
    const cat = await getCategoriaById(id);
    if (!cat) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }

    const products = await listProductos({ categoriaSlug: cat.slug });
    if (products.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: `Hay ${products.length} producto(s) en esta categoría. Movélos o desactivalos antes de eliminar.`,
        },
        { status: 409 },
      );
    }

    const ok = await deleteCategoria(id);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[tienda/categorias/[id] DELETE]", error);
    return NextResponse.json({ ok: false, error: "No se pudo eliminar" }, { status: 500 });
  }
}
