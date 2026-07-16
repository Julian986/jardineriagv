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
  imagen: string;
  cuotas?: number;
};

export const TIENDA_CATEGORIAS_DEMO: TiendaCategoriaDemo[] = [
  { id: "plantas", slug: "plantas-macetas", nombre: "Plantas y macetas" },
  { id: "madera", slug: "madera-recuperada", nombre: "Madera recuperada" },
  { id: "insumos", slug: "insumos-jardin", nombre: "Insumos de jardín" },
  { id: "herramientas", slug: "herramientas", nombre: "Herramientas" },
];

export const TIENDA_PRODUCTOS_DEMO: TiendaProductoDemo[] = [
  {
    id: "1",
    slug: "maceta-decorativa",
    nombre: "Maceta decorativa con planta seleccionada",
    categoriaSlug: "plantas-macetas",
    categoriaLabel: "PLANTAS Y MACETAS",
    precioArs: 45_000,
    imagen: "/decoracion.webp",
    cuotas: 6,
  },
  {
    id: "2",
    slug: "planta-interior",
    nombre: "Planta de interior en maceta cerámica",
    categoriaSlug: "plantas-macetas",
    categoriaLabel: "PLANTAS Y MACETAS",
    precioArs: 38_500,
    imagen: "/planta.jpg",
    cuotas: 6,
  },
  {
    id: "3",
    slug: "estante-pinotea",
    nombre: "Estante flotante de pinotea — metro lineal",
    categoriaSlug: "madera-recuperada",
    categoriaLabel: "MADERA RECUPERADA",
    precioArs: 130_000,
    imagen: "/madera_detail.webp",
    cuotas: 6,
  },
  {
    id: "4",
    slug: "madera-artesanal",
    nombre: "Pieza de madera recuperada artesanal",
    categoriaSlug: "madera-recuperada",
    categoriaLabel: "MADERA RECUPERADA",
    precioArs: 95_000,
    imagen: "/madera.webp",
    cuotas: 6,
  },
  {
    id: "5",
    slug: "tierra-premium",
    nombre: "Tierra negra premium — bolsa 20 kg",
    categoriaSlug: "insumos-jardin",
    categoriaLabel: "INSUMOS DE JARDÍN",
    precioArs: 12_500,
    imagen: "/ultimas imagenes/3.webp",
    cuotas: 3,
  },
  {
    id: "6",
    slug: "sustrato-cactus",
    nombre: "Sustrato para cactus y suculentas",
    categoriaSlug: "insumos-jardin",
    categoriaLabel: "INSUMOS DE JARDÍN",
    precioArs: 9_800,
    imagen: "/ultimas imagenes/5.webp",
    cuotas: 3,
  },
  {
    id: "7",
    slug: "kit-riego",
    nombre: "Kit básico de riego por goteo",
    categoriaSlug: "herramientas",
    categoriaLabel: "HERRAMIENTAS",
    precioArs: 28_000,
    imagen: "/riego automatico/portada.png",
    cuotas: 6,
  },
  {
    id: "8",
    slug: "pala-jardin",
    nombre: "Pala de jardín reforzada",
    categoriaSlug: "herramientas",
    categoriaLabel: "HERRAMIENTAS",
    precioArs: 18_500,
    imagen: "/parquizacion.webp",
    cuotas: 3,
  },
];

export function getTiendaProductosDemo(categoriaSlug?: string | null) {
  if (!categoriaSlug) return TIENDA_PRODUCTOS_DEMO;
  return TIENDA_PRODUCTOS_DEMO.filter((p) => p.categoriaSlug === categoriaSlug);
}
