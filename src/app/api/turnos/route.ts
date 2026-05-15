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

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(PANEL_SESSION_COOKIE)?.value;

  if (!isPanelSessionValid(session)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const db = await getDb();
  const docs = await db
    .collection("turnos")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    ok: true,
    turnos: docs.map((doc) => ({
      id: doc._id.toString(),
      ...doc,
    })),
  });
}

