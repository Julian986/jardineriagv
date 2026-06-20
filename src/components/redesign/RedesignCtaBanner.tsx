import Link from "next/link";
import { PenLine } from "lucide-react";

export function RedesignCtaBanner() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-[#2d4a22] px-6 py-10 text-center text-white md:px-10 md:py-12"
      aria-labelledby="redesign-cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #4a6b38 0%, transparent 45%), radial-gradient(circle at 80% 70%, #3d5a2e 0%, transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#c4933f]">
          <PenLine className="h-5 w-5 text-white" aria-hidden />
        </span>
        <h2 id="redesign-cta-heading" className="font-display mt-5 text-2xl font-bold md:text-3xl">
          ¿Tenés un proyecto?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/85 md:text-base">
          Diseñamos soluciones ecológicas a medida para tu espacio. Consultá sin compromiso.
        </p>
        <Link
          href="/reservar"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#c4933f] px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Empecemos a diseñar tu espacio
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
