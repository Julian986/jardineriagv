"use client";

import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/redesign/BrandLogo";
import { useNavMenu } from "@/components/redesign/NavMenuContext";
import { RedesignNavDrawer } from "@/components/redesign/RedesignNavDrawer";
import { WhatsAppLink } from "@/components/WhatsAppLink";

type RedesignHeaderProps = {
  page: string;
};

export function RedesignHeader({ page }: RedesignHeaderProps) {
  const { open, setOpen } = useNavMenu();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e8ebe3] bg-[#fafaf7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <BrandLogo />

          <div className="flex items-center gap-2 md:gap-3">
            <WhatsAppLink
              location="header_contactar"
              page={page}
              className="hidden items-center gap-2 rounded-full bg-[#2d5016] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:inline-flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 0 0 .919.919l4.458-1.495A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.357-.212-2.642.884.884-2.642-.212-.357A9.818 9.818 0 1 1 12 21.818z" />
              </svg>
              Contactar
            </WhatsAppLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#2d5016] transition-colors hover:bg-[#2d5016]/8"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <RedesignNavDrawer open={open} onClose={() => setOpen(false)} page={page} />
    </>
  );
}
