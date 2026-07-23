import { NextResponse } from "next/server";
import { requirePanelSession } from "@/lib/tienda/panel-session";
import { getTiendaStats } from "@/lib/tienda/stats";

export async function GET(request: Request) {
  const auth = await requirePanelSession();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const yearRaw = Number(searchParams.get("year") ?? now.getFullYear());
  const monthRaw = searchParams.get("month");

  const year =
    Number.isFinite(yearRaw) && yearRaw >= 2020 && yearRaw <= 2100
      ? Math.floor(yearRaw)
      : now.getFullYear();

  let month: number | null = null;
  if (monthRaw != null && monthRaw !== "" && monthRaw !== "all") {
    const m = Number(monthRaw);
    if (Number.isFinite(m) && m >= 1 && m <= 12) month = Math.floor(m);
  }

  try {
    const stats = await getTiendaStats({ year, month });
    return NextResponse.json({ ok: true, stats });
  } catch (error) {
    console.error("[tienda/stats GET]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar las estadísticas" },
      { status: 500 },
    );
  }
}
