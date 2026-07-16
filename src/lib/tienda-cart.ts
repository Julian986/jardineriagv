export const TIENDA_CART_STORAGE_KEY = "jardineriagv-tienda-cart";

export type TiendaCartItem = {
  productoId: string;
  slug: string;
  nombre: string;
  precioArs: number;
  imagen: string;
  cantidad: number;
};

export function calcTiendaCartSubtotal(items: TiendaCartItem[]): number {
  return items.reduce((sum, item) => sum + item.precioArs * item.cantidad, 0);
}

export function calcTiendaCartItemCount(items: TiendaCartItem[]): number {
  return items.reduce((sum, item) => sum + item.cantidad, 0);
}
