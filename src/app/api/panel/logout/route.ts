import { NextResponse } from "next/server";
import { PANEL_SESSION_COOKIE, panelSessionCookieOptions } from "@/lib/panel-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PANEL_SESSION_COOKIE, "", {
    ...panelSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}

