"use client";

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

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden rounded-2xl bg-[#f4f5f5] lg:block lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start lg:py-6 lg:px-4">
            <nav className="flex flex-col gap-1">
              <div className="mb-6 flex items-center gap-3 px-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#166534]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20c4.5-2.2 7-6.2 7-10.8C15 9.2 12.7 8 10 8c-2.5 0-4.7 1.2-6 3.3C4 15.4 7.1 18.8 12 20Z" />
                    <path d="M12 19c0-5 2.6-9 7-11" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#111827]">Jardineriagv</span>
              </div>

              <a
                href="#servicios-jardineria"
                className="rounded-lg bg-[#f0fdf4] px-3 py-2 text-sm font-medium text-[#166534]"
              >
                Servicios de jardinería
              </a>
              <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-[#dcfce7] pl-3">
                {featuredServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/servicios/${service.id}`}
                    className="rounded-md px-2 py-1.5 text-[13px] text-[#374151] transition hover:bg-[#f0fdf4] hover:text-[#166534]"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>

              <a
                href="#decoracion"
                className="mt-2 rounded-lg px-3 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] hover:text-[#111827]"
              >
                Decoración
              </a>
              <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-[#e5e7eb] pl-3">
                {decoracionItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="rounded-md px-2 py-1.5 text-[13px] text-[#6b7280] transition hover:bg-[#f9fafb] hover:text-[#111827]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <a
                href="#madera-plastica"
                className="mt-2 rounded-lg px-3 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] hover:text-[#111827]"
              >
                Madera plástica
              </a>
              <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-[#e5e7eb] pl-3">
                {maderaPlasticaItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="rounded-md px-2 py-1.5 text-[13px] text-[#6b7280] transition hover:bg-[#f9fafb] hover:text-[#111827]"
                  >
                    {item.label}
                  </a>
                ))}
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
