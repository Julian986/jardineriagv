"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sprout, TreePine, Users, X } from "lucide-react";
import { BrandLogo } from "@/components/redesign/BrandLogo";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { REDesign_NAV_LINKS } from "@/lib/redesign/navigation";

const DRAWER_TRANSITION_MS = 280;

const NAV_ICONS = {
  sprout: Sprout,
  tree: TreePine,
  users: Users,
} as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 0 0 .919.919l4.458-1.495A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.368l-.357-.212-2.642.884.884-2.642-.212-.357A9.818 9.818 0 1 1 12 21.818z" />
    </svg>
  );
}

type RedesignNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  page: string;
};

export function RedesignNavDrawer({ open, onClose, page }: RedesignNavDrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), DRAWER_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Cerrar menú"
        onClick={onClose}
      />

      <aside
        className={`relative flex h-full w-[min(88vw,360px)] flex-col bg-[#2d5016] px-7 py-7 text-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Menú de navegación"
        aria-hidden={!visible}
      >
        <div className="-mx-7 border-b border-white/20 px-7 pb-8">
          <div className="flex items-start justify-between gap-4">
            <BrandLogo
              variant="onDark"
              size="sm"
              href="/"
              onClick={onClose}
              className="min-w-0 flex-1"
            />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#3f5f34] text-white transition-colors hover:bg-[#4a6b3e]"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-8 pt-8" aria-label="Menú principal">
          {REDesign_NAV_LINKS.map((item) => {
            const Icon = item.icon === "whatsapp" ? null : NAV_ICONS[item.icon];
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-4 text-[1.05rem] font-semibold leading-none text-white transition-opacity hover:opacity-85"
              >
                {item.icon === "whatsapp" ? (
                  <WhatsAppIcon className="h-[22px] w-[22px] shrink-0 text-[#c4933f] transition-transform group-hover:scale-105" />
                ) : (
                  Icon && (
                    <Icon
                      className="h-[22px] w-[22px] shrink-0 text-[#c4933f] transition-transform group-hover:scale-105"
                      strokeWidth={2}
                      aria-hidden
                    />
                  )
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <WhatsAppLink
            location="nav_drawer"
            page={page}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#c4933f] px-6 py-4 text-[15px] font-bold text-white shadow-md transition-opacity hover:opacity-90"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            Consultar por WhatsApp
          </WhatsAppLink>
        </div>
      </aside>
    </div>
  );
}
