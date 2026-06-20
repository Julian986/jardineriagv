"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  clearBackNavigationPending,
  clearSuppressScrollToTopIfLeaving,
  getCurrentScrollY,
  HOME_PATH,
  instantScrollTo,
  isBackNavigationPending,
  markSuppressScrollToTop,
  readSavedScroll,
  restoreHomeScroll,
  restoreScrollForPath,
  saveHomeScroll,
  saveScroll,
  shouldSuppressScrollToTop,
} from "@/lib/navigation-scroll";

function scrollToHashIfPresent() {
  const hash = window.location.hash;
  if (!hash) return false;
  const target = document.querySelector(hash);
  if (!(target instanceof HTMLElement)) return false;
  target.scrollIntoView({ behavior: "auto", block: "start" });
  return true;
}

function isInternalNavigationAnchor(anchor: HTMLAnchorElement, pathname: string) {
  if (anchor.target === "_blank") return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  if (url.pathname === pathname && url.hash) return false;

  return true;
}

function persistScrollForInternalAnchor(
  event: MouseEvent | PointerEvent,
  pathname: string,
) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return;
  if (!isInternalNavigationAnchor(anchor, pathname)) return;

  const y = getCurrentScrollY();
  saveScroll(pathname, y);
  if (pathname === HOME_PATH) {
    saveHomeScroll(y);
  }
}

/**
 * Navegación adelante: arriba al instante (sin animación).
 * Atrás (Volver / historial): restaura la posición guardada.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const isHistoryTraversal = useRef(false);
  const restoreHomeAfterPaint = useRef(false);

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

  useEffect(() => {
    const onPointerDownCapture = (event: PointerEvent) => {
      persistScrollForInternalAnchor(event, pathname);
    };
    const onClickCapture = (event: MouseEvent) => {
      persistScrollForInternalAnchor(event, pathname);
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    document.addEventListener("click", onClickCapture, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = getCurrentScrollY();
        saveScroll(pathname, y);
        if (pathname === HOME_PATH) {
          saveHomeScroll(y);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useLayoutEffect(() => {
    const prev = previousPathname.current;
    clearSuppressScrollToTopIfLeaving(pathname);

    const isBack = isHistoryTraversal.current || isBackNavigationPending();

    if (isBack) {
      isHistoryTraversal.current = false;
      clearBackNavigationPending();
      markSuppressScrollToTop(pathname);
      restoreScrollForPath(pathname);
      if (pathname === HOME_PATH) {
        restoreHomeAfterPaint.current = true;
      }
      previousPathname.current = pathname;
      return;
    }

    if (shouldSuppressScrollToTop(pathname)) {
      previousPathname.current = pathname;
      return;
    }

    if (prev != null && prev !== pathname) {
      const saved = readSavedScroll(prev);
      if (saved == null) {
        saveScroll(prev, getCurrentScrollY());
      }
    }

    if (!scrollToHashIfPresent()) {
      instantScrollTo(0);
    } else {
      requestAnimationFrame(() => scrollToHashIfPresent());
    }
    previousPathname.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!restoreHomeAfterPaint.current || pathname !== HOME_PATH) return;

    restoreHomeAfterPaint.current = false;
    restoreHomeScroll();
  }, [pathname]);

  return null;
}
