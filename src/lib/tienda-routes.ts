export const RUTA_TIENDA = "/tienda";
export const RUTA_CHECKOUT = "/tienda/checkout";
export const RUTA_TIENDA_GRACIAS = "/tienda/gracias";

export const TIENDA_CTA_LABEL = "Tienda online";

export function rutaProductoTienda(slug: string) {
  return `${RUTA_TIENDA}/${slug}`;
}
