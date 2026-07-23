import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { requirePanelSession } from "@/lib/tienda/panel-session";
import {
  formatTiendaValidationError,
  TiendaProductoPatchSchema,
} from "@/lib/tienda/producto-schema";
import {
  deleteProducto,
  getProductoById,
  updateProducto,
} from "@/lib/tienda/productos";
import type { TiendaMedida } from "@/lib/tienda/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const producto = await getProductoById(id);
    if (!producto) {
      return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
    }

    const auth = await requirePanelSession();
    if (!producto.activo && !auth.ok) {
      return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, producto });
  } catch (error) {
    console.error("[tienda/productos/[id] GET]", error);
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

  const parsed = TiendaProductoPatchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: formatTiendaValidationError(parsed.error) },
      { status: 400 },
    );
  }

  const data = parsed.data as Record<string, unknown>;
  const patch: Parameters<typeof updateProducto>[1] = {};

  if (typeof data.nombre === "string") patch.nombre = data.nombre;
  if (typeof data.slug === "string") patch.slug = data.slug;
  if (typeof data.categoriaId === "string") patch.categoriaId = data.categoriaId;
  if (typeof data.precioArs === "number") patch.precioArs = data.precioArs;
  if (typeof data.imagen === "string") patch.imagen = data.imagen;
  if (Array.isArray(data.imagenes)) patch.imagenes = data.imagenes as string[];
  if (Array.isArray(data.descripcion)) patch.descripcion = data.descripcion as string[];
  if (data.descripcionTitulo === null) patch.descripcionTitulo = null;
  else if (typeof data.descripcionTitulo === "string") {
    patch.descripcionTitulo = data.descripcionTitulo;
  }
  if (data.cuotas === null) patch.cuotas = null;
  else if (typeof data.cuotas === "number") patch.cuotas = data.cuotas;
  if (data.descuentoTransferenciaPct === null) patch.descuentoTransferenciaPct = null;
  else if (typeof data.descuentoTransferenciaPct === "number") {
    patch.descuentoTransferenciaPct = data.descuentoTransferenciaPct;
  }
  if (data.highlights === null) patch.highlights = null;
  else if (Array.isArray(data.highlights)) patch.highlights = data.highlights as string[];
  if (data.medidas === null) patch.medidas = null;
  else if (Array.isArray(data.medidas)) patch.medidas = data.medidas as TiendaMedida[];
  if (data.stock !== undefined) patch.stock = data.stock as number | null;
  if (typeof data.activo === "boolean") patch.activo = data.activo;

  try {
    const producto = await updateProducto(id, patch);
    if (!producto) {
      return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, producto });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Categoría")) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        { ok: false, error: "Ya existe un producto con ese slug." },
        { status: 409 },
      );
    }
    console.error("[tienda/productos/[id] PATCH]", error);
    return NextResponse.json({ ok: false, error: "No se pudo actualizar" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  try {
    const ok = await deleteProducto(id);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[tienda/productos/[id] DELETE]", error);
    return NextResponse.json({ ok: false, error: "No se pudo eliminar" }, { status: 500 });
  }
}
