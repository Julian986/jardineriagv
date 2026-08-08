import type { TiendaColor, TiendaProducto } from "@/lib/tienda/types";

export type TiendaColorOption = {
  id: string;
  nombre: string;
  hex?: string;
  /** Imagen que se muestra al elegir esta opción. */
  imageSrc: string;
  /** true si existe en producto.colores (no es opción sintética por foto extra). */
  fromCatalog: boolean;
};

function productImages(producto: Pick<TiendaProducto, "imagen" | "imagenes">): string[] {
  const list =
    producto.imagenes?.length > 0 ? producto.imagenes : [producto.imagen];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const src = raw?.trim();
    if (!src || seen.has(src)) continue;
    seen.add(src);
    out.push(src);
  }
  return out;
}

/**
 * Una opción clickeable por cada foto distinta:
 * 1) fotos de la galería del producto (en orden)
 * 2) fotos propias de cada color que no estén ya en la galería
 */
export function buildTiendaColorOptions(
  producto: Pick<TiendaProducto, "imagen" | "imagenes" | "colores">,
): TiendaColorOption[] {
  const productImgs = productImages(producto);
  const colores = producto.colores ?? [];

  const allImages: string[] = [];
  const push = (src?: string | null) => {
    const url = src?.trim();
    if (!url || allImages.includes(url)) return;
    allImages.push(url);
  };

  for (const src of productImgs) push(src);
  for (const color of colores) push(color.imagen);

  if (allImages.length === 0) return [];

  const claimed = new Set<string>();

  return allImages.map((src, i) => {
    const owner = colores.find((c) => c.imagen?.trim() === src);
    if (owner) {
      claimed.add(owner.id);
      return {
        id: owner.id,
        nombre: owner.nombre,
        ...(owner.hex ? { hex: owner.hex } : {}),
        imageSrc: src,
        fromCatalog: true,
      };
    }

    const byIndex = colores[i];
    const indexAvailable =
      byIndex &&
      !claimed.has(byIndex.id) &&
      !(
        byIndex.imagen?.trim() &&
        allImages.includes(byIndex.imagen.trim()) &&
        byIndex.imagen.trim() !== src
      );

    if (indexAvailable && byIndex) {
      claimed.add(byIndex.id);
      return {
        id: byIndex.id,
        nombre: byIndex.nombre,
        ...(byIndex.hex ? { hex: byIndex.hex } : {}),
        imageSrc: src,
        fromCatalog: true,
      };
    }

    const free = colores.find((c) => {
      if (claimed.has(c.id)) return false;
      const own = c.imagen?.trim();
      if (own && allImages.includes(own) && own !== src) return false;
      return true;
    });

    if (free) {
      claimed.add(free.id);
      return {
        id: free.id,
        nombre: free.nombre,
        ...(free.hex ? { hex: free.hex } : {}),
        imageSrc: src,
        fromCatalog: true,
      };
    }

    return {
      id: `foto-${i}`,
      nombre: `Opción ${i + 1}`,
      imageSrc: src,
      fromCatalog: false,
    };
  });
}

export function galleryFromColorOptions(options: TiendaColorOption[]): string[] {
  return options.map((o) => o.imageSrc).filter(Boolean);
}

export function toCartColor(option: TiendaColorOption): TiendaColor {
  return {
    id: option.id,
    nombre: option.nombre,
    ...(option.hex ? { hex: option.hex } : {}),
    imagen: option.imageSrc,
  };
}
