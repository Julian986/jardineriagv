import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jardineriaServices, whatsappHref } from "@/app/data/services";
import { ServiceGallery } from "./ServiceGallery";

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
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8f8] text-[#222222]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_left,_rgba(36,101,60,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(182,160,117,0.16),_transparent_28%)]" />
      <main className="relative z-10 mx-auto max-w-[1200px] px-4 py-8 lg:px-8 lg:py-12">
        <section className="mb-8 overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(249,247,242,0.9))] px-6 py-7 shadow-[0_24px_70px_rgba(31,41,55,0.08)] lg:px-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#6b7280]">
              {breadcrumbs.map((item, index) => (
                <span key={item.href} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  <Link
                    href={item.href}
                    className={
                      index === breadcrumbs.length - 1
                        ? "font-semibold text-[#111827]"
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
              className="inline-flex items-center justify-center rounded-full border border-[#1f5d38]/20 bg-white/80 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f5d38] shadow-[0_12px_28px_rgba(31,93,56,0.08)]"
            >
              ← Volver al catálogo
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6a3c]">
                Ficha de servicio
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#101828] md:text-5xl">
                {service.title}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[#4b5563]">
                Una ficha pensada para lucir fotos reales, explicar bien el servicio y facilitar el contacto
                directo con el cliente.
              </p>
            </div>

            <div className="rounded-[26px] bg-[#163e28] p-5 text-white shadow-[0_18px_40px_rgba(22,62,40,0.28)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Valor de referencia
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{service.price}</p>
              <p className="mt-3 text-[14px] leading-7 text-white/80">
                El valor final se confirma luego del relevamiento y de las condiciones del lugar.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section aria-label={`Imagenes del servicio ${service.title}`}>
            <ServiceGallery
              images={service.images}
              title={service.title}
              badge={service.badge}
            />

            <section className="mt-8 space-y-4 rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,247,242,0.95))] p-7 shadow-[0_18px_46px_rgba(31,41,55,0.07)]">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#101828]">
                Descripcion detallada
              </h2>
              <p className="text-[15px] leading-8 text-[#4b5563]">
                {service.description}
              </p>
              <p className="text-[15px] leading-8 text-[#4b5563]">
                Esta pagina de detalle esta pensada para complementar la ficha
                rapida del catalogo, sumando imagenes, informacion mas extensa y
                llamados a la accion claros para coordinar una visita o cerrar el
                servicio.
              </p>
            </section>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(247,246,241,0.95))] p-6 shadow-[0_22px_56px_rgba(31,41,55,0.08)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-[#101828] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  {service.badge}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f0e9] text-2xl" aria-hidden="true">
                  {service.icon}
                </span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                {service.category}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#101828]">
                {service.title}
              </h2>

              <div className="mt-4">
                <div className="h-px w-full bg-[#dde6de]" />
                <p className="mt-4 text-[14px] leading-7 text-[#4b5563]">{service.summary}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#1f5d38] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(31,93,56,0.2)] transition hover:bg-[#18492c]"
                >
                  Agendar visita por WhatsApp
                </Link>
                <Link
                  href={whatsappHref}
                  className="inline-flex items-center justify-center rounded-full border border-[#1f5d38]/20 bg-white/80 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38]"
                >
                  Pedir presupuesto detallado
                </Link>
              </div>

              <ul className="mt-6 space-y-2 text-[13px] leading-6 text-[#4b5563]">
                <li>• Ideal para clientes que quieren entender el alcance del servicio.</li>
                <li>• Permite compartir el enlace directo por WhatsApp o redes.</li>
                <li>• Facil de actualizar cuando cambien precios o condiciones.</li>
              </ul>
            </section>

            <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(251,248,241,0.95))] p-6 shadow-[0_18px_46px_rgba(31,41,55,0.06)]">
              <h2 className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#8a5a24]">
                Metodos de pago sugeridos
              </h2>
              <p className="mt-3 text-[14px] leading-7 text-[#4b5563]">
                Esta seccion queda lista para detallar medios de pago y
                condiciones una vez que el cliente los defina.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] leading-6 text-[#4b5563]">
                <li>• Efectivo o transferencia bancaria.</li>
                <li>• Señal para reservar visita o fecha de obra.</li>
                <li>• Posibilidad de cuotas segun el tipo de trabajo.</li>
              </ul>
            </section>

            <section className="rounded-[30px] bg-[linear-gradient(135deg,#133d28_0%,#1f5d38_55%,#356f45_100%)] p-6 text-white shadow-[0_22px_56px_rgba(15,95,47,0.28)]">
              <h2 className="text-[14px] font-semibold uppercase tracking-[0.16em]">
                Otros servicios relacionados
              </h2>
              <p className="mt-3 text-[14px] leading-7 text-white/80">
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
                      className="rounded-full border border-white/30 bg-white/6 px-3 py-2 text-[11px] font-semibold backdrop-blur"
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

