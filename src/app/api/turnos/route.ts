import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";

/**
 * Las reservas públicas pasan por Mercado Pago Checkout Pro:
 * POST /api/reservas/pending y POST /api/reservas/:id/preference
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Este endpoint ya no registra turnos directamente. Usá POST /api/reservas/pending y luego POST /api/reservas/:id/preference para iniciar el pago con Mercado Pago.",
    },
    { status: 410 },
  );
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function monthDateKeyRange(year: number, month: number) {
  const lastDay = new Date(year, month, 0).getDate();
  return {
    start: `${year}-${pad2(month)}-01`,
    end: `${year}-${pad2(month)}-${pad2(lastDay)}`,
  };
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(PANEL_SESSION_COOKIE)?.value;

  if (!isPanelSessionValid(session)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const yearRaw = searchParams.get("year");
  const monthRaw = searchParams.get("month");

  const filter: Record<string, unknown> = {};
  if (yearRaw && monthRaw) {
    const year = Number.parseInt(yearRaw, 10);
    const month = Number.parseInt(monthRaw, 10);
    if (
      Number.isFinite(year) &&
      Number.isFinite(month) &&
      month >= 1 &&
      month <= 12
    ) {
      const { start, end } = monthDateKeyRange(year, month);
      filter.fechaPreferida = { $gte: start, $lte: end };
    }
  }

  const db = await getDb();
  const docs = await db
    .collection("turnos")
    .find(filter)
    .sort({ fechaPreferida: 1, horario: 1, createdAt: -1 })
    .toArray();

  return NextResponse.json({
    ok: true,
    turnos: docs.map((doc) => {
      const { _id, ...rest } = doc;
      return {
        id: _id.toString(),
        ...rest,
      };
    }),
  });
}

