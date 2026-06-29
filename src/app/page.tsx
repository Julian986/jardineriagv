"use client";

import Link from "next/link";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { useState, useEffect, useCallback } from "react";
import { event as gaEvent } from "@/lib/gtag";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { RedesignFooter } from "@/components/redesign/RedesignFooter";
import { RedesignHeader } from "@/components/redesign/RedesignHeader";
import { NavMenuProvider, useNavMenuOptional } from "@/components/redesign/NavMenuContext";
import { WHATSAPP_HREF } from "@/lib/whatsapp";
import { RUTA_MADERA } from "@/lib/madera-contenido";
import { TITULO_BIODIVERSIDAD, TITULO_PROYECTO_NAPOSTA } from "@/lib/biodiversidad-titulos";
import { RUTA_PROYECTO } from "@/lib/biodiversidad-rutas";
import { TerekuaMvpBlock } from "@/components/TerekuaMvpBlock";

// ── Constantes ────────────────────────────────────────────────────────────────
const WA_HREF = WHATSAPP_HREF;

/** CTA principal hacia /reservar (hero + navegación). */
const CTA_RESERVAR_LABEL = "Empecemos a diseñar tu espacio";
const SITE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL?.trim().replace(/\/+$/, "") || "https://jardineriagv.com";

// Imágenes del carrusel hero — carpeta `public/ultimas imagenes2`
const HERO_IMAGES = [
  "/ultimas imagenes2/laone.webp",
  "/ultimas imagenes2/2.webp",
  "/ultimas imagenes2/5.webp",
  "/ultimas imagenes2/WhatsApp Image 2026-05-14 at 11.22.24 AM.webp",
  "/ultimas imagenes2/WhatsApp Image 2026-05-14 at 11.22.24 AM (1).webp",
  "/ultimas imagenes2/WhatsApp Image 2026-05-14 at 11.22.24 AM (2).webp",
  "/ultimas imagenes2/1 (1).webp",
  "/ultimas imagenes2/WhatsApp Image 2026-05-14 at 11.22.25 AM.webp",
];

// Galería de trabajos (todas las disponibles) — usada por sección galería (oculta vía false && más abajo)
const GALERIA = [
  { src: "/ultimas imagenes/1 (1).webp", alt: "Jardín diseñado por Guillermo" },
  { src: "/ultimas imagenes/2.webp",     alt: "Trabajo de jardinería en Bahía Blanca" },
  { src: "/ultimas imagenes/3.webp",     alt: "Jardín terminado" },
  { src: "/ultimas imagenes/4.webp",     alt: "Mantenimiento de jardín" },
  { src: "/ultimas imagenes/5.webp",     alt: "Diseño de canteros" },
  { src: "/ultimas imagenes/6.webp",     alt: "Trabajo de poda" },
  { src: "/ultimas imagenes/7.webp",     alt: "Riego automático instalado" },
  { src: "/ultimas imagenes/8.webp",     alt: "Jardín antes y después" },
  { src: "/ultimas imagenes/9.webp",     alt: "Proyecto de jardinería" },
];

const STATS = [
  { valor: "10+", label: "años de experiencia" },
  { valor: "500+", label: "trabajos realizados" },
  { valor: "100%", label: "presupuestos cumplidos" },
];

const SERVICIOS = [
  {
    icon: "🏡",
    title: "Diseño de jardines desde cero",
    desc: "Relevamos el espacio, entendemos tus gustos y diseñamos el jardín que siempre quisiste. Con plano, listado de tareas y presupuesto claro.",
    img: "/canteros con plantas/portada.png",
  },
  {
    icon: "✂️",
    title: "Mantenimiento regular",
    desc: "Poda, corte de césped, desmalezado y limpieza general. Tu jardín siempre prolijo, sin que tengas que preocuparte.",
    img: "/poda de arboles y plantas/portada.png",
  },
  {
    icon: "💧",
    title: "Riego automático",
    desc: "Instalamos sistemas de riego por aspersión y goteo adaptados a cada sector. Ahorrás agua y tus plantas crecen sanas.",
    img: "/riego automatico/portada.png",
  },
  {
    icon: "🌿",
    title: "Asesoramiento personalizado",
    desc: "¿No sabés por dónde empezar? Hacemos una visita, analizamos el espacio y te damos un plan concreto sin vueltas.",
    img: "/siembra de cesped/portada.png",
  },
];

