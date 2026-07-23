import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { requirePanelSession } from "@/lib/tienda/panel-session";
import {
  formatTiendaValidationError,
  TiendaProductoWriteSchema,
} from "@/lib/tienda/producto-schema";
import { createProducto, listProductos } from "@/lib/tienda/productos";
import { seedTiendaIfEmpty } from "@/lib/tienda/seed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "1";
    const categoria = searchParams.get("categoria");
    const q = searchParams.get("q") ?? undefined;

    if (admin) {
      const auth = await requirePanelSession();
      if (!auth.ok) return auth.response;
      await seedTiendaIfEmpty();
      const productos = await listProductos({
        categoriaSlug: categoria,
        q,
      });
      return NextResponse.json({ ok: true, productos });
    }

    const productos = await listProductos({
      soloActivos: true,
      categoriaSlug: categoria,
      q,
    });
    return NextResponse.json({ ok: true, productos });
  } catch (error) {
    console.error("[tienda/productos GET]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar los productos" },
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

  const parsed = TiendaProductoWriteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: formatTiendaValidationError(parsed.error) },
      { status: 400 },
    );
  }

  const data = parsed.data;
  try {
    const producto = await createProducto({
      nombre: data.nombre,
      slug: data.slug,
      categoriaId: data.categoriaId,
      precioArs: data.precioArs,
      imagen: data.imagen,
      imagenes: data.imagenes,
      descripcion: data.descripcion,
      descripcionTitulo: data.descripcionTitulo,
      cuotas: data.cuotas,
      descuentoTransferenciaPct: data.descuentoTransferenciaPct,
      highlights: data.highlights,
      medidas: data.medidas,
      stock: data.stock,
      activo: data.activo,
    });
    return NextResponse.json({ ok: true, producto }, { status: 201 });
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
    console.error("[tienda/productos POST]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo crear el producto" },
      { status: 500 },
    );
  }
}
