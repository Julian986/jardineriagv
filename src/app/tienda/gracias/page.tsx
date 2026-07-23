import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { TiendaGraciasClient } from "@/components/tienda/TiendaGraciasClient";
import { TiendaShell } from "@/components/tienda/TiendaShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gracias | Tienda Jardinería GV",
  robots: { index: false, follow: false },
};

export default function TiendaGraciasPage() {
  return (
    <div className={playfair.variable}>
      <TiendaShell>
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
          <TiendaGraciasClient />
        </div>
      </TiendaShell>
    </div>
  );
}
