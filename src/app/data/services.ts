export const whatsappHref =
  "https://wa.me/?text=Hola%2C%20quiero%20agendar%20una%20visita%20con%20Jardineriagv";

export type JardineriaService = {
  id: string;
  badge: string;
  icon: string;
  category: string;
  title: string;
  price: string;
  summary: string;
  description: string;
  images: string[];
};

export const jardineriaServices: readonly JardineriaService[] = [
  {
    id: "asesoramiento-diseno",
    badge: "Destacado",
    icon: "🏡",
    category: "Servicio de jardineria",
    title: "Asesoramiento y diseño",
    price: "$ 30.000",
    summary:
      "Visita inicial para relevar el espacio, definir estilo y planificar tareas.",
    description:
      "Para crear un jardin, es importante conocer el espacio, gustos y preferencias de quienes van a compartir el lugar. Por eso es necesario realizar una visita, con el fin de recopilar la informacion y comenzar a trabajar en el diseño. Dicha visita tiene un valor de $ 30.000. Incluye un listado de tareas a realizar, valores de materiales y mano de obra.",
    images: [
      "/servicios/asesoramiento-diseno-1.jpg",
      "/servicios/asesoramiento-diseno-2.jpg",
      "/servicios/asesoramiento-diseno-3.jpg",
    ],
  },
  {
    id: "riego-automatico",
    badge: "Nuevo",
    icon: "💧",
    category: "Servicio de jardineria",
    title: "Riego automatico por aspersion y goteo",
    price: "Presupuesto a medida",
    summary:
      "Diseño del sistema de riego segun medidas, agua disponible y sectores.",
    description:
      "En todo proyecto de riego es necesario contar con las medidas de todo el jardin y los lugares de suministro de agua y luz. Realizamos una visita para recopilar la informacion y diseñar el riego. Sera entregado un plano en formato PDF con las medidas, el listado de materiales y el valor de la mano de obra.",
    images: [
      "/servicios/riego-automatico-1.jpg",
      "/servicios/riego-automatico-2.jpg",
      "/servicios/riego-automatico-3.jpg",
    ],
  },
  {
    id: "cesped-rollos",
    badge: "Popular",
    icon: "🌱",
    category: "Servicio de jardineria",
    title: "Césped en rollos",
    price: "1.111,00 ARS",
    summary:
      "Césped en rollos con dos variedades para alto tránsito y diferentes necesidades de riego.",
    description:
      "Trabajamos dos variedades de césped en rollos. Grama Bahiana: resistente al alto tránsito, con buena tolerancia a lapsos sin riego; en invierno cambia a un color amarillo. Festuca y Raygras: de alto tránsito, requiere riego constante (en verano dos veces por día), es de cuatro estaciones y se mantiene verde todo el año. El corte se realiza una vez por semana en verano, cada quince días en otoño-primavera y una vez por mes en invierno. Una vez realizado el pedido, se coordina día de entrega.",
    images: [
      "/cesped en rollos/portada.png",
      "/cesped en rollos/2.png",
      "/cesped en rollos/3.png",
      "/cesped en rollos/4.png",
    ],
  },
  {
    id: "siembra-cesped",
    badge: "Siembra",
    icon: "🌾",
    category: "Servicio de jardineria",
    title: "Siembra de césped",
    price: "1.111,00 ARS",
    summary:
      "Siembra de césped adaptada a sol, semi sombra o sombra, según el sector.",
    description:
      "Trabajamos una amplia variedad de césped para diferentes condiciones de luz, ya sea sol directo, semi sombra o sombra. El valor depende del trabajo a realizar en la superficie. Para cotizar, se solicita una imagen del sector a intervenir, la cantidad de m2 y una descripción de la cantidad de luz que recibe. También realizamos visitas para recopilar esta información; el valor de dicha visita es a coordinar.",
    images: [
      "/servicios/siembra-cesped-1.jpg",
      "/servicios/siembra-cesped-2.jpg",
      "/servicios/siembra-cesped-3.jpg",
    ],
  },
  {
    id: "relleno-nivelacion",
    badge: "Servicio",
    icon: "🪴",
    category: "Servicio de jardineria",
    title: "Relleno",
    price: "1.111,00 ARS",
    summary: "Relleno con tierra arenosa ideal para césped, con traslado incluido.",
    description:
      "Contamos con tierra arenosa para césped, adecuada para nivelar y preparar superficies verdes. Ofrecemos el traslado y acopio del material en el lugar de trabajo, facilitando la ejecución de la obra.",
    images: [
      "/servicios/relleno-nivelacion-1.jpg",
      "/servicios/relleno-nivelacion-2.jpg",
    ],
  },
  {
    id: "canteros-plantas",
    badge: "Diseño",
    icon: "🌺",
    category: "Servicio de jardineria",
    title: "Canteros con plantas 🌿",
    price: "1.111,00 ARS",
    summary:
      "Diseñamos y ejecutamos canteros completos, ocupándonos de todos los trabajos y materiales.",
    description:
      "Diseñamos y llevamos a cabo la elaboración de canteros de principio a fin. Nos ocupamos de todos los trabajos y materiales necesarios. Para cotizar, se solicita el plano con la superficie a intervenir y la idea principal a desarrollar, además de la orientación del sol y las horas que recibe directamente. Ofrecemos la opción de realizar una visita para tomar medidas y observar con mayor detalle el lugar donde se trabajará; dicha visita tiene un valor a coordinar.",
    images: [
      "/servicios/canteros-plantas-1.jpg",
      "/servicios/canteros-plantas-2.jpg",
      "/servicios/canteros-plantas-3.jpg",
    ],
  },
  {
    id: "desmalezado",
    badge: "Servicio",
    icon: "🧹",
    category: "Servicio de jardineria",
    title: "Desmalezado",
    price: "1.111,00 ARS",
    summary: "Desmalezado de superficies medianas y grandes, desde 200 m2.",
    description:
      "Servicio de desmalezado para superficies de 200 m2 en adelante, ideal para recuperar terrenos antes de colocar césped, realizar siembras o mejorar la limpieza general del espacio.",
    images: [
      "/servicios/desmalezado-1.jpg",
      "/servicios/desmalezado-2.jpg",
    ],
  },
  {
    id: "poda-limpieza",
    badge: "Integral",
    icon: "🍃",
    category: "Servicio de jardineria",
    title: "Poda de plantas y árboles",
    price: "1.111,00 ARS",
    summary:
      "Servicio de poda para plantas y árboles según necesidad y tipo de especie.",
    description:
      "Realizamos poda de plantas y árboles adaptada a cada caso, priorizando la sanidad y la forma de la especie. Para cotizar, se solicita enviar una foto de la o las plantas a intervenir, de modo de evaluar el trabajo y proponer la mejor solución.",
    images: [
      "/servicios/poda-limpieza-1.jpg",
      "/servicios/poda-limpieza-2.jpg",
    ],
  },
  {
    id: "cerco-vivo",
    badge: "Servicio",
    icon: "🌿",
    category: "Servicio de jardineria",
    title: "Colocación de cerco vivo 🌿",
    price: "1.111,00 ARS",
    summary:
      "Cerco vivo combinado o de una sola variedad, según el diseño del jardín.",
    description:
      "Realizamos colocación de cerco vivo, ya sea combinado o de una sola variedad, para dar privacidad y marco verde al jardín. Para cotizar, se solicita enviar los metros lineales a cubrir y, si es posible, imágenes de la ubicación.",
    images: [
      "/servicios/cerco-vivo-1.jpg",
      "/servicios/cerco-vivo-2.jpg",
    ],
  },
  {
    id: "presupuesto-general",
    badge: "Presupuesto",
    icon: "📄",
    category: "Servicio de jardineria",
    title: "Presupuesto",
    price: "25.000,00 ARS",
    summary:
      "Presupuesto detallado que incluye relevamiento, descripción de tareas y cotización completa.",
    description:
      "El presupuesto incluye relevamiento de datos en el lugar, descripción de tareas y materiales a utilizar y la cotización del trabajo. Es una herramienta completa para que el cliente tenga claridad sobre el alcance y el costo del proyecto antes de avanzar.",
    images: [
      "/servicios/presupuesto-1.jpg",
      "/servicios/presupuesto-2.jpg",
    ],
  },
] as const;
