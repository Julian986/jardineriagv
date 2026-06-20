"use client";

import { useState } from "react";
import { Mail, Menu } from "lucide-react";
import { BrandLogo } from "@/components/redesign/BrandLogo";
import { RedesignNavDrawer } from "@/components/redesign/RedesignNavDrawer";
import { WhatsAppLink } from "@/components/WhatsAppLink";

type RedesignHeaderProps = {
  page: string;
};

export function RedesignHeader({ page }: RedesignHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e8ebe3] bg-[#fafaf7]/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 md:grid-cols-3 md:px-6">
          <BrandLogo className="col-start-1 justify-self-start md:col-start-2 md:justify-self-center" />

          <div className="col-start-2 flex items-center justify-self-end gap-2 md:col-start-3 md:gap-3">
            <WhatsAppLink
              location="header_contactar"
              page={page}
              className="hidden items-center gap-2 rounded-full bg-[#2d5016] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:inline-flex"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Contactar
            </WhatsAppLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2d5016] transition-colors hover:bg-[#2d5016]/8"
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
