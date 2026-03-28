export const PANEL_SESSION_COOKIE = "panel_turnos_session";

export function getPanelPassword(): string {
  const value = process.env.PANEL_TURNOS_PASSWORD;
  if (!value) {
    throw new Error("Falta variable de entorno PANEL_TURNOS_PASSWORD");
  }
  return value;
}

export function getPanelSessionToken(): string {
  const value = process.env.PANEL_TURNOS_SESSION_TOKEN;
  if (!value) {
    throw new Error("Falta variable de entorno PANEL_TURNOS_SESSION_TOKEN");
  }
  return value;
}

export function isPanelSessionValid(cookieValue?: string): boolean {
  if (!cookieValue) return false;
  try {
    return cookieValue === getPanelSessionToken();
  } catch {
    return false;
  }
}

export function panelSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}

