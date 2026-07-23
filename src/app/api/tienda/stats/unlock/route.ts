import { NextResponse } from "next/server";
import {
  getTiendaStatsUnlockToken,
  isTiendaStatsUnlocked,
  requirePanelSession,
  TIENDA_STATS_UNLOCK_COOKIE,
  tiendaStatsUnlockCookieOptions,
} from "@/lib/tienda/panel-session";

function getStatsUnlockPassword(): string | null {
  const value = process.env.PANEL_TIENDA_STATS_PASSWORD?.trim();
  return value && value.length > 0 ? value : null;
}

export async function GET() {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  const unlocked = await isTiendaStatsUnlocked();
  return NextResponse.json({ ok: true, unlocked });
}

export async function POST(request: Request) {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const password =
    typeof payload === "object" &&
    payload !== null &&
    "password" in payload &&
    typeof (payload as { password: unknown }).password === "string"
      ? (payload as { password: string }).password
      : "";

  const expected = getStatsUnlockPassword();
  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        code: "not_in_plan",
        error:
          "Esta función no está incluida en tu plan actual. Escribinos para activar Estadísticas Premium.",
      },
      { status: 403 },
    );
  }

  if (password !== expected) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_password",
        error: "Contraseña incorrecta.",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true, unlocked: true });
  response.cookies.set(
    TIENDA_STATS_UNLOCK_COOKIE,
    getTiendaStatsUnlockToken(),
    tiendaStatsUnlockCookieOptions(),
  );
  return response;
}
