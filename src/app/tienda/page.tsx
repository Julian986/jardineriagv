import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { TiendaCategoryPills, TiendaSidebar } from "@/components/tienda/TiendaSidebar";
import { TiendaCatalogTitle } from "@/components/tienda/TiendaCatalogTitle";
import {
  TiendaCarouselPreviewProvider,
  TiendaCarouselSlot,
  TiendaCarouselToggle,
} from "@/components/tienda/TiendaCarouselPreview";
import { TiendaProductCard } from "@/components/tienda/TiendaProductCard";
import { TiendaShell } from "@/components/tienda/TiendaShell";
import { getCategoriaBySlug, listCategorias } from "@/lib/tienda/categorias";
import { listProductos } from "@/lib/tienda/productos";
import { seedTiendaIfEmpty } from "@/lib/tienda/seed";
import { RUTA_TIENDA } from "@/lib/tienda-routes";

export const dynamic = "force-dynamic";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Productos | Tienda Jardinería GV",
  description: "Catálogo de productos para jardín y hogar. Jardinería GV, Bahía Blanca.",
};

type TiendaPageProps = {
  searchParams: Promise<{ categoria?: string }>;
};

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const { categoria } = await searchParams;

  let productos: Awaited<ReturnType<typeof listProductos>> = [];
  let categorias: Awaited<ReturnType<typeof listCategorias>> = [];
  let categoriaActiva: Awaited<ReturnType<typeof getCategoriaBySlug>> = null;
  let loadError = false;

  try {
    await seedTiendaIfEmpty();
    categorias = await listCategorias({ soloActivas: true });
    productos = await listProductos({
      soloActivos: true,
      categoriaSlug: categoria,
    });
    categoriaActiva = categoria ? await getCategoriaBySlug(categoria) : null;
    if (categoriaActiva && !categoriaActiva.activa) categoriaActiva = null;
  } catch (error) {
    console.error("[tienda page]", error);
    loadError = true;
  }

  const titulo = categoriaActiva?.nombre ?? "Productos";
  const vistaTodas = !categoria;

  const catalogBody = (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      {vistaTodas ? <TiendaCarouselSlot /> : null}

      <div className="flex gap-10">
        <TiendaSidebar categoriaActiva={categoria} categorias={categorias} />

        <div className="min-w-0 flex-1">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <TiendaCatalogTitle title={titulo} />
            </div>
            {vistaTodas ? <TiendaCarouselToggle /> : null}
          </div>

          <TiendaCategoryPills categoriaActiva={categoria} categorias={categorias} />

          {loadError ? (
            <p className="mt-10 text-center text-[#666]">
              No se pudo cargar el catálogo. Probá de nuevo en unos minutos.
            </p>
          ) : productos.length === 0 ? (
            <p className="mt-10 text-center text-[#666]">
              No hay productos en esta categoría.{" "}
              <Link href={RUTA_TIENDA} className="font-medium text-[#2d4a22] hover:underline">
                Ver todos
              </Link>
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {productos.map((producto) => (
                <TiendaProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={playfair.variable}>
      <TiendaShell>
        {vistaTodas ? (
          <TiendaCarouselPreviewProvider>{catalogBody}</TiendaCarouselPreviewProvider>
        ) : (
          catalogBody
        )}
      </TiendaShell>
    </div>
  );
}
