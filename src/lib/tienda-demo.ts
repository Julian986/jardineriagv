/** Datos de demostración hasta que exista el panel admin. */

export type TiendaCategoriaDemo = {
  id: string;
  slug: string;
  nombre: string;
};

export type TiendaProductoDemo = {
  id: string;
  slug: string;
  nombre: string;
  categoriaSlug: string;
  categoriaLabel: string;
  precioArs: number;
  /** Imagen principal (cards / carrito). */
  imagen: string;
  /** Galería de la ficha; si falta, se usa `imagen`. */
  imagenes: string[];
  cuotas?: number;
  /** % OFF por transferencia o depósito (ej. 10 = 10%). */
  descuentoTransferenciaPct?: number;
  descripcionTitulo?: string;
  descripcion: string[];
  highlights?: string[];
  medidas?: { label: string; valor: string }[];
};

export const TIENDA_CATEGORIAS_DEMO: TiendaCategoriaDemo[] = [
  { id: "deco", slug: "articulos-deco", nombre: "Artículos deco" },
  { id: "herramientas", slug: "herramientas-jardin", nombre: "Herramientas de jardín" },
  { id: "macetas", slug: "macetas", nombre: "Macetas" },
  { id: "sustratos", slug: "sustratos", nombre: "Sustratos" },
];

export const TIENDA_PRODUCTOS_DEMO: TiendaProductoDemo[] = [
  {
    id: "1",
    slug: "estante-pinotea",
    nombre: "Estante flotante de pinotea — metro lineal",
    categoriaSlug: "articulos-deco",
    categoriaLabel: "ARTÍCULOS DECO",
    precioArs: 130_000,
    imagen: "/madera_detail.webp",
    imagenes: ["/madera_detail.webp", "/madera.webp", "/ultimas imagenes/3.webp"],
    cuotas: 6,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Estante de pinotea — calidez natural para tu hogar",
    descripcion: [
      "Pieza artesanal en madera de pinotea recuperada, ideal para estanterías a medida. Cada metro lineal conserva vetas y marcas del tiempo que hacen único el diseño.",
      "Ideal para living, cocina o espacios de trabajo. Coordinamos corte e instalación según tu proyecto.",
    ],
    highlights: [
      "Madera recuperada con carácter",
      "Terminación a mano",
      "Se cotiza por metro lineal",
    ],
    medidas: [
      { label: "Unidad de venta", valor: "Metro lineal" },
      { label: "Espesor aproximado", valor: "Según stock" },
    ],
  },
  {
    id: "2",
    slug: "madera-artesanal",
    nombre: "Pieza de madera recuperada artesanal",
    categoriaSlug: "articulos-deco",
    categoriaLabel: "ARTÍCULOS DECO",
    precioArs: 95_000,
    imagen: "/madera.webp",
    imagenes: ["/madera.webp", "/madera_detail.webp", "/decoracion.webp"],
    cuotas: 6,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Madera con historia para deco y muebles",
    descripcion: [
      "Seleccionamos tablas y piezas nobles recuperadas para deco, estantes y proyectos a medida. Cada una cuenta una historia distinta.",
      "Consultanos por disponibilidad del momento: el stock cambia según lo que recuperamos.",
    ],
    highlights: [
      "100% madera recuperada",
      "Piezas únicas",
      "Ideal para proyectos a medida",
    ],
  },
  {
    id: "3",
    slug: "kit-riego",
    nombre: "Kit básico de riego por goteo",
    categoriaSlug: "herramientas-jardin",
    categoriaLabel: "HERRAMIENTAS DE JARDÍN",
    precioArs: 28_000,
    imagen: "/riego automatico/portada.png",
    imagenes: [
      "/riego automatico/portada.png",
      "/parquizacion.webp",
      "/ultimas imagenes/5.webp",
    ],
    cuotas: 6,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Riego eficiente para tu jardín o huerta",
    descripcion: [
      "Kit pensado para empezar con riego por goteo en canteros, macetas o huertas chicas. Ahorra agua y mantiene una humedad más estable.",
      "Te orientamos en el armado según el tamaño de tu espacio.",
    ],
    highlights: [
      "Ahorro de agua",
      "Fácil de instalar",
      "Ideal para macetas y canteros",
    ],
  },
  {
    id: "4",
    slug: "pala-jardin",
    nombre: "Pala de jardín reforzada",
    categoriaSlug: "herramientas-jardin",
    categoriaLabel: "HERRAMIENTAS DE JARDÍN",
    precioArs: 18_500,
    imagen: "/parquizacion.webp",
    imagenes: ["/parquizacion.webp", "/riego automatico/portada.png"],
    cuotas: 3,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Herramienta resistente para el día a día",
    descripcion: [
      "Pala reforzada para trasplantes, canteros y trabajo en tierra. Buen agarre y durabilidad para uso frecuente en el jardín.",
    ],
    highlights: ["Uso intensivo", "Agarre cómodo", "Para tierra y trasplantes"],
  },
  {
    id: "5",
    slug: "maceta-decorativa",
    nombre: "Maceta decorativa con planta seleccionada",
    categoriaSlug: "macetas",
    categoriaLabel: "MACETAS",
    precioArs: 45_000,
    imagen: "/decoracion.webp",
    imagenes: ["/decoracion.webp", "/planta.jpg", "/canteros con plantas/portada.png"],
    cuotas: 6,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Maceta + planta lista para disfrutar",
    descripcion: [
      "Combinamos maceta y especie según luz y estilo de tu espacio. Entregamos lista para ubicar en interior o exterior protegido.",
      "Si preferís solo la maceta o solo la planta, consultanos por WhatsApp.",
    ],
    highlights: [
      "Selección a medida",
      "Listas para ubicar",
      "Asesoramiento de luz incluido",
    ],
    medidas: [
      { label: "Uso", valor: "Interior / exterior protegido" },
      { label: "Incluye", valor: "Maceta + planta" },
    ],
  },
  {
    id: "6",
    slug: "maceta-ceramica",
    nombre: "Maceta cerámica para interior",
    categoriaSlug: "macetas",
    categoriaLabel: "MACETAS",
    precioArs: 38_500,
    imagen: "/planta.jpg",
    imagenes: ["/planta.jpg", "/decoracion.webp", "/ultimas imagenes/3.webp"],
    cuotas: 6,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Cerámica con estilo para interiores",
    descripcion: [
      "Maceta de cerámica pensada para plantas de interior. Buena presencia visual y terminación limpia para living, oficina o recibidor.",
    ],
    highlights: ["Para interior", "Diseño limpio", "Combina con deco actual"],
  },
  {
    id: "7",
    slug: "tierra-premium",
    nombre: "Tierra negra premium — bolsa 20 kg",
    categoriaSlug: "sustratos",
    categoriaLabel: "SUSTRATOS",
    precioArs: 12_500,
    imagen: "/ultimas imagenes/3.webp",
    imagenes: ["/ultimas imagenes/3.webp", "/ultimas imagenes/5.webp", "/parquizacion.webp"],
    cuotas: 3,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Tierra negra para canteros y macetas",
    descripcion: [
      "Bolsa de 20 kg de tierra negra premium para enriquecer canteros, macetas y huertas. Estructura suelta y apta para la mayoría de especies de jardín.",
    ],
    highlights: ["Bolsa 20 kg", "Para canteros y macetas", "Buena retención de humedad"],
    medidas: [{ label: "Presentación", valor: "Bolsa 20 kg" }],
  },
  {
    id: "8",
    slug: "sustrato-cactus",
    nombre: "Sustrato para cactus y suculentas",
    categoriaSlug: "sustratos",
    categoriaLabel: "SUSTRATOS",
    precioArs: 9_800,
    imagen: "/ultimas imagenes/5.webp",
    imagenes: ["/ultimas imagenes/5.webp", "/ultimas imagenes/3.webp", "/planta.jpg"],
    cuotas: 3,
    descuentoTransferenciaPct: 10,
    descripcionTitulo: "Sustrato drenante para cactus y suculentas",
    descripcion: [
      "Mezcla con buen drenaje para evitar encharcamientos. Ideal para cactus, suculentas y especies que necesitan sustrato aireado.",
    ],
    highlights: ["Alto drenaje", "Evita encharcamiento", "Para cactus y suculentas"],
  },
];