const POR_QUE = [
  {
    icon: "🤝",
    title: "Primera visita sin cargo",
    desc: "Visitamos tu jardín, relevamos el espacio y te damos una idea clara de qué se puede hacer — sin costo y sin compromiso.",
  },
  {
    icon: "📄",
    title: "Presupuesto claro y por escrito",
    desc: "Antes de empezar recibís un detalle completo del trabajo: tareas, materiales y precio. Sin sorpresas al final.",
  },
  {
    icon: "⭐",
    title: "Trabajo garantizado",
    desc: "Más de 10 años de experiencia en Bahía Blanca avalan cada proyecto. Si algo no queda bien, lo corregimos.",
  },
];

const TESTIMONIOS = [
  {
    nombre: "María G.",
    barrio: "Bahía Blanca",
    texto:
      "Guillermo transformó el fondo de casa en algo que nunca imaginamos que podíamos tener. Muy prolijo, puntual y con mucho criterio.",
    estrellas: 5,
  },
  {
    nombre: "Carlos R.",
    barrio: "Bahía Blanca",
    texto:
      "Instaló el riego automático en todo el jardín en dos días. Desde entonces no tuve que regar más nada. Excelente trabajo.",
    estrellas: 5,
  },
  {
    nombre: "Laura V.",
    barrio: "Bahía Blanca",
    texto:
      "Nos dio asesoramiento desde cero. El presupuesto fue exactamente lo que nos cobró. Recomendado sin dudas.",
    estrellas: 5,
  },
];

const TIERRAS_PRODUCTO = {
  icon: "🌱",
  title: "Tierras y sustrato",
  desc: "Tierras y sustratos seleccionados para el desarrollo óptimo de plantas y jardines.",
};

/** Macetas primero, madera después (pedido del cliente). Imágenes orientativas. */
const MACETAS_PRODUCTO = {
  id: "macetas",
  detailHref: "/decoracion-plantas-macetas",
  icon: "🪴",
  tituloPrincipal: "DECORACIÓN CON PLANTAS Y MACETAS:",
  tituloSecundario: "Vida en cada rincón",
  desc: "Llevamos la naturaleza a donde vos estés. Ya sea en el corazón de tu hogar o en el espacio de trabajo de tu empresa, nuestro servicio de decoración botánica transforma ambientes comunes en espacios vibrantes y saludables.",
  img: "/decoracion.webp",
};

const PARQUIZACION_PRODUCTO = {
  id: "parquizacion",
  detailHref: "/parquizacion-diseno-exterior",
  icon: "🌳",
  tituloPrincipal: "PARQUIZACIÓN Y DISEÑO EXTERIOR:",
  tituloSecundario: "Creamos el jardín que siempre soñaste.",
  desc: "Desde la elección de la especie ideal hasta la armonía de las texturas. Creamos escenarios donde la calidad y la excelencia técnica garantizan que tu única tarea sea disfrutar del aire libre.",
  img: "/parquizacion.webp",
};

const MADERA_PRODUCTO = {
  id: "madera",
  detailHref: RUTA_MADERA,
  tituloPrincipal: "MUEBLES CON HISTORIA:",
  tituloSecundario: "Artesanía en madera recuperada.",
  desc: "Damos una segunda vida a maderas nobles para crear piezas únicas que cuentan una historia. Cada mueble es fabricado a mano, respetando las vetas, texturas y marcas del tiempo que hacen de cada diseño algo irrepetible.",
  tagline: "♻️ Piezas únicas, 100% sustentables.",
  img: "/madera.webp",
};

