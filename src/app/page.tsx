import Link from "next/link";
import { jardineriaServices, whatsappHref } from "@/app/data/services";

const decoracionItems = [
  {
    id: "articulos-maderas",
    label: "Articulos de maderas recuperadas",
    icon: "🪵",
    text: "Piezas decorativas y funcionales con madera recuperada para exterior e interior.",
  },
  {
    id: "macetas-tierras",
    label: "Macetas, tierras y sustratos",
    icon: "🪴",
    text: "Complementos para acompañar proyectos de paisajismo y mantenimiento del jardin.",
  },
] as const;

const maderaPlasticaItems = [
  { id: "tablas-listones", label: "Tablas y listones", icon: "🧱" },
  { id: "cercos-perimetrales", label: "Cercos perimetrales", icon: "🚧" },
  { id: "deck", label: "Deck", icon: "🪵" },
  { id: "tranqueras", label: "Tranqueras", icon: "🚪" },
  { id: "pergolas", label: "Pergolas", icon: "☀️" },
] as const;

const quickLinks = [
  { href: "#servicios-jardineria", label: "Servicios de jardineria" },
  { href: "#decoracion", label: "Decoracion" },
  { href: "#madera-plastica", label: "Madera plastica" },
  { href: "#contacto", label: "Contacto" },
] as const;

const featuredServices = jardineriaServices.slice(0, 2);

type SidebarIconKind =
  | "home"
  | "palette"
  | "grid"
  | "leaf"
  | "sparkles"
  | "layers";

