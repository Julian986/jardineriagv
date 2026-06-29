import { PARQUIZACION_INTRO, PARQUIZACION_STATS } from "@/lib/parquizacion-redesign-contenido";

export function ParquizacionIntroStats() {
  const introParts = PARQUIZACION_INTRO.split("diseño de vanguardia");

  return (
    <section className="bg-[#fafaf7] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="mx-auto max-w-3xl text-center text-[16px] leading-relaxed text-[#555] md:text-lg">
          {introParts[0]}
          <strong className="font-semibold text-[#2d4a22]">diseño de vanguardia</strong>
          {introParts[1]}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3 md:mt-10 md:gap-5">
          {PARQUIZACION_STATS.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-[#e8ebe3] bg-white px-3 py-5 text-center shadow-sm md:rounded-3xl md:px-6 md:py-8"
            >
              <p className="font-display text-2xl font-bold text-[#2d4a22] md:text-4xl lg:text-5xl">
                {stat.valor}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[#666] md:mt-2 md:text-sm">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
