/** Descripción oficial del proyecto Río Napostá (texto del cliente). */

export const PROYECTO_NAPOSTA_INTRO =
  "A continuación se detallan las estrategias clave de ingeniería ecológica, sustentabilidad y paisajismo autóctono para lograrlo:";

export const PROYECTO_NAPOSTA_SECCIONES = [
  {
    titulo: "1. Modificación de la Geometría y Taludes Verdes",
    items: [
      {
        titulo: "Ensanche y Bermas Escalonadas",
        texto:
          "Se debe aprovechar el plan de ensanchamiento para crear terrazas o bermas inundables (escalones planos a los lados del cauce principal). Durante lluvias normales, el agua corre por el fondo; ante eventos extremos como el temporal de 300 mm, el agua ocupa las terrazas de manera controlada sin desbordarse hacia la ciudad.",
      },
      {
        titulo: "Reemplazo del Hormigón Rígido",
        texto:
          "Sustituir las paredes de concreto liso por gaviones de piedra o geomallas de coco permeables. Estos sistemas estabilizan las laderas, permiten la filtración de agua al suelo (sustentabilidad hídrica) y sirven de sustrato para que crezcan las raíces de la vegetación nativa.",
      },
    ],
  },
  {
    titulo: "2. Incorporación de Vegetación Autóctona (Ecoregión del Espinal y Pampeana)",
    items: [
      {
        texto:
          "La vegetación nativa de la región es clave porque posee raíces profundas que fijan el suelo evitando la erosión, soportan tanto sequías extremas como inundaciones temporales, y actúan como \"frenos naturales\" disminuyendo la velocidad del agua.",
      },
      {
        titulo: "Zona del Cauce y Fondo (Humedal Hidrófilo)",
        texto:
          "Introducir plantas palustres como el Junco (Schoenoplectus californicus) y la Totora (Typha domingensis). Tienen una altísima capacidad para absorber excedentes hídricos y purificar el agua filtrando sedimentos urbanos.",
      },
      {
        titulo: "Taludes y Terrazas Medias (Gramíneas Resilientes)",
        texto:
          "Plantar pastizales nativos como la Paja Brava (Cortaderia selloana), el Pastizal de Flechillas (Stipa) y el Pasto de la Vaca. Sus raíces densas amarran las pendientes del canal impidiendo los desmoronamientos de tierra.",
      },
      {
        titulo: "Borde Superior y Paseo Lineal (Árboles y Arbustos)",
        texto:
          "Reforestar con árboles del Espinal como el Espinillo / Aromito (Vachellia caven), el Algarrobo Blanco (Prosopis alba) y el Sombra de Toro (Jodina rhombifolia). Estos árboles atraen la fauna local, como las aves nativas, y proporcionan sombra reduciendo el efecto de \"isla de calor\" urbana.",
      },
    ],
  },
  {
    titulo: "3. Criterios de Sostenibilidad y Triple Impacto",
    items: [
      {
        titulo: "Dimensión Ambiental (Resiliencia Climática)",
        texto:
          "El canal debe funcionar como un filtro biológico vivo. La vegetación autóctona restablece el ecosistema para especies locales desplazadas (como los loros barranqueros que anidan en el sector) y mitiga los efectos de la crisis climática.",
      },
      {
        titulo: "Dimensión Social (Uso Público y Conectividad)",
        texto:
          "Diseñar el área como un parque lineal inundable con ciclovías, pasarelas y anfiteatros a cielo abierto. Cuando el canal está seco, los ciudadanos se apropian del espacio; cuando llueve fuerte, el parque se inunda temporalmente cumpliendo su rol hidráulico primario sin poner en riesgo vidas.",
      },
      {
        titulo: "Dimensión Económica (Bajo Mantenimiento)",
        texto:
          "Al utilizar flora nativa adaptada al clima de Bahía Blanca, la inversión a largo plazo disminuye drásticamente. Estas plantas no requieren sistemas de riego artificial costosos ni pesticidas, y se autorregulan en comparación con el césped o las plantas exóticas.",
      },
    ],
  },
] as const;
