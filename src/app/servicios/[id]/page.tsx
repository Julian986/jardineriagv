import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { jardineriaServices, whatsappHref } from "@/app/data/services";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = jardineriaServices.find((item) => item.id === id);

  if (!service) {
    return {
      title: "Servicio no encontrado | Jardineriagv",
    };
  }

  return {
    title: `${service.title} | Jardineriagv`,
    description: service.summary,
  };
}

export default async function ServicioDetailPage({ params }: Props) {
  const { id } = await params;
  const service = jardineriaServices.find((item) => item.id === id);

  if (!service) {
    notFound();
  }

  const breadcrumbs = [
    { href: "/", label: "Inicio" },
    { href: "/#servicios-jardineria", label: "Servicios de jardineria" },
    { href: `/servicios/${service.id}`, label: service.title },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8f8] text-[#222222]">
      <main className="mx-auto max-w-[1200px] px-4 py-8 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-black/55">
            {breadcrumbs.map((item, index) => (
              <span key={item.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link
                  href={item.href}
                  className={
                    index === breadcrumbs.length - 1
                      ? "font-semibold text-black/80"
                      : "hover:text-[#0f5f2f]"
                  }
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <Link
            href="/#servicios-jardineria"
            className="inline-flex items-center justify-center rounded-full border border-[#0f5f2f] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0f5f2f] hover:bg-[#0f5f2f] hover:text-white"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section aria-label={`Imagenes del servicio ${service.title}`}>
            <div className="overflow-hidden rounded-[22px] border border-black/8 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-[4/3] w-full bg-[#eceeed]">
                {service.images.length > 0 ? (
                  <Image
                    src={service.images[0]}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-black/45">
                    Imagen principal del servicio
                  </div>
                )}
              </div>

              <div className="border-t border-black/5 bg-[#f7f7f5] px-4 py-3">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {service.images.length > 0 ? (
                    service.images.map((img, index) => (
                      <div
                        key={img}
                        className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[10px] border border-black/10 bg-[#e3e5e0]"
                      >
                        <Image
                          src={img}
                          alt={`${service.title} imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex h-16 items-center text-xs text-black/45">
                      Galeria preparada para 4/5 imagenes del servicio.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <section className="mt-8 space-y-4 rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-semibold text-black">
                Descripcion detallada
              </h2>
              <p className="text-[15px] leading-7 text-black/75">
                {service.description}
              </p>
              <p className="text-[15px] leading-7 text-black/75">
                Esta pagina de detalle esta pensada para complementar la ficha
                rapida del catalogo, sumando imagenes, informacion mas extensa y
                llamados a la accion claros para coordinar una visita o cerrar el
                servicio.
              </p>
            </section>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[22px] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-[#d81d1d] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                  {service.badge}
                </span>
                <span className="text-2xl" aria-hidden="true">
                  {service.icon}
                </span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/40">
                {service.category}
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black">
                {service.title}
              </h1>

              <div className="mt-4">
                <p className="text-[13px] font-semibold text-black/60">
                  Valor de referencia
                </p>
                <p className="mt-1 text-[32px] font-semibold leading-none text-[#b0322f]">
                  {service.price}
                </p>
                <p className="mt-2 text-[12px] text-black/50">
                  El valor final se confirma luego de la visita y relevamiento del
                  espacio.
                </p>
              </div>

              <p className="mt-4 text-[14px] leading-6 text-black/75">
                {service.summary}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#0f5f2f] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#0b4823]"
                >
                  Agendar visita por WhatsApp
                </Link>
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center rounded-full border border-[#0f5f2f] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#0f5f2f]"
                >
                  Pedir presupuesto detallado
                </Link>
              </div>

              <ul className="mt-6 space-y-2 text-[13px] text-black/75">
                <li>• Ideal para clientes que quieren entender el alcance del servicio.</li>
                <li>• Permite compartir el enlace directo por WhatsApp o redes.</li>
                <li>• Facil de actualizar cuando cambien precios o condiciones.</li>
              </ul>
            </section>

            <section className="rounded-[22px] bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
              <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-black">
                Metodos de pago sugeridos
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-black/75">
                Esta seccion queda lista para detallar medios de pago y
                condiciones una vez que el cliente los defina.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] text-black/80">
                <li>• Efectivo o transferencia bancaria.</li>
                <li>• Señal para reservar visita o fecha de obra.</li>
                <li>• Posibilidad de cuotas segun el tipo de trabajo.</li>
              </ul>
            </section>

            <section className="rounded-[22px] bg-[#0f5f2f] p-6 text-white shadow-[0_8px_24px_rgba(15,95,47,0.45)]">
              <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em]">
                Otros servicios relacionados
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-white/80">
                Desde esta pagina podemos luego enlazar a otros servicios
                complementarios, como riego automatico, canteros o mantenimiento
                periodico.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {jardineriaServices
                  .filter((item) => item.id !== service.id)
                  .slice(0, 3)
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/servicios/${item.id}`}
                      className="rounded-full border border-white/40 px-3 py-1 text-[11px] font-semibold"
                    >
                      {item.title}
                    </Link>
                  ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

