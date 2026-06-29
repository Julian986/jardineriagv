import { PROYECTO_NAPOSTA_SECCIONES } from "@/lib/biodiversidad-naposta-contenido";
import { TITULO_PROYECTO_NAPOSTA } from "@/lib/biodiversidad-titulos";

export const NAPOSTA_HERO_IMAGEN_MOBILE = "/biodiversidad.webp";
export const NAPOSTA_HERO_IMAGEN_DESKTOP = "/biodiversidad.webp";
export const NAPOSTA_FEATURE_IMAGEN_MOBILE = "/decoracion.webp";
export const NAPOSTA_FEATURE_IMAGEN_DESKTOP = "/ultimas imagenes/5.webp";

export const NAPOSTA_HERO_BADGE = "Proyecto destacado";
export const NAPOSTA_HERO_TITULO_LINEA1 = "Proyecto Sostenible";
export const NAPOSTA_HERO_TITULO_LINEA2 = "Canal Maldonado";
export const NAPOSTA_HERO_DESCRIPCION =
  "Canal de alivio del Río Napostá. Ingeniería ecológica, sustentabilidad y paisajismo autóctono para una integración armónica con el entorno natural.";

export const NAPOSTA_INTRO =
  "A continuación se detallan las estrategias clave de ingeniería ecológica, sustentabilidad y paisajismo autóctono para lograr una integración armónica con el entorno natural del Canal Maldonado.";

export const NAPOSTA_META = [
  { icon: "pin" as const, label: "Bahía Blanca, Argentina" },
  { icon: "calendar" as const, label: "2024 – 2026" },
  { icon: "check" as const, label: "En curso" },
] as const;

export const NAPOSTA_STATS = [
  { valor: "12km", label: "Tramo intervenido" },
  { valor: "48+", label: "Especies nativas" },
  { valor: "3", label: "Estrategias clave" },
] as const;

export const NAPOSTA_PILARES_SECTION_LABEL = "Estrategias";
export const NAPOSTA_PILARES_TITULO = "Pilares del proyecto";
export const NAPOSTA_PILARES_SUBTITULO =
  "Los fundamentos que guían nuestra intervención ecológica en el Canal Maldonado.";

const PILAR_RESUMEN: Record<number, string> = {
  0: "Rediseño de taludes verdes y bermas para favorecer el flujo natural del agua y prevenir la erosión.",
  1: "Incorporación de especies nativas para restaurar la biodiversidad local y crear un ecosistema resiliente.",
  2: "Criterios ambientales, sociales y económicos para un canal vivo, accesible y de bajo mantenimiento.",
};

const PILAR_TITULO_CORTO: Record<number, string> = {
  0: "Modificación de la geometría",
  1: "Paisajismo autóctono",
  2: "Triple impacto",
};

const PILAR_ICON: Record<number, "waves" | "leaf" | "recycle"> = {
  0: "waves",
  1: "leaf",
  2: "recycle",
};

export const NAPOSTA_PILARES = PROYECTO_NAPOSTA_SECCIONES.map((seccion, index) => ({
  id: `naposta-pilar-${index + 1}`,
  titulo: PILAR_TITULO_CORTO[index] ?? seccion.titulo,
  tituloCompleto: seccion.titulo,
  resumen: PILAR_RESUMEN[index] ?? seccion.items[0]?.texto.slice(0, 120) + "…",
  icon: PILAR_ICON[index] ?? "leaf",
  items: seccion.items,
}));

export const NAPOSTA_GALERIA_TITULO = "Galería del proyecto";
export const NAPOSTA_GALERIA_IMAGENES = [
  { src: "/biodiversidad.webp", alt: "Entorno del Canal Maldonado" },
  { src: "/parquizacion.webp", alt: "Paisaje y vegetación nativa" },
  { src: "/ultimas imagenes/3.webp", alt: "Jardinería y biodiversidad local" },
  { src: "/ultimas imagenes2/laone.webp", alt: "Proyecto paisajístico en Bahía Blanca" },
] as const;

export const NAPOSTA_ENCUESTA_TITULO = "Próximamente";
export const NAPOSTA_ENCUESTA_TEXTO =
  "Encuesta para conocer tu opinión sobre el proyecto.";

export { TITULO_PROYECTO_NAPOSTA };
