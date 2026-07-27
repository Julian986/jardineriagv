import { event as gaEvent } from "@/lib/gtag";
import type { TiendaCartItem } from "@/lib/tienda-cart";
import type { TiendaProducto } from "@/lib/tienda/types";

export type TiendaGaItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
};

export function toGaItemFromProducto(
  producto: Pick<TiendaProducto, "id" | "nombre" | "precioArs" | "categoriaLabel">,
  quantity = 1,
): TiendaGaItem {
  return {
    item_id: producto.id,
    item_name: producto.nombre,
    item_category: producto.categoriaLabel,
    price: producto.precioArs,
    quantity,
  };
}

export function toGaItemFromCart(item: TiendaCartItem): TiendaGaItem {
  return {
    item_id: item.productoId,
    item_name: item.nombre,
    price: item.precioArs,
    quantity: item.cantidad,
  };
}

/** Click genérico de UI en la tienda (botones/links). */
export function trackTiendaClick(params: {
  button: string;
  location: string;
  product_id?: string;
  product_name?: string;
  value?: number;
  quantity?: number;
}) {
  gaEvent("tienda_click", {
    event_category: "tienda",
    ...params,
  });
}

export function trackAddToCart(params: {
  location: "catalog_card" | "product_detail";
  producto: Pick<TiendaProducto, "id" | "nombre" | "precioArs" | "categoriaLabel">;
  quantity: number;
}) {
  const item = toGaItemFromProducto(params.producto, params.quantity);
  gaEvent("add_to_cart", {
    currency: "ARS",
    value: item.price * item.quantity,
    items: [item],
    location: params.location,
  });
  trackTiendaClick({
    button: "agregar_al_carrito",
    location: params.location,
    product_id: params.producto.id,
    product_name: params.producto.nombre,
    value: item.price * item.quantity,
    quantity: params.quantity,
  });
}

export function trackViewCart(params: {
  items: TiendaCartItem[];
  value: number;
  location: string;
}) {
  gaEvent("view_cart", {
    currency: "ARS",
    value: params.value,
    items: params.items.map(toGaItemFromCart),
    location: params.location,
  });
  trackTiendaClick({
    button: "carrito",
    location: params.location,
    value: params.value,
  });
}

export function trackBeginCheckout(params: {
  items: TiendaCartItem[];
  value: number;
  location: string;
}) {
  gaEvent("begin_checkout", {
    currency: "ARS",
    value: params.value,
    items: params.items.map(toGaItemFromCart),
    location: params.location,
  });
  trackTiendaClick({
    button: "iniciar_compra",
    location: params.location,
    value: params.value,
  });
}

export function trackContinueToPayment(params: {
  items: TiendaCartItem[];
  value: number;
  entrega: string;
  pedido_id?: string;
}) {
  gaEvent("add_payment_info", {
    currency: "ARS",
    value: params.value,
    payment_type: "mercadopago",
    items: params.items.map(toGaItemFromCart),
    entrega: params.entrega,
    pedido_id: params.pedido_id,
  });
  trackTiendaClick({
    button: "continuar_al_pago",
    location: "checkout",
    value: params.value,
  });
}

export function trackPurchase(params: {
  transaction_id: string;
  value?: number;
  status: string;
}) {
  gaEvent("purchase", {
    currency: "ARS",
    transaction_id: params.transaction_id,
    value: params.value,
    status: params.status,
  });
}

export function trackRemoveFromCart(params: {
  item: TiendaCartItem;
  location: string;
}) {
  gaEvent("remove_from_cart", {
    currency: "ARS",
    value: params.item.precioArs * params.item.cantidad,
    items: [toGaItemFromCart(params.item)],
    location: params.location,
  });
}
