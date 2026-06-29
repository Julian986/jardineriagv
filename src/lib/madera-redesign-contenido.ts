import {
  MADERA_INTRO_HOME,
  MADERA_PINOTEA_CARACTERISTICAS,
  MADERA_PINOTEA_CIERRE,
  MADERA_PINOTEA_INTRO,
  MADERA_PINOTEA_NOTA_MEDIDA,
  MADERA_PINOTEA_PROCESO,
  MADERA_PINOTEA_SUBTITULO,
  MADERA_PINOTEA_UNICIDAD,
  MADERA_SECCION_SUBTITULO,
  MADERA_TAGLINE,
} from "@/lib/madera-contenido";
import { MADERA_PRODUCTO_TITULO } from "@/lib/madera-productos";

export {
  MADERA_INTRO_HOME,
  MADERA_PINOTEA_CARACTERISTICAS,
  MADERA_PINOTEA_CIERRE,
  MADERA_PINOTEA_INTRO,
  MADERA_PINOTEA_NOTA_MEDIDA,
  MADERA_PINOTEA_PROCESO,
  MADERA_PINOTEA_SUBTITULO,
  MADERA_PINOTEA_UNICIDAD,
  MADERA_TAGLINE,
  MADERA_PRODUCTO_TITULO,
};

export const TITULO_MADERA = MADERA_SECCION_SUBTITULO;

export const MADERA_HERO_IMAGEN = "/madera_detail.webp";
export const MADERA_FEATURE_IMAGEN = "/madera.webp";

export const MADERA_HERO_BADGE = "Muebles con historia";
export const MADERA_HERO_TITULO_LINEA1 = "Muebles con historia";
export const MADERA_HERO_TITULO_LINEA2 = "Artesanía en madera recuperada";
export const MADERA_HERO_DESCRIPCION = MADERA_INTRO_HOME;

export const MADERA_META = [
  { icon: "ruler" as const, label: "A medida" },
  { icon: "hammer" as const, label: "Hecho artesanalmente" },
  { icon: "recycle" as const, label: "100% sustentable" },
] as const;

export const MADERA_STATS = [
  { valor: "2", label: "Espesores disponibles" },
  { valor: "100%", label: "Sustentable" },
  { valor: "A medida", label: "Según tu espacio" },
] as const;

export const MADERA_PRODUCTO_SECTION_LABEL = "Producto";
export const MADERA_PRODUCTO_SECTION_TITULO = MADERA_PRODUCTO_TITULO;
export const MADERA_PRODUCTO_SECTION_SUBTITULO = MADERA_PINOTEA_SUBTITULO;

export const MADERA_CARACTERISTICAS = [
  { id: "medida", texto: MADERA_PINOTEA_CARACTERISTICAS[0], icon: "ruler" as const },
  { id: "soporte", texto: MADERA_PINOTEA_CARACTERISTICAS[1], icon: "eye-off" as const },
  { id: "terminacion", texto: MADERA_PINOTEA_CARACTERISTICAS[2], icon: "sparkles" as const },
  { id: "ambientes", texto: MADERA_PINOTEA_CARACTERISTICAS[3], icon: "home" as const },
  { id: "madera", texto: MADERA_PINOTEA_CARACTERISTICAS[4], icon: "tree" as const },
] as const;

export const MADERA_PROCESO_SECTION_LABEL = "Proceso";
export const MADERA_PROCESO_TITULO = "Proceso artesanal";
export const MADERA_PROCESO_SUBTITULO =
  "Cada estante pasa por un trabajo manual cuidadoso, desde la selección de la tabla hasta el acabado final.";

export const MADERA_USOS_SECTION_LABEL = "Usos";
export const MADERA_USOS_TITULO = "Perfectos para";
export const MADERA_USOS = [
  { id: "plantas", titulo: "Plantas", icon: "sprout" as const },
  { id: "libros", titulo: "Libros", icon: "book" as const },
  { id: "decoracion", titulo: "Decoración", icon: "sparkles" as const },
  { id: "cocina", titulo: "Cocina y cafeteras", icon: "coffee" as const },
] as const;

export const MADERA_GALERIA_TITULO = "Galería";
export const MADERA_GALERIA_IMAGENES = [
  { src: "/madera_detail.webp", alt: "Estantes flotantes de pinotea en ambiente" },
  { src: "/madera.webp", alt: "Madera recuperada artesanal" },
] as const;
