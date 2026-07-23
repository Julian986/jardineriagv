import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";

export const TIENDA_STATS_UNLOCK_COOKIE = "panel_tienda_stats_unlock";

export async function requirePanelSession(): Promise<
  { ok: true } | { ok: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const session = cookieStore.get(PANEL_SESSION_COOKIE)?.value;
  if (!isPanelSessionValid(session)) {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 }),
    };
  }
  return { ok: true };
}

export function getTiendaStatsUnlockToken(): string {
  const dedicated = process.env.PANEL_TIENDA_STATS_UNLOCK_TOKEN?.trim();
  if (dedicated) return dedicated;
  const password = process.env.PANEL_TIENDA_STATS_PASSWORD?.trim();
  if (password) return `stats_unlock_${password.length}_${password.slice(0, 8)}`;
  return "stats_locked";
}

export function tiendaStatsUnlockCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export async function isTiendaStatsUnlocked(): Promise<boolean> {
  const expectedPassword = process.env.PANEL_TIENDA_STATS_PASSWORD?.trim();
  if (!expectedPassword) return false;
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get(TIENDA_STATS_UNLOCK_COOKIE)?.value;
    return value === getTiendaStatsUnlockToken();
  } catch {
    return false;
  }
}
