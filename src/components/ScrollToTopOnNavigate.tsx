"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SCROLL_STORAGE_PREFIX = "jardineriagv-scroll:";

function scrollStorageKey(pathname: string) {
  return `${SCROLL_STORAGE_PREFIX}${pathname}`;
}

function instantScrollTo(y: number) {
  const html = document.documentElement;
  const body = document.body;
  const prevHtml = html.style.scrollBehavior;
  const prevBody = body.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  html.scrollTop = y;
  body.scrollTop = y;
  html.style.scrollBehavior = prevHtml;
  body.style.scrollBehavior = prevBody;
}

function readSavedScroll(pathname: string): number | null {
  try {
    const raw = sessionStorage.getItem(scrollStorageKey(pathname));
    if (raw == null) return null;
    const y = Number.parseInt(raw, 10);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

function saveScroll(pathname: string, y: number) {
  try {
    sessionStorage.setItem(scrollStorageKey(pathname), String(Math.round(y)));
  } catch {
    /* ignore quota / private mode */
  }
}

function scrollToHashIfPresent() {
  const hash = window.location.hash;
  if (!hash) return false;
  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return false;
  target.scrollIntoView({ behavior: "auto", block: "start" });
  return true;
}

/**
 * Navegación adelante: arriba al instante (sin animación).
 * Atrás/adelante del historial: restaura la posición guardada.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const isHistoryTraversal = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const onPopState = () => {
      isHistoryTraversal.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useLayoutEffect(() => {
    const prev = previousPathname.current;

    if (isHistoryTraversal.current) {
      isHistoryTraversal.current = false;
      const saved = readSavedScroll(pathname);
      if (saved != null) {
        instantScrollTo(saved);
        requestAnimationFrame(() => instantScrollTo(saved));
      }
      previousPathname.current = pathname;
      return;
    }

    if (prev != null && prev !== pathname) {
      saveScroll(prev, window.scrollY);
    }

    if (!scrollToHashIfPresent()) {
      instantScrollTo(0);
    } else {
      requestAnimationFrame(() => scrollToHashIfPresent());
    }
    previousPathname.current = pathname;
  }, [pathname]);

  return null;
}
