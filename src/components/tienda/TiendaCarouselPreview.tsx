"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { TiendaHeroCarousel } from "@/components/tienda/TiendaHeroCarousel";

const STORAGE_KEY = "jardineriagv-tienda-carousel-visible";

type CarouselPreviewContextValue = {
  visible: boolean;
  ready: boolean;
  toggle: () => void;
};

const CarouselPreviewContext = createContext<CarouselPreviewContextValue | null>(null);

function useCarouselPreview() {
  const ctx = useContext(CarouselPreviewContext);
  if (!ctx) {
    throw new Error("useCarouselPreview debe usarse dentro de TiendaCarouselPreviewProvider");
  }
  return ctx;
}

export function TiendaCarouselPreviewProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "0") setVisible(false);
      if (raw === "1") setVisible(true);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ visible, ready, toggle }),
    [visible, ready, toggle],
  );

  return (
    <CarouselPreviewContext.Provider value={value}>{children}</CarouselPreviewContext.Provider>
  );
}

export function TiendaCarouselSlot() {
  const { visible, ready } = useCarouselPreview();
  if (!ready || !visible) return null;

  return (
    <div className="mb-8 md:mb-10">
      <TiendaHeroCarousel />
    </div>
  );
}

export function TiendaCarouselToggle() {
  const { visible, ready, toggle } = useCarouselPreview();

  return (
    <button
      type="button"
      onClick={toggle}
      className={`mb-1 inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e2e2e2] bg-white px-3 py-1.5 text-xs font-medium text-[#555] shadow-sm transition-colors hover:border-[#2d4a22]/35 hover:text-[#2d4a22] ${
        ready ? "" : "invisible"
      }`}
      title={
        visible
          ? "Ocultar carrusel para ver la página sin él"
          : "Mostrar carrusel para comparar"
      }
      aria-pressed={visible}
      aria-label={visible ? "Ocultar carrusel" : "Mostrar carrusel"}
    >
      {visible ? (
        <EyeOff className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <Eye className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span className="hidden sm:inline">
        {visible ? "Ocultar carrusel" : "Mostrar carrusel"}
      </span>
    </button>
  );
}
