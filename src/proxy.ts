import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(PANEL_SESSION_COOKIE)?.value;
  const isAuthenticated = isPanelSessionValid(session);

  if (pathname.startsWith("/panel-turnos/login")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/panel-turnos", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/panel-turnos")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/panel-turnos/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel-turnos/:path*"],
};

