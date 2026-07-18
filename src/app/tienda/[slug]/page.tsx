import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TiendaProductBuyBox } from "@/components/tienda/TiendaProductBuyBox";
import { TiendaProductCard } from "@/components/tienda/TiendaProductCard";
import { TiendaProductGallery } from "@/components/tienda/TiendaProductGallery";
import { TiendaShell } from "@/components/tienda/TiendaShell";
import {
  getTiendaCategoriaBySlug,
  getTiendaProductoBySlug,
  getTiendaProductosRelacionados,
  TIENDA_PRODUCTOS_DEMO,
} from "@/lib/tienda-demo";
import { RUTA_TIENDA } from "@/lib/tienda-routes";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TIENDA_PRODUCTOS_DEMO.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const producto = getTiendaProductoBySlug(slug);
  if (!producto) {
    return { title: "Producto | Tienda Jardinería GV" };
  }
  return {
    title: `${producto.nombre} | Tienda Jardinería GV`,
    description: producto.descripcion[0] ?? producto.nombre,
  };
}

export default async function TiendaProductoPage({ params }: PageProps) {
  const { slug } = await params;
  const producto = getTiendaProductoBySlug(slug);
  if (!producto) notFound();

  const categoria = getTiendaCategoriaBySlug(producto.categoriaSlug);
  const relacionados = getTiendaProductosRelacionados(producto);
  const imagenes =
    producto.imagenes?.length > 0 ? producto.imagenes : [producto.imagen];

  return (
    <div className={playfair.variable}>
      <TiendaShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <TiendaProductGallery
              nombre={producto.nombre}
              imagenes={imagenes}
              categoriaLabel={producto.categoriaLabel}
            />

            <div className="lg:pt-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#2d4a22]">
                {categoria?.nombre ?? producto.categoriaLabel}
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold leading-snug text-[#1a1a1a] sm:text-3xl lg:text-[2rem]">
                {producto.nombre}
              </h1>
              <div className="mt-6">
                <TiendaProductBuyBox producto={producto} />
              </div>
            </div>
          </div>

          <section className="mt-14 border-t border-[#eee] pt-10 sm:mt-16" aria-labelledby="desc-heading">
            <h2
              id="desc-heading"
              className="text-sm font-bold uppercase tracking-[0.12em] text-[#888]"
            >
              Descripción
            </h2>
            {producto.descripcionTitulo ? (
              <h3 className="mt-4 font-display text-xl font-bold text-[#1a1a1a] sm:text-2xl">
                {producto.descripcionTitulo}
              </h3>
            ) : null}

            <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-relaxed text-[#444]">
              {producto.descripcion.map((parrafo) => (
                <p key={parrafo}>{parrafo}</p>
              ))}
            </div>

            {producto.highlights && producto.highlights.length > 0 ? (
              <ul className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-2">
                {producto.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-[#333]"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c4933f]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {producto.medidas && producto.medidas.length > 0 ? (
              <div className="mt-8 max-w-md overflow-hidden rounded-md border border-[#e8e8e8]">
                <p className="bg-[#f7f7f7] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#555]">
                  Detalles
                </p>
                <dl>
                  {producto.medidas.map((m) => (
                    <div
                      key={m.label}
                      className="flex justify-between gap-4 border-t border-[#eee] px-4 py-3 text-sm"
                    >
                      <dt className="text-[#666]">{m.label}</dt>
                      <dd className="font-medium text-[#1a1a1a]">{m.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </section>

          {relacionados.length > 0 ? (
            <section className="mt-14 border-t border-[#eee] pt-10 sm:mt-16" aria-labelledby="rel-heading">
              <div className="flex items-end justify-between gap-4">
                <h2
                  id="rel-heading"
                  className="font-display text-2xl font-bold text-[#1a1a1a]"
                >
                  También te puede interesar
                </h2>
                <Link
                  href={
                    categoria
                      ? `${RUTA_TIENDA}?categoria=${categoria.slug}`
                      : RUTA_TIENDA
                  }
                  className="shrink-0 text-sm font-semibold text-[#2d4a22] hover:underline"
                >
                  Ver más
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {relacionados.map((rel) => (
                  <TiendaProductCard key={rel.id} producto={rel} />
                ))}
              </div>
            </section>
          ) : null}

          <p className="mt-10 text-center text-xs text-[#999]">
            <Link href={RUTA_TIENDA} className="font-medium text-[#2d4a22] hover:underline">
              ← Volver al catálogo
            </Link>
          </p>
        </div>
      </TiendaShell>
    </div>
  );
}
