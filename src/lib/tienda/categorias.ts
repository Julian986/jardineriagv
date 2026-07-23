import { ObjectId, type WithId, type Document } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { slugifyTienda } from "@/lib/tienda/slugify";
import type { TiendaCategoria } from "@/lib/tienda/types";

export const COL_CATEGORIAS = "tienda_categorias";

export type TiendaCategoriaDoc = {
  nombre: string;
  slug: string;
  orden: number;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
};

let indexesReady = false;

export async function ensureCategoriasIndexes() {
  if (indexesReady) return;
  const db = await getDb();
  await db.collection(COL_CATEGORIAS).createIndex({ slug: 1 }, { unique: true });
  await db.collection(COL_CATEGORIAS).createIndex({ orden: 1 });
  indexesReady = true;
}

export function mapCategoria(doc: WithId<Document>): TiendaCategoria {
  return {
    id: doc._id.toString(),
    slug: String(doc.slug),
    nombre: String(doc.nombre),
    orden: typeof doc.orden === "number" ? doc.orden : 0,
    activa: doc.activa !== false,
  };
}

export async function listCategorias(opts?: { soloActivas?: boolean }): Promise<TiendaCategoria[]> {
  await ensureCategoriasIndexes();
  const db = await getDb();
  const filter = opts?.soloActivas ? { activa: true } : {};
  const docs = await db
    .collection(COL_CATEGORIAS)
    .find(filter)
    .sort({ orden: 1, nombre: 1 })
    .toArray();
  return docs.map(mapCategoria);
}

export async function getCategoriaById(id: string): Promise<TiendaCategoria | null> {
  if (!ObjectId.isValid(id)) return null;
  await ensureCategoriasIndexes();
  const db = await getDb();
  const doc = await db.collection(COL_CATEGORIAS).findOne({ _id: new ObjectId(id) });
  return doc ? mapCategoria(doc) : null;
}

export async function getCategoriaBySlug(slug: string): Promise<TiendaCategoria | null> {
  await ensureCategoriasIndexes();
  const db = await getDb();
  const doc = await db.collection(COL_CATEGORIAS).findOne({ slug });
  return doc ? mapCategoria(doc) : null;
}

export async function createCategoria(input: {
  nombre: string;
  slug?: string;
  orden?: number;
  activa?: boolean;
}): Promise<TiendaCategoria> {
  await ensureCategoriasIndexes();
  const db = await getDb();
  const now = new Date();
  const slug = input.slug && input.slug.length > 0 ? input.slug : slugifyTienda(input.nombre);
  if (!slug) throw new Error("Slug inválido");

  let orden = input.orden;
  if (orden === undefined) {
    const last = await db
      .collection(COL_CATEGORIAS)
      .find({})
      .sort({ orden: -1 })
      .limit(1)
      .toArray();
    orden = (typeof last[0]?.orden === "number" ? last[0].orden : -1) + 1;
  }

  const doc: TiendaCategoriaDoc = {
    nombre: input.nombre,
    slug,
    orden,
    activa: input.activa ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COL_CATEGORIAS).insertOne(doc);
  return {
    id: result.insertedId.toString(),
    nombre: doc.nombre,
    slug: doc.slug,
    orden: doc.orden,
    activa: doc.activa,
  };
}

export async function updateCategoria(
  id: string,
  patch: Partial<{ nombre: string; slug: string; orden: number; activa: boolean }>,
): Promise<TiendaCategoria | null> {
  if (!ObjectId.isValid(id)) return null;
  await ensureCategoriasIndexes();
  const db = await getDb();
  const $set: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.nombre !== undefined) $set.nombre = patch.nombre;
  if (patch.slug !== undefined) $set.slug = patch.slug;
  if (patch.orden !== undefined) $set.orden = patch.orden;
  if (patch.activa !== undefined) $set.activa = patch.activa;

  const result = await db.collection(COL_CATEGORIAS).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set },
    { returnDocument: "after" },
  );
  return result ? mapCategoria(result) : null;
}

export async function deleteCategoria(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  await ensureCategoriasIndexes();
  const db = await getDb();
  const result = await db.collection(COL_CATEGORIAS).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function countCategorias(): Promise<number> {
  const db = await getDb();
  return db.collection(COL_CATEGORIAS).countDocuments();
}
