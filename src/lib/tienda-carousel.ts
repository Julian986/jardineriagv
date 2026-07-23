import { RUTA_TIENDA } from "@/lib/tienda-routes";

export type TiendaCarouselSlide = {
  id: string;
  imagen: string;
  alt: string;
  titulo?: string;
  subtitulo?: string;
  href?: string;
  cta?: string;
};

/** Banners promo demo — se reemplazan desde el panel admin más adelante. */
export const TIENDA_CAROUSEL_SLIDES: TiendaCarouselSlide[] = [
  {
    id: "macetas",
    imagen: "/decoracion.webp",
    alt: "Decoración con plantas y macetas",
    titulo: "Macetas y plantas",
    subtitulo: "Vida en cada rincón de tu casa",
    href: `${RUTA_TIENDA}?categoria=macetas`,
    cta: "Ver macetas",
  },
  {
    id: "jardin",
    imagen: "/parquizacion.webp",
    alt: "Jardín parquizado en Bahía Blanca",
    titulo: "Todo para tu jardín",
    subtitulo: "Herramientas, sustratos y más",
    href: `${RUTA_TIENDA}?categoria=herramientas-jardin`,
    cta: "Ver herramientas",
  },
  {
    id: "deco",
    imagen: "/canteros con plantas/portada.png",
    alt: "Canteros y decoración exterior",
    titulo: "Artículos deco",
    subtitulo: "Piezas con carácter para tu espacio",
    href: `${RUTA_TIENDA}?categoria=articulos-deco`,
    cta: "Ver deco",
  },
  {
    id: "sustratos",
    imagen: "/ultimas imagenes/3.webp",
    alt: "Sustratos y tierra para plantas",
    titulo: "Sustratos",
    subtitulo: "Nutrición para que crezcan sanas",
    href: `${RUTA_TIENDA}?categoria=sustratos`,
    cta: "Ver sustratos",
  },
  {
    id: "riego",
    imagen: "/riego automatico/portada.png",
    alt: "Sistema de riego para jardín",
    titulo: "Riego eficiente",
    subtitulo: "Ahorrá agua y tiempo en el jardín",
    href: `${RUTA_TIENDA}?categoria=herramientas-jardin`,
    cta: "Ver más",
  },
];
