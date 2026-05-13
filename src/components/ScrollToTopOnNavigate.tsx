"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Asegura que cada navegación cliente arranque arriba del documento.
 * Evita quedar a mitad de scroll (p. ej. desde el home scrolleado) y el “salto” visual.
 * Desactiva temporalmente scroll-behavior: smooth del html para que no sea una animación larga.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previous;
  }, [pathname]);

  return null;
}
