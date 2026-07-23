import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { TiendaCheckoutForm } from "@/components/tienda/TiendaCheckoutForm";
import { TiendaShell } from "@/components/tienda/TiendaShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Checkout | Tienda Jardinería GV",
  description: "Completá tus datos para finalizar la compra en Jardinería GV.",
};

export default function TiendaCheckoutPage() {
  return (
    <div className={playfair.variable}>
      <TiendaShell>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <header className="mb-6 sm:mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c4933f] sm:text-xs">
              Tienda online
            </p>
            <h1 className="mt-1.5 font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-[#2d4a22] sm:text-4xl">
              Checkout
            </h1>
            <span className="mt-3 block h-1 w-12 rounded-full bg-[#c4933f] sm:w-14" aria-hidden />
            <p className="mt-3 max-w-xl text-sm text-[#666]">
              Revisá tu pedido, dejá tus datos y prepará el pago. La entrega la coordinamos después.
            </p>
          </header>

          <TiendaCheckoutForm />
        </div>
      </TiendaShell>
    </div>
  );
}
