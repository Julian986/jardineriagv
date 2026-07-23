import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";

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
