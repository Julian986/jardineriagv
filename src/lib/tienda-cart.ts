export const TIENDA_CART_STORAGE_KEY = "jardineriagv-tienda-cart";

export type TiendaCartItem = {
  productoId: string;
  slug: string;
  nombre: string;
  precioArs: number;
  imagen: string;
  cantidad: number;
  colorId?: string;
  colorNombre?: string;
};

export function tiendaCartLineKey(item: Pick<TiendaCartItem, "productoId" | "colorId">): string {
  return item.colorId ? `${item.productoId}::${item.colorId}` : item.productoId;
}

export function calcTiendaCartSubtotal(items: TiendaCartItem[]): number {
  return items.reduce((sum, item) => sum + item.precioArs * item.cantidad, 0);
}

export function calcTiendaCartItemCount(items: TiendaCartItem[]): number {
  return items.reduce((sum, item) => sum + item.cantidad, 0);
}

export function formatTiendaCartItemNombre(item: Pick<TiendaCartItem, "nombre" | "colorNombre">) {
  if (item.colorNombre) return `${item.nombre} · ${item.colorNombre}`;
  return item.nombre;
}
