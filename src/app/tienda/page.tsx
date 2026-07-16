import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { TiendaCategoryPills, TiendaSidebar } from "@/components/tienda/TiendaSidebar";
import { TiendaProductCard } from "@/components/tienda/TiendaProductCard";
import { TiendaShell } from "@/components/tienda/TiendaShell";
import { getTiendaProductosDemo } from "@/lib/tienda-demo";
import { RUTA_TIENDA } from "@/lib/tienda-routes";

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
  const productos = getTiendaProductosDemo(categoria);

  return (
    <div className={playfair.variable}>
      <TiendaShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <nav className="text-xs text-[#888]" aria-label="Migas de pan">
            <Link href="/" className="hover:text-[#2d4a22]">
              Inicio
            </Link>
            <span className="mx-1.5" aria-hidden>
              &gt;
            </span>
            <span className="text-[#444]">Productos</span>
          </nav>

          <div className="mt-6 flex gap-10">
            <TiendaSidebar categoriaActiva={categoria} />

            <div className="min-w-0 flex-1">
              <div className="flex items-end justify-between gap-4">
                <h1 className="font-display text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
                  Productos
                </h1>
              </div>

              <TiendaCategoryPills categoriaActiva={categoria} />

              {productos.length === 0 ? (
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

              <p className="mt-10 text-center text-xs text-[#999]">
                Catálogo en vista previa — los productos se cargarán desde el panel de
                administración.
              </p>
            </div>
          </div>
        </div>
      </TiendaShell>
    </div>
  );
}