export function getTiendaProductosDemo(categoriaSlug?: string | null) {
  if (!categoriaSlug) return TIENDA_PRODUCTOS_DEMO;
  return TIENDA_PRODUCTOS_DEMO.filter((p) => p.categoriaSlug === categoriaSlug);
}

export function getTiendaProductoBySlug(slug: string) {
  return TIENDA_PRODUCTOS_DEMO.find((p) => p.slug === slug) ?? null;
}

export function getTiendaCategoriaBySlug(slug: string) {
  return TIENDA_CATEGORIAS_DEMO.find((c) => c.slug === slug) ?? null;
}

export function getTiendaProductosRelacionados(producto: TiendaProductoDemo, limit = 4) {
  return TIENDA_PRODUCTOS_DEMO.filter(
    (p) => p.categoriaSlug === producto.categoriaSlug && p.id !== producto.id,
  ).slice(0, limit);
}

export function getTiendaPrecioTransferencia(producto: TiendaProductoDemo) {
  const pct = producto.descuentoTransferenciaPct;
  if (!pct || pct <= 0) return null;
  return Math.round(producto.precioArs * (1 - pct / 100));
}

export function getTiendaCuotaArs(producto: TiendaProductoDemo) {
  if (!producto.cuotas) return null;
  return Math.ceil(producto.precioArs / producto.cuotas);
}