function SidebarIcon({ kind }: { kind: SidebarIconKind }) {
  const className = "h-5 w-5 stroke-[1.8]";

  if (kind === "home") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20h5.5v-5.5h3V20H19V9.5" />
      </svg>
    );
  }

  if (kind === "palette") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
        <path d="M12 3c-5 0-9 3.7-9 8.3C3 15.6 6.3 19 10.5 19H12a2 2 0 0 0 0-4h-.7a1.8 1.8 0 0 1 0-3.5H12c5 0 9-3.7 9-8.2S17 3 12 3Z" />
        <circle cx="7.5" cy="10" r="1" />
        <circle cx="10.5" cy="7.5" r="1" />
        <circle cx="14.5" cy="7.5" r="1" />
      </svg>
    );
  }

  if (kind === "grid") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (kind === "sparkles") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
        <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
        <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
      </svg>
    );
  }

  if (kind === "layers") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
        <path d="m12 4 8 4-8 4-8-4 8-4Z" />
        <path d="m4 12 8 4 8-4" />
        <path d="m4 16 8 4 8-4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path d="M12 4c4.5 0 7 2.7 7 6.1C19 16.2 14.2 20 9 20c-2.2 0-4-.8-4-2.7 0-1.5 1.2-2.4 2.8-2.4h2.5c2.8 0 4.7-1.8 4.7-4.4 0-2.5-2-4.5-4.9-4.5-4 0-6.8 2.8-6.8 7.1" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8f8] text-[#1f2937]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(36,101,60,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(182,160,117,0.16),_transparent_26%)]" />
      <div className="bg-[#0f5f2f] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.08em] text-white uppercase">
        Enviamos a todo GBA y alrededores · Presupuestos claros y visitas programadas
      </div>

      <header className="relative z-10 border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-5 lg:px-8">
          <div className="min-w-fit text-3xl font-black tracking-[0.28em] text-[#101010]">
            JARDINERIAGV
          </div>

          <div className="hidden flex-1 lg:block">
            <label
              htmlFor="catalog-search"
              className="flex h-12 items-center rounded-sm border border-black/10 bg-[#fafafa] px-4"
            >
              <span className="mr-3 text-sm text-black/35">⌕</span>
              <input
                id="catalog-search"
                type="text"
                placeholder="Buscar servicios, categorias o productos..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
              />
            </label>
          </div>

          <div className="ml-auto flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/75">
            <a href="#contacto" className="hover:text-[#0f5f2f]">
              Acceder / registrarse
            </a>
            <a
              href="#servicios-jardineria"
              className="rounded-full bg-[#0f5f2f] px-3 py-2 text-white"
            >
              Favoritos
            </a>
            <a
              href={whatsappHref}
              className="rounded-full border border-[#0f5f2f] px-3 py-2 text-[#0f5f2f]"
            >
              Agendar
            </a>
          </div>
        </div>

        <div className="border-t border-black/6">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-3 lg:px-8">
            <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em]">
              <a
                href="#servicios-jardineria"
                className="rounded bg-[#0f5f2f] px-3 py-2 text-white"
              >
                Catalogo
              </a>
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2 py-1 text-black/75 transition hover:text-[#0f5f2f]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-black/75">
              Hasta 3 visitas cotizadas · Respuesta rapida por WhatsApp
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
        {/* Hero principal comentado a pedido del cliente
        <section className="mb-8 overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(249,247,242,0.9))] shadow-[0_24px_70px_rgba(31,41,55,0.08)]">
          ...
        </section>
        */}

        {/* Barra de breadcrumb y selector de orden comentada a pedido del cliente
        <div className="mb-8 flex flex-col gap-4 rounded-[24px] border border-white/60 bg-white/80 px-5 py-4 shadow-[0_16px_40px_rgba(31,41,55,0.05)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#6b7280]">
            <span>Inicio</span>
            <span>/</span>
            <span>Jardineria</span>
            <span>/</span>
            <span>Catalogo</span>
            <span>/</span>
            <span className="font-semibold text-[#111827]">Servicios y productos</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-[#6b7280]">
            <span>Mostrando 1-15 de 15 resultados</span>
            <select className="h-11 min-w-[220px] rounded-full border border-[#d6ddd6] bg-[#f8faf8] px-4 text-[12px] font-semibold text-[#374151] outline-none">
              <option>Orden predeterminado</option>
              <option>Destacados primero</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
            </select>
          </div>
        </div>
        */}

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="mt-2 lg:mt-4 lg:sticky lg:top-24 lg:self-start">
            <nav className="rounded-[28px] border border-white/70 bg-white/95 px-4 py-5 shadow-[0_18px_46px_rgba(31,41,55,0.06)]">
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#4f46e5] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6 stroke-[2.4]">
                  <path d="M4 8c2.5-3 6.5-3 9 0s6.5 3 9 0" />
                  <path d="M4 16c2.5-3 6.5-3 9 0s6.5 3 9 0" />
                </svg>
              </div>

              <div className="space-y-1">
                <a
                  href="#servicios-jardineria"
                  className="flex items-center gap-3 rounded-xl bg-[#f5f6fb] px-3 py-3 text-[#4f46e5]"
                >
                  <SidebarIcon kind="home" />
                  <span className="text-[15px] font-semibold">Servicios de jardinería</span>
                </a>

                <a
                  href="#decoracion"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-[#0f172a] transition hover:bg-[#f8f9fb]"
                >
                  <span className="text-[#94a3b8]">
                    <SidebarIcon kind="palette" />
                  </span>
                  <span className="text-[15px] font-semibold">Decoración</span>
                </a>

                <a
                  href="#madera-plastica"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-[#0f172a] transition hover:bg-[#f8f9fb]"
                >
                  <span className="text-[#94a3b8]">
                    <SidebarIcon kind="grid" />
                  </span>
                  <span className="text-[15px] font-semibold">Madera plástica</span>
                </a>
              </div>

              <div className="mt-8">
                <p className="px-2 text-[13px] font-semibold text-[#a78bfa]">Destacados</p>
                <div className="mt-3 space-y-2">
                  {featuredServices.map((service) => (
                    <Link
                      key={service.id}
                      href={`/servicios/${service.id}`}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-[#0f172a] transition hover:bg-[#f8f9fb]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#eceef3] bg-white text-[11px] font-semibold text-[#94a3b8]">
                        {service.title.charAt(0)}
                      </span>
                      <span className="text-[14px] font-medium">{service.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="px-2 text-[13px] font-semibold text-[#94a3b8]">Complementos</p>
                <div className="mt-3 space-y-2">
                  <a
                    href="#decoracion"
                    className="flex items-center gap-3 rounded-xl px-2 py-2 text-[#0f172a] transition hover:bg-[#f8f9fb]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#eceef3] bg-white text-[#c084fc]">
                      <SidebarIcon kind="sparkles" />
                    </span>
                    <span className="text-[14px] font-medium">Artículos y decoración</span>
                  </a>

                  <a
                    href="#madera-plastica"
                    className="flex items-center gap-3 rounded-xl px-2 py-2 text-[#0f172a] transition hover:bg-[#f8f9fb]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#eceef3] bg-white text-[#94a3b8]">
                      <SidebarIcon kind="layers" />
                    </span>
                    <span className="text-[14px] font-medium">Línea madera plástica</span>
                  </a>

                  <a
                    href={whatsappHref}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 text-[#0f172a] transition hover:bg-[#f8f9fb]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#eceef3] bg-white text-[#22c55e]">
                      <SidebarIcon kind="leaf" />
                    </span>
                    <span className="text-[14px] font-medium">Pedir asesoramiento</span>
                  </a>
                </div>
              </div>
            </nav>
          </aside>

          <div className="space-y-10">
            <section
              id="servicios-jardineria"
              className="mb-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6a3c]">
                  Catalogo principal
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#101828]">
                  Servicios de jardineria
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#4b5563]">
                  Servicios pensados para presentarse con una imagen más potente y más clara. Cada ficha tiene
                  salida directa a su detalle.
                </p>
              </div>
              <a
                href={whatsappHref}
                className="inline-flex items-center rounded-full border border-[#1f5d38]/20 bg-white/80 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1f5d38] shadow-[0_12px_28px_rgba(31,93,56,0.08)]"
              >
                Consultar todos
              </a>
            </section>

            <section>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {jardineriaServices.map((service, index) => (
                  <article
                    key={service.id}
                    className="group overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,246,241,0.94))] p-3 shadow-[0_18px_46px_rgba(31,41,55,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(31,41,55,0.14)]"
                  >
                    <div
                      className={`relative mb-4 flex min-h-[250px] items-center justify-center overflow-hidden rounded-[22px] p-6 ${
                        index % 4 === 0
                          ? "bg-[linear-gradient(145deg,#edf7ef_0%,#d9ead8_100%)]"
                          : index % 4 === 1
                            ? "bg-[linear-gradient(145deg,#f7f1e7_0%,#eadcc8_100%)]"
                            : index % 4 === 2
                              ? "bg-[linear-gradient(145deg,#eef2f5_0%,#d7e0e8_100%)]"
                              : "bg-[linear-gradient(145deg,#f3efe7_0%,#e4dbc8_100%)]"
                      }`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_45%)]" />
                      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[18px] border border-white/40 bg-white/20 p-6 text-center backdrop-blur-[2px]">
                        <span className="mb-3 rounded-full bg-[#101828] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                          {service.badge}
                        </span>
                        <span className="text-6xl drop-shadow-[0_8px_18px_rgba(255,255,255,0.4)]">
                          {service.icon}
                        </span>
                      </div>
                    </div>

                    <div className="px-2 pb-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                        {service.category}
                      </p>
                      <h3 className="mt-2 min-h-[52px] text-[19px] font-semibold leading-6 tracking-[-0.02em] text-[#111827]">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#9a4034]">
                        {service.price}
                      </p>
                      <p className="mt-2 text-[11px] leading-5 text-[#6b7280]">
                        {service.summary}
                      </p>
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                        Presupuesto orientativo
                      </p>
                      <Link
                        href={`/servicios/${service.id}`}
                        className="mt-5 inline-flex items-center rounded-full bg-[#1f5d38] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(31,93,56,0.2)] transition hover:bg-[#18492c]"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-5">
              {jardineriaServices.map((service, index) => (
                <article
                  id={service.id}
                  key={service.id}
                  className="overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,247,242,0.95))] p-6 shadow-[0_18px_46px_rgba(31,41,55,0.07)]"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                      <div className="mb-4 flex items-center gap-3">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                            index % 3 === 0
                              ? "bg-[#e5f1e7]"
                              : index % 3 === 1
                                ? "bg-[#f5ecdf]"
                                : "bg-[#e8eef3]"
                          }`}
                        >
                          {service.icon}
                        </span>
                        <span className="rounded-full bg-[#eef5ee] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1f5d38]">
                          {service.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                        {service.category}
                      </p>
                      <h3 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.03em] text-[#101828]">
                        {service.title}
                      </h3>
                      <p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#4b5563]">
                        {service.description}
                      </p>
                    </div>

                    <div className="min-w-[290px] rounded-[24px] border border-[#dfe8df] bg-[linear-gradient(180deg,#f9fbf9_0%,#eef4ef_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                        Valor de referencia
                      </p>
                      <p className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#9a4034]">
                        {service.price}
                      </p>
                      <div className="mt-4 h-px w-full bg-[#d8e2d9]" />
                      <p className="mt-4 text-[14px] leading-7 text-[#4b5563]">
                        {service.summary}
                      </p>
                      <a
                        href={whatsappHref}
                        className="mt-6 inline-flex rounded-full bg-[#1f5d38] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(31,93,56,0.2)] transition hover:bg-[#18492c]"
                      >
                        Agendar visita
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section id="decoracion" className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a5a24]">
                  Categoria complementaria
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#101828]">
                  Decoracion
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {decoracionItems.map((item) => (
                  <article
                    id={item.id}
                    key={item.id}
                    className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(251,248,241,0.96))] p-6 shadow-[0_18px_46px_rgba(31,41,55,0.06)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#f5ecdf] text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#101828]">
                          {item.label}
                        </h3>
                        <p className="mt-3 text-[15px] leading-8 text-[#4b5563]">
                          {item.text}
                        </p>
                        <a
                          href={whatsappHref}
                          className="mt-5 inline-flex rounded-full border border-[#8a5a24]/20 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a5a24]"
                        >
                          Consultar disponibilidad
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="madera-plastica" className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#425466]">
                  Linea de productos
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#101828]">
                  Madera plastica
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {maderaPlasticaItems.map((item) => (
                  <article
                    id={item.id}
                    key={item.id}
                    className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,249,0.96))] p-5 shadow-[0_18px_46px_rgba(31,41,55,0.06)]"
                  >
                    <div className="mb-5 flex h-[190px] items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#eef3f7_0%,#dde6ee_100%)] text-6xl">
                      {item.icon}
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                      Madera plastica
                    </p>
                    <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-[#101828]">
                      {item.label}
                    </h3>
                    <p className="mt-3 text-[15px] leading-8 text-[#4b5563]">
                      Categoria preparada para cargar modelos, medidas, imagenes y
                      precios reales en la siguiente etapa.
                    </p>
                    <a
                      href={whatsappHref}
                      className="mt-5 inline-flex rounded-full bg-[#425466] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                    >
                      Pedir informacion
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="contacto"
              className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#133d28_0%,#1f5d38_55%,#356f45_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,95,47,0.28)]"
            >
              <div className="pointer-events-none absolute" />
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    Contacto directo
                  </p>
                  <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                    ¿Querés coordinar una visita o pedir presupuesto?
                  </h2>
                  <p className="mt-4 text-[15px] leading-8 text-white/82">
                    Esta seccion queda lista para conectar luego con agenda de turnos,
                    formulario o WhatsApp del cliente. Por ahora dejamos el CTA directo.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={whatsappHref}
                    className="rounded-full bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0f5f2f] shadow-[0_12px_28px_rgba(255,255,255,0.16)]"
                  >
                    Agendar visita
                  </a>
                  <a
                    href="#servicios-jardineria"
                    className="rounded-full border border-white/35 bg-white/5 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur"
                  >
                    Ver catalogo
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
