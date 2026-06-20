export const SCROLL_STORAGE_PREFIX = "jardineriagv-scroll:";
export const BACK_NAV_FLAG = "jardineriagv-back-nav";
export const HOME_PATH = "/";
export const HOME_SCROLL_KEY = "jardineriagv-home-scroll-y";

/** Evita scroll-to-top en el 2.º render de Strict Mode tras volver atrás. */
let suppressScrollToTopPath: string | null = null;

export function scrollStorageKey(pathname: string) {
  return `${SCROLL_STORAGE_PREFIX}${pathname}`;
}

export function getCurrentScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function instantScrollTo(y: number) {
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

export function readSavedScroll(pathname: string): number | null {
  try {
    const raw = sessionStorage.getItem(scrollStorageKey(pathname));
    if (raw == null) return null;
    const y = Number.parseInt(raw, 10);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

export function saveScroll(pathname: string, y: number) {
  try {
    sessionStorage.setItem(scrollStorageKey(pathname), String(Math.round(y)));
    if (pathname === HOME_PATH) {
      saveHomeScroll(y);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function saveHomeScroll(y: number) {
  try {
    sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(y)));
  } catch {
    /* ignore */
  }
}

export function readHomeScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(HOME_SCROLL_KEY);
    if (raw == null) return null;
    const y = Number.parseInt(raw, 10);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

export function markBackNavigation() {
  try {
    sessionStorage.setItem(BACK_NAV_FLAG, "1");
  } catch {
    /* ignore */
  }
}

export function isBackNavigationPending() {
  try {
    return sessionStorage.getItem(BACK_NAV_FLAG) === "1";
  } catch {
    return false;
  }
}

export function clearBackNavigationPending() {
  try {
    sessionStorage.removeItem(BACK_NAV_FLAG);
  } catch {
    /* ignore */
  }
}

export function markSuppressScrollToTop(pathname: string) {
  suppressScrollToTopPath = pathname;
}

export function shouldSuppressScrollToTop(pathname: string) {
  return suppressScrollToTopPath === pathname;
}

export function clearSuppressScrollToTopIfLeaving(pathname: string) {
  if (suppressScrollToTopPath != null && suppressScrollToTopPath !== pathname) {
    suppressScrollToTopPath = null;
  }
}

function applyScrollWithRetries(getY: () => number | null) {
  const run = () => {
    const y = getY();
    if (y == null) return;
    instantScrollTo(y);
  };

  run();
  requestAnimationFrame(run);
  requestAnimationFrame(() => {
    run();
    window.setTimeout(run, 0);
    window.setTimeout(run, 50);
    window.setTimeout(run, 150);
    window.setTimeout(run, 300);
    window.setTimeout(run, 500);
  });
}

export function restoreScrollForPath(pathname: string) {
  if (pathname === HOME_PATH) {
    restoreHomeScroll();
    return;
  }

  applyScrollWithRetries(() => readSavedScroll(pathname));
}

export function restoreHomeScroll() {
  applyScrollWithRetries(() => readHomeScroll() ?? readSavedScroll(HOME_PATH));
}
