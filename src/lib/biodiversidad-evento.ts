/** Evento comunitario dentro de la sección biodiversidad (texto del cliente). */

export const EVENTO_CUMPLE_RAIZ_TITULO =
  "Un cumpleaños con raíz: Vení a compartir y aprender con nosotros";

export const EVENTO_CUMPLE_RAIZ_ANCHOR_ID = "evento-cumpleanos-raiz";

export const EVENTO_ETIQUETA = "Próximo evento";

export const EVENTO_VER_PROXIMO_EVENTO = "Ver próximo evento";

/** Enlace en hero del detalle (evita un tercer botón igual a Reservar / WhatsApp). */
export const EVENTO_DETAIL_HERO_LINK = "viernes 19 de junio — ver detalles";

export const EVENTO_CUMPLE_RAIZ_DESCRIPCION =
  "Nuestro hijo cumple su primer año y queremos celebrarlo sembrando vida para concientizar sobre la huella de carbono humana. Nos reuniremos en el Parque Público de Cuyo junto al Club Andino Bahía Blanca en un evento abierto a toda la comunidad. No te preocupes por el trabajo pesado: nuestro equipo se encargará de plantar los árboles. Tu presencia es el verdadero regalo. ¡Vení a celebrar la vida y la naturaleza con nosotros!";

export const EVENTO_CUMPLE_RAIZ_DATOS = [
  { etiqueta: "Fecha", valor: "Viernes 19 de Junio de 2026." },
  { etiqueta: "Horario", valor: "De 15:30 a 18:00 h." },
  { etiqueta: "Lugar", valor: "Parque Público de Cuyo." },
] as const;

export const EVENTO_CUMPLE_RAIZ_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Parque+P%C3%BAblico+de+Cuyo+Bah%C3%ADa+Blanca";

export const EVENTO_CUMPLE_RAIZ_WHATSAPP_HREF = `https://wa.me/5492914315080?text=${encodeURIComponent(
  "Hola Guillermo, quisiera consultar sobre el evento Un cumpleaños con raíz (19 de junio en el Parque Público de Cuyo)."
)}`;
