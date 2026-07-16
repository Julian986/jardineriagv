import Image from "next/image";
import Link from "next/link";
import {
  TEREKUA_CTA_LABEL,
  TEREKUA_LOGO_PATH,
  TEREKUA_MVP_DESCRIPCION,
  TEREKUA_MVP_NOTA,
  TEREKUA_MVP_PREVIEW_NOTA,
  TEREKUA_MVP_TITULO,
  isTerekuaPartnerConfigured,
} from "@/lib/terekua";
import { TIENDA_CTA_LABEL, RUTA_TIENDA } from "@/lib/tienda-routes";
import { TerekuaLink } from "@/components/TerekuaLink";

type TerekuaMvpBlockProps = {
  location: "home_mvp" | "madera_mvp";
  page: "home" | "madera";
  className?: string;
};

export function TerekuaMvpBlock({ location, page, className = "" }: TerekuaMvpBlockProps) {
  const configured = isTerekuaPartnerConfigured();

  return (
    <aside
      className={`overflow-hidden rounded-2xl border border-[#e4ead8] bg-white shadow-sm ${className}`}
      aria-labelledby={`terekua-${location}-heading`}
    >
      <div className="border-b border-[#e4ead8] bg-[#f0f5ea] px-6 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5016]/70">
          Aliado comercial
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative mx-auto h-32 w-full max-w-[280px] shrink-0 sm:mx-0 sm:h-36 sm:w-60">
            <Image
              src={TEREKUA_LOGO_PATH}
              alt="Terekua"
              fill
              className="object-contain object-center sm:object-left"
              sizes="(max-width: 640px) 280px, 240px"
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            {/* {!configured ? (
              <span className="inline-block rounded-full border border-[#c4933f]/40 bg-[#fff8eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8a5a12]">
                Vista previa
              </span>
            ) : null} */}
            <h2
              id={`terekua-${location}-heading`}
              className="text-xl font-bold text-[#2d5016]"
            >
              {TEREKUA_MVP_TITULO}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{TEREKUA_MVP_DESCRIPCION}</p>
            <p className="mt-3 text-sm text-[#666]">
              Encontrá insumos, herramientas y productos para jardín y hogar en{" "}
              <span className="font-semibold text-[#2d5016]">terekua.com.ar</span>.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={RUTA_TIENDA}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2d5016] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {TIENDA_CTA_LABEL}
              </Link>
              <TerekuaLink
                location={location}
                page={page}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#2d5016] bg-[#f0f5ea] px-6 py-3 text-sm font-semibold text-[#2d5016] transition-colors hover:bg-[#e4ead8]/60"
              >
                {TEREKUA_CTA_LABEL}
                <span aria-hidden className="text-base leading-none">
                  ↗
                </span>
              </TerekuaLink>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-[#888]">
              {configured ? TEREKUA_MVP_NOTA : TEREKUA_MVP_PREVIEW_NOTA}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
