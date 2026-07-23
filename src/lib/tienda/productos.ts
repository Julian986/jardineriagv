import { ObjectId, type WithId, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getCategoriaById, listCategorias } from "@/lib/tienda/categorias";
import type { TiendaMedida, TiendaProducto } from "@/lib/tienda/types";

export const COL_PRODUCTOS = "tienda_productos";

export type TiendaProductoDoc = {
  nombre: string;
  slug: string;
  categoriaId: ObjectId;
  precioArs: number;
  imagen: string;
  imagenes: string[];
  descripcion: string[];
  descripcionTitulo?: string;
  cuotas?: number;
  descuentoTransferenciaPct?: number;
  highlights?: string[];
  medidas?: TiendaMedida[];
  stock: number | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

let indexesReady = false;

export async function ensureProductosIndexes() {
  if (indexesReady) return;
  const db = await getDb();
  await db.collection(COL_PRODUCTOS).createIndex({ slug: 1 }, { unique: true });
  await db.collection(COL_PRODUCTOS).createIndex({ categoriaId: 1, activo: 1 });
  await db.collection(COL_PRODUCTOS).createIndex({ activo: 1, nombre: 1 });
  indexesReady = true;
}

function mapMedidas(raw: unknown): TiendaMedida[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  return raw
    .map((m) => {
      if (!m || typeof m !== "object") return null;
      const label = "label" in m ? String((m as { label: unknown }).label) : "";
      const valor = "valor" in m ? String((m as { valor: unknown }).valor) : "";
      if (!label || !valor) return null;
      return { label, valor };
    })
    .filter((m): m is TiendaMedida => m !== null);
}

export function mapProducto(
  doc: WithId<Document>,
  categoria?: { slug: string; nombre: string } | null,
): TiendaProducto {
  const imagen = String(doc.imagen ?? "");
  const imagenesRaw = Array.isArray(doc.imagenes) ? doc.imagenes.map(String) : [];
  const imagenes = imagenesRaw.length > 0 ? imagenesRaw : imagen ? [imagen] : [];
  const categoriaId =
    doc.categoriaId instanceof ObjectId
      ? doc.categoriaId.toString()
      : String(doc.categoriaId ?? "");

  return {
    id: doc._id.toString(),
    slug: String(doc.slug),
    nombre: String(doc.nombre),
    categoriaId,
    categoriaSlug: categoria?.slug ?? "",
    categoriaLabel: categoria?.nombre?.toUpperCase() ?? "",
    precioArs: typeof doc.precioArs === "number" ? doc.precioArs : 0,
    imagen: imagen || imagenes[0] || "",
    imagenes,
    cuotas: typeof doc.cuotas === "number" ? doc.cuotas : undefined,
    descuentoTransferenciaPct:
      typeof doc.descuentoTransferenciaPct === "number"
        ? doc.descuentoTransferenciaPct
        : undefined,
    descripcionTitulo:
      typeof doc.descripcionTitulo === "string" && doc.descripcionTitulo
        ? doc.descripcionTitulo
        : undefined,
    descripcion: Array.isArray(doc.descripcion)
      ? doc.descripcion.map(String)
      : [String(doc.descripcion ?? "")],
    highlights: Array.isArray(doc.highlights)
      ? doc.highlights.map(String)
      : undefined,
    medidas: mapMedidas(doc.medidas),
    stock: typeof doc.stock === "number" ? doc.stock : doc.stock === null ? null : null,
    activo: doc.activo !== false,
  };
}

async function categoriaLookupMap() {
  const cats = await listCategorias();
  return new Map(cats.map((c) => [c.id, c]));
}

export async function listProductos(opts?: {
  soloActivos?: boolean;
  categoriaSlug?: string | null;
  q?: string;
}): Promise<TiendaProducto[]> {
  await ensureProductosIndexes();
  const db = await getDb();
  const catMap = await categoriaLookupMap();

  const filter: Record<string, unknown> = {};
  if (opts?.soloActivos) filter.activo = true;

  if (opts?.categoriaSlug) {
    const cat = [...catMap.values()].find((c) => c.slug === opts.categoriaSlug);
    if (!cat) return [];
    filter.categoriaId = new ObjectId(cat.id);
  }

  if (opts?.q?.trim()) {
    const q = opts.q.trim();
    filter.$or = [
      { nombre: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
    ];
  }

  const docs = await db
    .collection(COL_PRODUCTOS)
    .find(filter)
    .sort({ updatedAt: -1, nombre: 1 })
    .toArray();

  return docs.map((doc) => {
    const catId =
      doc.categoriaId instanceof ObjectId
        ? doc.categoriaId.toString()
        : String(doc.categoriaId ?? "");
    const cat = catMap.get(catId);
    return mapProducto(doc, cat ? { slug: cat.slug, nombre: cat.nombre } : null);
  });
}

export async function getProductoById(id: string): Promise<TiendaProducto | null> {
  if (!ObjectId.isValid(id)) return null;
  await ensureProductosIndexes();
  const db = await getDb();
  const doc = await db.collection(COL_PRODUCTOS).findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  const catId =
    doc.categoriaId instanceof ObjectId
      ? doc.categoriaId.toString()
      : String(doc.categoriaId ?? "");
  const cat = await getCategoriaById(catId);
  return mapProducto(doc, cat ? { slug: cat.slug, nombre: cat.nombre } : null);
}

export async function getProductoBySlug(
  slug: string,
  opts?: { soloActivos?: boolean },
): Promise<TiendaProducto | null> {
  await ensureProductosIndexes();
  const db = await getDb();
  const filter: Record<string, unknown> = { slug };
  if (opts?.soloActivos) filter.activo = true;
  const doc = await db.collection(COL_PRODUCTOS).findOne(filter);
  if (!doc) return null;
  const catId =
    doc.categoriaId instanceof ObjectId
      ? doc.categoriaId.toString()
      : String(doc.categoriaId ?? "");
  const cat = await getCategoriaById(catId);
  return mapProducto(doc, cat ? { slug: cat.slug, nombre: cat.nombre } : null);
}

export async function getProductosRelacionados(
  producto: TiendaProducto,
  limit = 4,
): Promise<TiendaProducto[]> {
  if (!producto.categoriaId || !ObjectId.isValid(producto.categoriaId)) return [];
  await ensureProductosIndexes();
  const db = await getDb();
  const docs = await db
    .collection(COL_PRODUCTOS)
    .find({
      activo: true,
      categoriaId: new ObjectId(producto.categoriaId),
      _id: { $ne: new ObjectId(producto.id) },
    })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map((doc) =>
    mapProducto(doc, {
      slug: producto.categoriaSlug,
      nombre: producto.categoriaLabel,
    }),
  );
}

export async function createProducto(input: {
  nombre: string;
  slug: string;
  categoriaId: string;
  precioArs: number;
  imagen: string;
  imagenes: string[];
  descripcion: string[];
  descripcionTitulo?: string;
  cuotas?: number;
  descuentoTransferenciaPct?: number;
  highlights?: string[];
  medidas?: TiendaMedida[];
  stock: number | null;
  activo: boolean;
}): Promise<TiendaProducto> {
  if (!ObjectId.isValid(input.categoriaId)) {
    throw new Error("Categoría inválida");
  }
  await ensureProductosIndexes();
  const cat = await getCategoriaById(input.categoriaId);
  if (!cat) throw new Error("Categoría no encontrada");

  const db = await getDb();
  const now = new Date();
  const doc: TiendaProductoDoc = {
    nombre: input.nombre,
    slug: input.slug,
    categoriaId: new ObjectId(input.categoriaId),
    precioArs: input.precioArs,
    imagen: input.imagen,
    imagenes: input.imagenes,
    descripcion: input.descripcion,
    stock: input.stock,
    activo: input.activo,
    createdAt: now,
    updatedAt: now,
  };
  if (input.descripcionTitulo) doc.descripcionTitulo = input.descripcionTitulo;
  if (input.cuotas) doc.cuotas = input.cuotas;
  if (input.descuentoTransferenciaPct !== undefined) {
    doc.descuentoTransferenciaPct = input.descuentoTransferenciaPct;
  }
  if (input.highlights?.length) doc.highlights = input.highlights;
  if (input.medidas?.length) doc.medidas = input.medidas;

  const result = await db.collection(COL_PRODUCTOS).insertOne(doc);
  return mapProducto(
    { ...doc, _id: result.insertedId },
    { slug: cat.slug, nombre: cat.nombre },
  );
}

export async function updateProducto(
  id: string,
  patch: Partial<{
    nombre: string;
    slug: string;
    categoriaId: string;
    precioArs: number;
    imagen: string;
    imagenes: string[];
    descripcion: string[];
    descripcionTitulo: string | null;
    cuotas: number | null;
    descuentoTransferenciaPct: number | null;
    highlights: string[] | null;
    medidas: TiendaMedida[] | null;
    stock: number | null;
    activo: boolean;
  }>,
): Promise<TiendaProducto | null> {
  if (!ObjectId.isValid(id)) return null;
  await ensureProductosIndexes();
  const db = await getDb();

  const $set: Record<string, unknown> = { updatedAt: new Date() };
  const $unset: Record<string, ""> = {};

  if (patch.nombre !== undefined) $set.nombre = patch.nombre;
  if (patch.slug !== undefined) $set.slug = patch.slug;
  if (patch.precioArs !== undefined) $set.precioArs = patch.precioArs;
  if (patch.imagen !== undefined) $set.imagen = patch.imagen;
  if (patch.imagenes !== undefined) $set.imagenes = patch.imagenes;
  if (patch.descripcion !== undefined) $set.descripcion = patch.descripcion;
  if (patch.stock !== undefined) $set.stock = patch.stock;
  if (patch.activo !== undefined) $set.activo = patch.activo;

  if (patch.categoriaId !== undefined) {
    if (!ObjectId.isValid(patch.categoriaId)) throw new Error("Categoría inválida");
    const cat = await getCategoriaById(patch.categoriaId);
    if (!cat) throw new Error("Categoría no encontrada");
    $set.categoriaId = new ObjectId(patch.categoriaId);
  }

  const optionalNullables = [
    "descripcionTitulo",
    "cuotas",
    "descuentoTransferenciaPct",
    "highlights",
    "medidas",
  ] as const;

  for (const key of optionalNullables) {
    if (patch[key] === undefined) continue;
    if (patch[key] === null) $unset[key] = "";
    else $set[key] = patch[key];
  }

  const update: Record<string, unknown> = { $set };
  if (Object.keys($unset).length > 0) update.$unset = $unset;

  const result = await db.collection(COL_PRODUCTOS).findOneAndUpdate(
    { _id: new ObjectId(id) },
    update,
    { returnDocument: "after" },
  );
  if (!result) return null;

  const catId =
    result.categoriaId instanceof ObjectId
      ? result.categoriaId.toString()
      : String(result.categoriaId ?? "");
  const cat = await getCategoriaById(catId);
  return mapProducto(result, cat ? { slug: cat.slug, nombre: cat.nombre } : null);
}

export async function deleteProducto(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  await ensureProductosIndexes();
  const db = await getDb();
  const result = await db.collection(COL_PRODUCTOS).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function countProductos(): Promise<number> {
  const db = await getDb();
  return db.collection(COL_PRODUCTOS).countDocuments();
}
