import { NextResponse } from "next/server";
import {
  getPanelPassword,
  getPanelSessionToken,
  panelSessionCookieOptions,
  PANEL_SESSION_COOKIE,
} from "@/lib/panel-auth";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const password =
    typeof payload === "object" && payload !== null && "password" in payload
      ? String((payload as { password: unknown }).password ?? "")
      : "";

  if (!password) {
    return NextResponse.json(
      { ok: false, error: "Ingresá una contraseña" },
      { status: 400 },
    );
  }

  if (password !== getPanelPassword()) {
    return NextResponse.json(
      { ok: false, error: "Contraseña incorrecta" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    PANEL_SESSION_COOKIE,
    getPanelSessionToken(),
    panelSessionCookieOptions(),
  );

  return response;
}

