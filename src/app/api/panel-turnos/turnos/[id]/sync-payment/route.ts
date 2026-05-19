import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { mpSearchPaymentsByExternalReference } from "@/lib/mercadopago/api";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";
import { processApprovedPaymentForTurno } from "@/lib/reservas/mercadopago-confirmation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const session = cookieStore.get(PANEL_SESSION_COOKIE)?.value;
  if (!isPanelSessionValid(session)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  const db = await getDb();
  const turno = await db.collection("turnos").findOne({ _id: new ObjectId(id) });
  if (!turno) {
    return NextResponse.json({ ok: false, error: "Turno no encontrado" }, { status: 404 });
  }

  if (turno.estado === "confirmed") {
    return NextResponse.json({ ok: true, outcome: "already_confirmed" });
  }

  const ext =
    typeof turno.mpExternalReference === "string" ? turno.mpExternalReference.trim() : "";
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Esta reserva no tiene referencia de Mercado Pago" },
      { status: 400 },
    );
  }

  let payments;
  try {
    payments = await mpSearchPaymentsByExternalReference(ext);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al consultar Mercado Pago";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  const approved = payments.filter(
    (p) => (p.status ?? "").toLowerCase() === "approved" && p.id != null,
  );

  if (approved.length === 0) {
    return NextResponse.json({
      ok: false,
      outcome: "not_approved",
      error: "No hay pagos aprobados en Mercado Pago para esta reserva",
    });
  }

  for (const payment of approved) {
    const paymentId = String(payment.id);
    const result = await processApprovedPaymentForTurno(paymentId, {
      transport: "panel_sync",
      rawSnippet: JSON.stringify({ turnoId: id, externalReference: ext }),
    });
    if (
      result.outcome === "confirmed" ||
      result.outcome === "already_confirmed"
    ) {
      return NextResponse.json({ ok: true, outcome: result.outcome, paymentId });
    }
  }

  return NextResponse.json({
    ok: false,
    outcome: "wrong_state",
    error: "No se pudo confirmar el pago. Revisá el estado en Mercado Pago.",
  });
}
