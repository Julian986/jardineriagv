import {
  countCategorias,
  createCategoria,
  ensureCategoriasIndexes,
  listCategorias,
} from "@/lib/tienda/categorias";
import {
  countProductos,
  createProducto,
  ensureProductosIndexes,
} from "@/lib/tienda/productos";
import {
  TIENDA_CATEGORIAS_DEMO,
  TIENDA_PRODUCTOS_DEMO,
} from "@/lib/tienda-demo";

export type SeedTiendaResult = {
  seeded: boolean;
  categorias: number;
  productos: number;
  message: string;
};

/**
 * Si las colecciones están vacías, copia categorías y productos demo.
 * Idempotente: no hace nada si ya hay datos.
 */
export async function seedTiendaIfEmpty(): Promise<SeedTiendaResult> {
  await ensureCategoriasIndexes();
  await ensureProductosIndexes();

  const [catCount, prodCount] = await Promise.all([countCategorias(), countProductos()]);

  if (catCount > 0 || prodCount > 0) {
    return {
      seeded: false,
      categorias: catCount,
      productos: prodCount,
      message: "Ya hay datos en la tienda; no se sembraron demos.",
    };
  }

  for (let i = 0; i < TIENDA_CATEGORIAS_DEMO.length; i++) {
    const cat = TIENDA_CATEGORIAS_DEMO[i];
    await createCategoria({
      nombre: cat.nombre,
      slug: cat.slug,
      orden: i,
      activa: true,
    });
  }

  const categorias = await listCategorias();
  const bySlug = new Map(categorias.map((c) => [c.slug, c]));

  let created = 0;
  for (const p of TIENDA_PRODUCTOS_DEMO) {
    const cat = bySlug.get(p.categoriaSlug);
    if (!cat) continue;
    await createProducto({
      nombre: p.nombre,
      slug: p.slug,
      categoriaId: cat.id,
      precioArs: p.precioArs,
      imagen: p.imagen,
      imagenes: p.imagenes?.length ? p.imagenes : [p.imagen],
      descripcion: p.descripcion,
      descripcionTitulo: p.descripcionTitulo,
      cuotas: p.cuotas,
      descuentoTransferenciaPct: p.descuentoTransferenciaPct,
      highlights: p.highlights,
      medidas: p.medidas,
      stock: null,
      activo: true,
    });
    created += 1;
  }

  return {
    seeded: true,
    categorias: categorias.length,
    productos: created,
    message: `Se sembraron ${categorias.length} categorías y ${created} productos demo.`,
  };
}
