"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// ── Constantes ────────────────────────────────────────────────────────────────
const WA_HREF =
  "https://wa.me/5492914315080?text=Hola%20Guillermo%2C%20quisiera%20coordinar%20una%20visita%20para%20ver%20mi%20jard%C3%ADn%20y%20pedir%20presupuesto.";

// Imágenes del carrusel hero (trabajos reales de Guillermo)
const HERO_IMAGES = [
  "/ultimas imagenes/1 (1).webp",
  "/ultimas imagenes/3.webp",
  "/ultimas imagenes/5.webp",
  "/ultimas imagenes/7.webp",
  "/ultimas imagenes/9.webp",
];

// Galería de trabajos (todas las disponibles)
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

const DECORACION = [
  {
    icon: "🪵",
    title: "Artículos en madera",
    desc: "Piezas decorativas y utilitarias elaboradas en madera para interiores y exteriores.",
  },
  {
    icon: "🪴",
    title: "Macetas y plantas",
    desc: "Selección de macetas y plantas para interiores y exteriores, con asesoramiento incluido.",
  },
  {
    icon: "🌱",
    title: "Tierras y sustrato",
    desc: "Tierras y sustratos seleccionados para el desarrollo óptimo de plantas y jardines.",
  },
];

// ── Ícono WhatsApp (reutilizable) ─────────────────────────────────────────────
function WAIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Sticky WhatsApp (mobile) ──────────────────────────────────────────────────
function StickyWA() {
  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95 md:hidden"
      aria-label="Escribinos por WhatsApp"
    >
      <WAIcon />
      WhatsApp
    </a>
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
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <StickyWA />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#2d5016]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">
              Jardinería<span className="text-[#c4933f]">GV</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/80 md:flex">
            <a href="#servicios" className="transition-colors hover:text-white">Servicios</a>
            <a href="#trabajos" className="transition-colors hover:text-white">Trabajos</a>
            <a href="#sobre-guillermo" className="transition-colors hover:text-white">Sobre Guillermo</a>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-white"
            >
              <WAIcon className="h-4 w-4" /> WhatsApp
            </a>
            <Link
              href="/reservar"
              className="rounded-full bg-[#c4933f] px-4 py-1.5 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Agendar visita
            </Link>
          </nav>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-white md:hidden"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {navOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {navOpen && (
          <div className="border-t border-white/10 bg-[#2d5016] px-4 pb-4 md:hidden">
            <nav className="flex flex-col gap-3 pt-3 text-base font-medium text-white/90">
              <a href="#servicios"       onClick={() => setNavOpen(false)} className="py-1">Servicios</a>
              <a href="#trabajos"        onClick={() => setNavOpen(false)} className="py-1">Trabajos realizados</a>
              <a href="#por-que"         onClick={() => setNavOpen(false)} className="py-1">¿Por qué elegirnos?</a>
              <a href="#sobre-guillermo" onClick={() => setNavOpen(false)} className="py-1">Sobre Guillermo</a>
              <Link
                href="/reservar"
                className="mt-1 flex items-center justify-center rounded-full bg-[#c4933f] px-4 py-2.5 font-semibold text-white"
                onClick={() => setNavOpen(false)}
              >
                Agendar visita
              </Link>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-white/80"
                onClick={() => setNavOpen(false)}
              >
                <WAIcon className="h-4 w-4" /> WhatsApp
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="overflow-x-hidden">

        {/* ══════════════════════════════════════════════════
            1. HERO con carrusel
        ══════════════════════════════════════════════════ */}
        <section className="relative min-h-[85vh] px-4 py-20 text-white md:min-h-[80vh] md:py-32 flex items-center">
          <HeroCarousel />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-sm">
              Jardinería en Bahía Blanca
            </span>

            <h1 className="mb-5 text-balance text-4xl font-bold leading-tight tracking-tight drop-shadow-lg md:text-5xl lg:text-6xl">
              Tu jardín en manos de{" "}
              <span className="text-[#e8b46a]">alguien que sabe</span>{" "}
              lo que hace
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg text-white/85 drop-shadow md:text-xl">
              Diseño, mantenimiento y riego automático para casas y comercios en
              Bahía Blanca. Agendá una visita sin cargo en minutos.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/reservar"
                className="flex w-full items-center justify-center rounded-full bg-[#c4933f] px-7 py-3.5 text-base font-bold text-white shadow-xl transition-opacity hover:opacity-90 sm:w-auto"
              >
                Agendar visita sin cargo
              </Link>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/50 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:w-auto"
              >
                <WAIcon className="h-4 w-4" /> Hablar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            2. BARRA DE STATS
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
                  <p className="text-sm leading-relaxed text-[#333]">"{t.texto}"</p>
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
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#2d5016] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <WAIcon className="h-4 w-4" /> Escribime directamente
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            8. DECORACIÓN Y PRODUCTOS
        ══════════════════════════════════════════════════ */}
        <section id="decoracion" className="border-t border-[#e4ead8] bg-white px-4 py-14 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-2 text-center">
              <span className="text-sm font-medium uppercase tracking-widest text-[#2d5016]">
                Además
              </span>
            </div>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#1c1c1c] md:text-3xl">
                Decoración y productos
              </h2>
              <p className="mt-1 text-sm text-[#888]">
                Todo lo que necesitás para tu jardín, en un solo lugar.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {DECORACION.map((d) => (
                <div
                  key={d.title}
                  className="flex flex-col gap-2 rounded-2xl border border-[#e4ead8] bg-[#fafaf7] p-5"
                >
                  <span className="text-2xl" role="img" aria-label={d.title}>{d.icon}</span>
                  <h3 className="font-semibold text-[#1c1c1c]">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-[#666]">{d.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80"
              >
                Consultar disponibilidad por WhatsApp →
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            9. CTA FINAL
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
            <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
              ¿Listo para tener el jardín que siempre quisiste?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Agendá una visita sin cargo directamente desde la web. Guillermo se contacta en menos
              de 24 hs para confirmar el día y la hora.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/reservar"
                className="flex w-full items-center justify-center rounded-full bg-[#c4933f] px-8 py-4 text-base font-bold text-white shadow-xl transition-opacity hover:opacity-90 sm:w-auto"
              >
                Agendar mi visita sin cargo
              </Link>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                <WAIcon className="h-4 w-4" /> Prefiero hablar primero
              </a>
            </div>
            <p className="mt-5 text-sm text-white/50">
              Sin compromiso · Confirmación en menos de 24 hs
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-[#1e3a0c] px-4 py-8 text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} JarderíaGV · Bahía Blanca</p>
          <p className="mt-1">
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/80"
            >
              Contacto por WhatsApp
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
