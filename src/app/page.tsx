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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8f8] text-[#222222]">
      <div className="bg-[#0f5f2f] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.08em] text-white uppercase">
        Enviamos a todo GBA y alrededores · Presupuestos claros y visitas programadas
      </div>

      <header className="border-b border-black/10 bg-white">
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

      <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 text-[11px] text-black/55 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 uppercase tracking-[0.08em]">
            <span>Inicio</span>
            <span>/</span>
            <span>Jardineria</span>
            <span>/</span>
            <span>Catalogo</span>
            <span>/</span>
            <span className="font-semibold text-black/80">Servicios y productos</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span>Mostrando 1-15 de 15 resultados</span>
            <select className="h-10 min-w-[210px] rounded-sm border border-black/10 bg-white px-3 text-[12px] text-black/70 outline-none">
              <option>Orden predeterminado</option>
              <option>Destacados primero</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="bg-transparent">
              <p className="mb-3 text-xs text-black/45">Subcategoria</p>
              <h2 className="text-[28px] font-medium tracking-tight text-black">
                Jardin
              </h2>
              <a
                href="#servicios-jardineria"
                className="mt-2 inline-block text-[12px] text-black/55 hover:text-[#0f5f2f]"
              >
                volver al catalogo
              </a>
            </section>

            <section className="border-t border-black/10 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <a
                  href="#servicios-jardineria"
                  className="text-[13px] font-semibold text-black hover:text-[#0f5f2f]"
                >
                  Servicios de jardineria
                </a>
                <span className="text-[12px] text-black/40">2</span>
              </div>
              <div className="space-y-2 text-[15px]">
                {jardineriaServices.slice(0, 2).map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between gap-3 rounded-sm bg-[#dedede] px-3 py-2"
                  >
                    <Link
                      href={`/servicios/${service.id}`}
                      className="text-black transition hover:text-[#0f5f2f]"
                    >
                      {service.title}
                    </Link>
                    <span className="shrink-0 text-[12px] text-black/50">›</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <a
                  href="#decoracion"
                  className="text-[13px] font-semibold text-black hover:text-[#0f5f2f]"
                >
                  Decoracion
                </a>
                <span className="text-[12px] text-black/40">2</span>
              </div>
              <div className="space-y-2 text-[15px]">
                {decoracionItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-sm bg-[#dedede] px-3 py-2"
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-black transition hover:text-[#0f5f2f]"
                    >
                      {item.label}
                    </a>
                    <span className="shrink-0 text-[12px] text-black/50">›</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-black/10 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <a
                  href="#madera-plastica"
                  className="text-[13px] font-semibold text-black hover:text-[#0f5f2f]"
                >
                  Madera plastica
                </a>
                <span className="text-[12px] text-black/40">5</span>
              </div>
              <div className="space-y-2 text-[15px]">
                {maderaPlasticaItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-sm bg-[#dedede] px-3 py-2"
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-black transition hover:text-[#0f5f2f]"
                    >
                      {item.label}
                    </a>
                    <span className="shrink-0 text-[12px] text-black/50">›</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <div className="space-y-10">
            <section id="servicios-jardineria">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/45">
                    Catalogo principal
                  </p>
                  <h2 className="text-3xl font-medium tracking-tight text-black">
                    Servicios de jardineria
                  </h2>
                </div>
                <a
                  href={whatsappHref}
                  className="rounded-full border border-[#0f5f2f] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0f5f2f]"
                >
                  Consultar todos
                </a>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {jardineriaServices.map((service) => (
                  <article
                    key={service.id}
                    className="rounded-[18px] border border-black/5 bg-white p-3 shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
                  >
                    <div className="mb-4 flex min-h-[230px] items-center justify-center rounded-[14px] bg-[#f5f5f3] p-6">
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-[12px] border border-black/5 bg-[linear-gradient(180deg,#f2f2ef_0%,#e9ece6_100%)] p-6 text-center">
                        <span className="mb-3 rounded-full bg-[#d81d1d] px-3 py-1 text-[11px] font-bold text-white">
                          {service.badge}
                        </span>
                        <span className="text-6xl">{service.icon}</span>
                      </div>
                    </div>

                    <div className="px-1 pb-1 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-black/35">
                        {service.category}
                      </p>
                      <h3 className="mt-2 min-h-[44px] text-[15px] font-medium uppercase text-black">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-[26px] font-semibold leading-none text-[#b0322f]">
                        {service.price}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-black/35">
                        Presupuesto orientativo
                      </p>
                      <Link
                        href={`/servicios/${service.id}`}
                        className="mt-4 inline-flex rounded-full bg-[#2b6a3c] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#21532f]"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-5">
              {jardineriaServices.map((service) => (
                <article
                  id={service.id}
                  key={service.id}
                  className="rounded-[18px] border border-black/6 bg-white p-6 shadow-[0_4px_18px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="max-w-3xl">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40">
                        {service.category}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium text-black">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-7 text-black/75">
                        {service.description}
                      </p>
                    </div>

                    <div className="min-w-[250px] rounded-[16px] bg-[#f5f5f2] p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40">
                        Valor de referencia
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-[#b0322f]">
                        {service.price}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-black/70">
                        {service.summary}
                      </p>
                      <a
                        href={whatsappHref}
                        className="mt-5 inline-flex rounded-full bg-[#2b6a3c] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#21532f]"
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/45">
                  Categoria complementaria
                </p>
                <h2 className="text-3xl font-medium tracking-tight text-black">
                  Decoracion
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {decoracionItems.map((item) => (
                  <article
                    id={item.id}
                    key={item.id}
                    className="rounded-[18px] border border-black/6 bg-white p-6 shadow-[0_4px_18px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] bg-[#efefe9] text-3xl">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-black">{item.label}</h3>
                        <p className="mt-2 text-[15px] leading-7 text-black/75">
                          {item.text}
                        </p>
                        <a
                          href={whatsappHref}
                          className="mt-4 inline-flex rounded-full border border-[#2b6a3c] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#2b6a3c]"
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/45">
                  Linea de productos
                </p>
                <h2 className="text-3xl font-medium tracking-tight text-black">
                  Madera plastica
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {maderaPlasticaItems.map((item) => (
                  <article
                    id={item.id}
                    key={item.id}
                    className="rounded-[18px] border border-black/6 bg-white p-5 shadow-[0_4px_18px_rgba(0,0,0,0.05)]"
                  >
                    <div className="mb-4 flex h-[180px] items-center justify-center rounded-[14px] bg-[#f5f5f2] text-6xl">
                      {item.icon}
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-black/35">
                      Madera plastica
                    </p>
                    <h3 className="mt-2 text-lg font-medium uppercase text-black">
                      {item.label}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-black/75">
                      Categoria preparada para cargar modelos, medidas, imagenes y
                      precios reales en la siguiente etapa.
                    </p>
                    <a
                      href={whatsappHref}
                      className="mt-4 inline-flex rounded-full bg-[#2b6a3c] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white"
                    >
                      Pedir informacion
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="contacto"
              className="rounded-[22px] bg-[#0f5f2f] px-6 py-8 text-white shadow-[0_10px_30px_rgba(15,95,47,0.2)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/70">
                    Contacto directo
                  </p>
                  <h2 className="mt-2 text-3xl font-medium tracking-tight">
                    ¿Querés coordinar una visita o pedir presupuesto?
                  </h2>
                  <p className="mt-3 text-[15px] leading-7 text-white/80">
                    Esta seccion queda lista para conectar luego con agenda de turnos,
                    formulario o WhatsApp del cliente. Por ahora dejamos el CTA directo.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={whatsappHref}
                    className="rounded-full bg-white px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0f5f2f]"
                  >
                    Agendar visita
                  </a>
                  <a
                    href="#servicios-jardineria"
                    className="rounded-full border border-white/35 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white"
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
