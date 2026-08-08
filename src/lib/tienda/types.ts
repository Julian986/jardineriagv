/** Tipos de catálogo (vista pública / panel). */

export type TiendaMedida = {
  label: string;
  valor: string;
};

/** Variante de color de un producto (ej. maceta terracota / blanca). */
export type TiendaColor = {
  id: string;
  nombre: string;
  /** Color de muestra en el selector (ej. #c4933f). */
  hex?: string;
  /** Foto opcional de esa variante. */
  imagen?: string;
};

export type TiendaCategoria = {
  id: string;
  slug: string;
  nombre: string;
  orden: number;
  activa: boolean;
};

/** Shape que consumen cards, ficha y carrito. */
export type TiendaProducto = {
  id: string;
  slug: string;
  nombre: string;
  categoriaId: string;
  categoriaSlug: string;
  categoriaLabel: string;
  precioArs: number;
  imagen: string;
  imagenes: string[];
  cuotas?: number;
  descuentoTransferenciaPct?: number;
  descripcionTitulo?: string;
  descripcion: string[];
  highlights?: string[];
  medidas?: TiendaMedida[];
  /** Si hay 2 o más, la ficha muestra selector de color. */
  colores?: TiendaColor[];
  stock: number | null;
  activo: boolean;
};

export function productoRequiereColor(
  producto: Pick<TiendaProducto, "colores">,
): boolean {
  return (producto.colores?.length ?? 0) > 1;
}

export function findProductoColor(
  producto: Pick<TiendaProducto, "colores">,
  colorId: string | undefined | null,
): TiendaColor | undefined {
  if (!colorId || !producto.colores?.length) return undefined;
  return producto.colores.find((c) => c.id === colorId);
}

export function getTiendaPrecioTransferencia(producto: Pick<TiendaProducto, "precioArs" | "descuentoTransferenciaPct">) {
  const pct = producto.descuentoTransferenciaPct;
  if (!pct || pct <= 0) return null;
  return Math.round(producto.precioArs * (1 - pct / 100));
}

export function getTiendaCuotaArs(producto: Pick<TiendaProducto, "precioArs" | "cuotas">) {
  if (!producto.cuotas) return null;
  return Math.ceil(producto.precioArs / producto.cuotas);
}
