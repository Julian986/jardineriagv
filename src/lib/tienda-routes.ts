export const RUTA_TIENDA = "/tienda";

export const TIENDA_CTA_LABEL = "Tienda online";

export function rutaProductoTienda(slug: string) {
  return `${RUTA_TIENDA}/${slug}`;
}
