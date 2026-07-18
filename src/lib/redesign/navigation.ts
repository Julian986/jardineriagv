import { RUTA_PROYECTO } from "@/lib/biodiversidad-rutas";
import { RUTA_TIENDA, TIENDA_CTA_LABEL } from "@/lib/tienda-routes";

export const REDesign_NAV_LINKS = [
  { href: RUTA_PROYECTO, label: "Proyectos", icon: "sprout" as const },
  { href: "/decoracion-plantas-macetas", label: "Servicios", icon: "tree" as const },
  { href: RUTA_TIENDA, label: TIENDA_CTA_LABEL, icon: "store" as const },
  { href: "/#contacto", label: "Nosotros", icon: "users" as const },
  { href: "/#contacto", label: "Contacto", icon: "whatsapp" as const },
] as const;

export const REDesign_FOOTER_NAV = [
  { href: "/", label: "Inicio" },
  { href: RUTA_PROYECTO, label: "Proyectos" },
  { href: "/decoracion-plantas-macetas", label: "Servicios" },
  { href: RUTA_TIENDA, label: TIENDA_CTA_LABEL },
  { href: "/#contacto", label: "Nosotros" },
] as const;

export const REDesign_CONTACT = {
  phone: "+54 291 431-5080",
  phoneHref: "https://wa.me/5492914315080",
  instagram: "https://www.instagram.com/jardineriagv",
} as const;