const BIODIVERSIDAD_PRODUCTO = {
  id: "biodiversidad",
  detailHref: RUTA_PROYECTO,
  icon: "🌿",
  titulo: TITULO_BIODIVERSIDAD,
  resumen: TITULO_PROYECTO_NAPOSTA,
  img: "/biodiversidad.webp",
};

const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Jardinería GV",
      image: `${SITE_URL}/opengraph-image`,
      areaServed: "Bahía Blanca",
      telephone: "+5492914315080",
      url: SITE_URL,
      sameAs: ["https://wa.me/5492914315080"],
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#servicio-diseno`,
      serviceType: "Diseño y parquización de jardines",
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: "Bahía Blanca",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#servicio-mantenimiento`,
      serviceType: "Mantenimiento de jardines y poda",
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: "Bahía Blanca",
    },
  ],
};

function trackCta(action: string, location: string) {
  gaEvent(action, { location, page: "home" });
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// ── Ícono WhatsApp (reutilizable) ─────────────────────────────────────────────
function WAIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Sticky WhatsApp (flotante) ────────────────────────────────────────────────
function StickyWA() {
  const navMenu = useNavMenuOptional();
  if (navMenu?.open) return null;

  return (
    <WhatsAppLink
      location="sticky_button"
      page="home"
      className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
      aria-label="Escribinos por WhatsApp"
    >
      <WAIcon />
      WhatsApp
    </WhatsAppLink>
  );
}

// ── Hero Carousel ─────────────────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % HERO_IMAGES.length),
    []
  );

  // Auto-avance cada 5 s
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt="Trabajo de jardinería en Bahía Blanca"
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
      {/* Gradiente: imagen respira arriba, texto legible abajo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(20,42,8,0.92) 0%, rgba(20,42,8,0.60) 45%, rgba(20,42,8,0.28) 100%)",
        }}
      />

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Imagen ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_SCHEMA) }} />
      <div className={playfair.variable}>
      <NavMenuProvider>
      <RedesignHeader page="home" />
      <StickyWA />

      <main className="overflow-x-hidden">

        {/* ══════════════════════════════════════════════════
            1. HERO con carrusel
        ══════════════════════════════════════════════════ */}
        <section className="relative min-h-[85vh] px-4 py-20 text-white md:min-h-[80vh] md:py-32 flex items-center">
          <HeroCarousel />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
              PARQUIZACIÓN Y DISEÑO
            </span>

            <h1 className="mb-5 text-balance text-4xl font-bold leading-tight tracking-tight drop-shadow-lg md:text-5xl lg:text-6xl">
              Transformamos espacios,{" "}
              <span className="text-[#e8b46a]">cultivamos bienestar</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-white/85 drop-shadow md:text-xl">
              nuestra pasión por la naturaleza nos impulsa a diseñar paisajes que respiran y
              evolucionan con el tiempo
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {/* <Link
                href="/reservar"
                onClick={() => trackCta("reservar_click", "hero")}
                className="flex w-full items-center justify-center rounded-full bg-[#c4933f] px-5 py-3.5 text-center text-sm font-bold leading-snug text-white shadow-xl transition-opacity hover:opacity-90 sm:w-auto sm:px-7 sm:text-base"
              >
                {CTA_RESERVAR_LABEL}
              </Link> */}
           {/* <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/50 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:w-auto"
              >
                <WAIcon className="h-4 w-4" /> Hablar por WhatsApp
              </a> */}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            2. MACETAS → PARQUIZACIÓN → MADERA → TEREKUA → BIODIVERSIDAD (después del hero)
        ══════════════════════════════════════════════════ */}
        <section
          className="border-b border-[#e4ead8] bg-[#fafaf7] px-4 py-12 md:py-16"
          aria-labelledby="productos-complemento-heading"
        >
          <div className="mx-auto max-w-6xl">
            <p
              id="productos-complemento-heading"
              className="mx-auto mb-10 max-w-3xl text-center text-[15px] leading-relaxed text-[#555]"
            >
              En JardineríaGV cada proyecto es un compromiso con la durabilidad y la estética.
              Porque entendemos que un rincón verde no es solo decoración; es una inversión en
              calidad de vida y bienestar.
            </p>

            <article
              id={MACETAS_PRODUCTO.id}
              className="mb-12 flex flex-col gap-6 rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm md:mb-14 md:flex-row md:items-center md:gap-10 md:p-8"
            >
              <div className="relative mx-auto h-52 w-full max-w-md shrink-0 overflow-hidden rounded-xl bg-[#f0f5ea] md:mx-0 md:h-56 md:w-80 md:max-w-none">
                <Image
                  src={MACETAS_PRODUCTO.img}
                  alt={`${MACETAS_PRODUCTO.tituloPrincipal} ${MACETAS_PRODUCTO.tituloSecundario}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-3xl" aria-hidden>
                  {MACETAS_PRODUCTO.icon}
                </span>
                <h2 className="mt-2">
                  <span className="block text-base font-bold uppercase tracking-wide text-[#1c1c1c] md:text-lg">
                    {MACETAS_PRODUCTO.tituloPrincipal}
                  </span>
                  <span className="mt-1 block text-2xl font-bold text-[#2d5016] md:text-3xl">
                    {MACETAS_PRODUCTO.tituloSecundario}
                  </span>
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{MACETAS_PRODUCTO.desc}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
                  <Link
                    href="/reservar"
                    onClick={() => trackCta("reservar_click", "macetas_card")}
                    className="inline-flex justify-center rounded-full bg-[#c4933f] px-5 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {CTA_RESERVAR_LABEL}
                  </Link>
                  <Link
                    href={MACETAS_PRODUCTO.detailHref}
                    scroll
                    className="inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#f0f5ea]"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </article>

            <article
              id={PARQUIZACION_PRODUCTO.id}
              className="mb-12 flex flex-col gap-6 rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm md:mb-14 md:flex-row-reverse md:items-center md:gap-10 md:p-8"
            >
              <div className="relative mx-auto h-52 w-full max-w-md shrink-0 overflow-hidden rounded-xl bg-[#f0f5ea] md:mx-0 md:h-56 md:w-80 md:max-w-none">
                <Image
                  src={PARQUIZACION_PRODUCTO.img}
                  alt={`${PARQUIZACION_PRODUCTO.tituloPrincipal} ${PARQUIZACION_PRODUCTO.tituloSecundario}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              <div className="flex-1 text-center md:text-right">
                <span className="text-3xl" aria-hidden>
                  {PARQUIZACION_PRODUCTO.icon}
                </span>
                <h2 className="mt-2">
                  <span className="block text-base font-bold uppercase tracking-wide text-[#1c1c1c] md:text-lg">
                    {PARQUIZACION_PRODUCTO.tituloPrincipal}
                  </span>
                  <span className="mt-1 block text-2xl font-bold text-[#2d5016] md:text-3xl">
                    {PARQUIZACION_PRODUCTO.tituloSecundario}
                  </span>
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#555] md:ml-auto md:max-w-xl">
                  {PARQUIZACION_PRODUCTO.desc}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:ml-auto md:justify-end">
                  <Link
                    href="/reservar"
                    onClick={() => trackCta("reservar_click", "parquizacion_card")}
                    className="inline-flex justify-center rounded-full bg-[#c4933f] px-5 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {CTA_RESERVAR_LABEL}
                  </Link>
                  <Link
                    href={PARQUIZACION_PRODUCTO.detailHref}
                    scroll
                    className="inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#f0f5ea]"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </article>

            <article
              id={MADERA_PRODUCTO.id}
              className="mb-12 flex flex-col gap-6 rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm md:mb-14 md:flex-row md:items-center md:gap-10 md:p-8"
            >
              <div className="relative mx-auto h-52 w-full max-w-md shrink-0 overflow-hidden rounded-xl bg-[#f0f5ea] md:mx-0 md:h-56 md:w-80 md:max-w-none">
                <Image
                  src={MADERA_PRODUCTO.img}
                  alt={`${MADERA_PRODUCTO.tituloPrincipal} ${MADERA_PRODUCTO.tituloSecundario}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="mt-0 md:mt-0">
                  <span className="block text-base font-bold uppercase tracking-wide text-[#1c1c1c] md:text-lg">
                    {MADERA_PRODUCTO.tituloPrincipal}
                  </span>
                  <span className="mt-1 block text-2xl font-bold text-[#2d5016] md:text-3xl">
                    {MADERA_PRODUCTO.tituloSecundario}
                  </span>
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#555] md:max-w-xl">
                  {MADERA_PRODUCTO.desc}
                </p>
                <p className="mt-3 text-sm font-semibold text-[#2d5016] md:max-w-xl">
                  {MADERA_PRODUCTO.tagline}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={MADERA_PRODUCTO.detailHref}
                    scroll
                    onClick={() => trackCta("ver_mas_click", "madera_card")}
                    className="inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#f0f5ea]"
                  >
                    Ver más
                  </Link>
                  {/* <Link
                    href={`${MADERA_PRODUCTO.detailHref}#comprar`}
                    scroll
                    onClick={() => trackCta("madera_comprar_click", "madera_card")}
                    className="inline-flex justify-center rounded-full bg-[#c4933f] px-5 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Comprar con Mercado Pago
                  </Link> */}
                </div>
              </div>
            </article>

            <div className="mb-12 md:mb-14">
              <TerekuaMvpBlock location="home_mvp" page="home" />
            </div>

            <article
              id={BIODIVERSIDAD_PRODUCTO.id}
              className="flex flex-col gap-6 rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm md:flex-row-reverse md:items-center md:gap-10 md:p-8"
            >
              <div className="relative mx-auto h-52 w-full max-w-md shrink-0 overflow-hidden rounded-xl bg-[#f0f5ea] md:mx-0 md:h-56 md:w-80 md:max-w-none">
                <Image
                  src={BIODIVERSIDAD_PRODUCTO.img}
                  alt={BIODIVERSIDAD_PRODUCTO.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              <div className="flex-1 text-center md:text-right">
                <span className="text-3xl" aria-hidden>
                  {BIODIVERSIDAD_PRODUCTO.icon}
                </span>
                <h2 className="mt-2 text-balance text-xl font-bold leading-snug text-[#2d5016] md:text-2xl">
                  {BIODIVERSIDAD_PRODUCTO.titulo}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#555] md:ml-auto md:max-w-xl">
                  {BIODIVERSIDAD_PRODUCTO.resumen}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:ml-auto md:justify-end">
                  <Link
                    href={BIODIVERSIDAD_PRODUCTO.detailHref}
                    scroll
                    onClick={() => trackCta("ver_mas_click", "biodiversidad_card")}
                    className="inline-flex justify-center rounded-full border-2 border-[#2d5016] bg-white px-5 py-2.5 text-center text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#f0f5ea]"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/*
         * Pedido cliente: oculto desde barra STATS hasta sección Tierras (inclusive).
         * La sección "CTA final" (#contacto) y el <footer> permanecen visibles.
         * Restaurar bloques ocultos: cambiar \`false &&\` por \`true &&\` o eliminar el envoltorio.
         */}
        {false && (
          <>
        {/* ══════════════════════════════════════════════════
            3. BARRA DE STATS
        ══════════════════════════════════════════════════ */}
        <section className="bg-[#2d5016] px-4 py-8">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 text-center text-white">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#c4933f] md:text-4xl">{s.valor}</p>
                <p className="mt-0.5 text-xs text-white/70 md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            3. SERVICIOS PRINCIPALES
        ══════════════════════════════════════════════════ */}
        <section id="servicios" className="bg-[#fafaf7] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-[#1c1c1c] md:text-4xl">
                ¿En qué puedo ayudarte?
              </h2>
              <p className="mt-2 text-[#555]">
                Servicios completos de jardinería en Bahía Blanca. Agendá una visita y arrancamos.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICIOS.map((s) => (
                <div
                  key={s.title}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4ead8] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Imagen del servicio */}
                  <div className="relative h-40 overflow-hidden bg-[#f0f5ea]">
                    <Image
                      src={s.img}
                      alt={s.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <span className="text-2xl" role="img" aria-label={s.title}>{s.icon}</span>
                    <h3 className="font-semibold text-[#1c1c1c]">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-[#555]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/reservar"
                className="inline-block rounded-full bg-[#c4933f] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Agendar una visita gratuita
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            4. POR QUÉ ELEGIRNOS
        ══════════════════════════════════════════════════ */}
        <section id="por-que" className="bg-[#f0f5ea] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-[#1c1c1c] md:text-4xl">
                ¿Por qué elegir a Guillermo?
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {POR_QUE.map((p) => (
                <div key={p.title} className="flex flex-col items-center gap-3 text-center">
                  <span className="text-4xl" role="img" aria-label={p.title}>{p.icon}</span>
                  <h3 className="text-lg font-semibold text-[#2d5016]">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-[#555]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            5. GALERÍA DE TRABAJOS
        ══════════════════════════════════════════════════ */}
        <section id="trabajos" className="bg-white px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-3 text-center">
              <span className="text-sm font-medium uppercase tracking-widest text-[#2d5016]">
                Trabajos realizados
              </span>
            </div>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-[#1c1c1c] md:text-4xl">
                Resultados reales, en Bahía Blanca
              </h2>
              <p className="mt-2 text-[#888]">
                Cada foto es un jardín real trabajado por Guillermo.
              </p>
            </div>

            {/* Grid masonry-like */}
            <div className="columns-2 gap-3 md:columns-3 lg:columns-3 [&>div]:mb-3">
              {GALERIA.map((img, i) => (
                <div key={img.src} className="relative overflow-hidden rounded-xl bg-[#f0f5ea]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={600}
                    height={i % 3 === 1 ? 500 : 380}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/reservar"
                className="inline-block rounded-full bg-[#c4933f] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Quiero un jardín así — agendá tu visita
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            6. TESTIMONIOS
        ══════════════════════════════════════════════════ */}
        <section className="bg-[#fafaf7] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-[#1c1c1c] md:text-4xl">
                Lo que dicen los clientes
              </h2>
              <p className="mt-2 text-sm text-[#888]">Testimonios de vecinos de Bahía Blanca</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIOS.map((t) => (
                <div
                  key={t.nombre}
                  className="flex flex-col gap-3 rounded-2xl border border-[#e4ead8] bg-white p-6"
                >
                  <div className="flex gap-0.5 text-[#c4933f]" aria-label={`${t.estrellas} estrellas`}>
                    {Array.from({ length: t.estrellas }).map((_, i) => (
                      <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-[#333]">&quot;{t.texto}&quot;</p>
                  <div className="mt-auto border-t border-[#e4ead8] pt-3">
                    <p className="text-sm font-semibold text-[#1c1c1c]">{t.nombre}</p>
                    <p className="text-xs text-[#888]">{t.barrio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            7. SOBRE GUILLERMO
        ══════════════════════════════════════════════════ */}
        <section id="sobre-guillermo" className="bg-[#f0f5ea] px-4 py-16 md:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 md:flex-row md:gap-12">
            <div className="shrink-0">
              <div className="relative h-44 w-44 overflow-hidden rounded-full shadow-lg md:h-52 md:w-52">
                <Image
                  src="/ultimas imagenes/4.webp"
                  alt="Guillermo, jardinero en Bahía Blanca"
                  fill
                  className="object-cover"
                  sizes="208px"
                />
              </div>
            </div>
            <div>
              <span className="mb-2 inline-block text-sm font-medium uppercase tracking-widest text-[#2d5016]">
                Sobre mí
              </span>
              <h2 className="mb-4 text-3xl font-bold text-[#1c1c1c] md:text-4xl">
                Hola, soy Guillermo
              </h2>
              <p className="mb-3 leading-relaxed text-[#444]">
                Soy jardinero independiente con más de 10 años de experiencia en Bahía Blanca.
                Me dedico a crear y mantener jardines para casas particulares y comercios de la zona.
              </p>
              <p className="mb-5 leading-relaxed text-[#444]">
                Trabajo solo, con mucho cuidado y sin apuro. Cada jardín es diferente, y me tomo el
                tiempo para entender lo que necesitás antes de arrancar. Lo que prometo, lo cumplo.
              </p>
              <WhatsAppLink
                location="sobre_mi"
                page="home"
                className="inline-flex items-center gap-2 rounded-full bg-[#2d5016] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <WAIcon className="h-4 w-4" /> Escribime directamente
              </WhatsAppLink>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            8. TIERRAS (macetas, parquización y madera ya están arriba, tras el hero)
        ══════════════════════════════════════════════════ */}
        <section id="decoracion" className="border-t border-[#e4ead8] bg-white px-4 py-14 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-2 text-center">
              <span className="text-sm font-medium uppercase tracking-widest text-[#2d5016]">
                También
              </span>
            </div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#1c1c1c] md:text-3xl">
                {TIERRAS_PRODUCTO.title}
              </h2>
              <p className="mt-1 text-sm text-[#888]">
                Complemento para macetas, canteros y jardín.
              </p>
            </div>
            <div className="mx-auto max-w-lg">
              <div className="flex flex-col gap-3 rounded-2xl border border-[#e4ead8] bg-[#fafaf7] p-6 text-center">
                <span className="text-3xl" role="img" aria-hidden>
                  {TIERRAS_PRODUCTO.icon}
                </span>
                <p className="text-sm leading-relaxed text-[#666]">{TIERRAS_PRODUCTO.desc}</p>
                <Link
                  href="/reservar"
                  className="mx-auto mt-1 inline-block text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80"
                >
                  Consultar por la web →
                </Link>
              </div>
            </div>
          </div>
        </section>
          </>
        )}

        {/* ══════════════════════════════════════════════════
            CTA FINAL (siempre visible — no forma parte del bloque oculto arriba)
        ══════════════════════════════════════════════════ */}
        <section
          id="contacto"
          className="relative overflow-hidden bg-[#2d5016] px-4 py-16 text-white md:py-24"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, #7db33f 0%, transparent 50%), radial-gradient(circle at 10% 90%, #c4933f 0%, transparent 50%)",
            }}
          />
          <div className="relative mx-auto max-w-2xl text-center">
            {false && (
              <>
                {/* Pedido cliente: ocultar titular y bajada del CTA; restaurar con true */}
                <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
                  ¿Listo para tener el jardín que siempre quisiste?
                </h2>
                <p className="mb-8 text-lg text-white/80">
                  Agendá una visita sin cargo directamente desde la web. Guillermo se contacta en
                  menos de 24 hs para confirmar el día y la hora.
                </p>
              </>
            )}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
             {/*  <Link
                href="/reservar"
                onClick={() => trackCta("reservar_click", "cta_final")}
                className="flex w-full items-center justify-center rounded-full bg-[#c4933f] px-8 py-4 text-base font-bold text-white shadow-xl transition-opacity hover:opacity-90 sm:w-auto"
              >
                {CTA_RESERVAR_LABEL}
              </Link> */}
              <WhatsAppLink
                location="cta_final"
                page="home"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                <WAIcon className="h-4 w-4" /> Prefiero hablar primero
              </WhatsAppLink>
            </div>
            <p className="mt-5 text-sm text-white/50">
              Sin compromiso · Confirmación en menos de 24 hs
            </p>
          </div>
        </section>
      </main>

      <RedesignFooter />
      </NavMenuProvider>
      </div>
    </>
  );
}
