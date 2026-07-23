/** Tipos de catálogo (vista pública / panel). */

export type TiendaMedida = {
  label: string;
  valor: string;
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
  stock: number | null;
  activo: boolean;
};

export function getTiendaPrecioTransferencia(producto: Pick<TiendaProducto, "precioArs" | "descuentoTransferenciaPct">) {
  const pct = producto.descuentoTransferenciaPct;
  if (!pct || pct <= 0) return null;
  return Math.round(producto.precioArs * (1 - pct / 100));
}

export function getTiendaCuotaArs(producto: Pick<TiendaProducto, "precioArs" | "cuotas">) {
  if (!producto.cuotas) return null;
  return Math.ceil(producto.precioArs / producto.cuotas);
}
