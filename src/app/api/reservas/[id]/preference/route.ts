import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getAppBaseUrl } from "@/lib/mercadopago/config";
import { mpCreatePreference } from "@/lib/mercadopago/api";
import { getReservaVisitaMontoArs } from "@/lib/mercadopago/config";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  let baseUrl: string;
  try {
    baseUrl = getAppBaseUrl();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Config incompleta";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  const db = await getDb();
  const oid = new ObjectId(id);
  const turno = await db.collection("turnos").findOne({ _id: oid });

  if (!turno) {
    return NextResponse.json({ ok: false, error: "Reserva no encontrada" }, { status: 404 });
  }

  if (turno.estado !== "pending_payment") {
    return NextResponse.json(
      { ok: false, error: "La reserva no está esperando pago" },
      { status: 409 },
    );
  }

  const expiresAt = turno.paymentExpiresAt ? new Date(turno.paymentExpiresAt) : null;
  if (expiresAt && expiresAt < new Date()) {
    return NextResponse.json(
      { ok: false, error: "La reserva expiró. Creá una nueva reserva." },
      { status: 409 },
    );
  }

  const ext = typeof turno.mpExternalReference === "string" ? turno.mpExternalReference : "";
  if (!ext) {
    return NextResponse.json({ ok: false, error: "Reserva sin referencia de pago" }, { status: 500 });
  }

  const monto = Number(turno.montoTotalVisitaArs ?? getReservaVisitaMontoArs());
  const title = "Visita y asesoramiento — Jardinería GV";
  const description =
    typeof turno.turnoDetalle === "string" && turno.turnoDetalle.trim().length > 0
      ? turno.turnoDetalle.trim().slice(0, 240)
      : `Reserva ${turno.turnoCodigo ?? id}`;

  const notificationUrl = `${baseUrl}/api/webhooks/mercadopago`;
  const back = `${baseUrl}/reservar`;

  let pref: { id?: string; init_point?: string; sandbox_init_point?: string };
  try {
    pref = await mpCreatePreference({
      items: [
        {
          title,
          description,
          quantity: 1,
          unit_price: monto,
          currency_id: "ARS",
        },
      ],
      external_reference: ext,
      notification_url: notificationUrl,
      back_urls: {
        success: `${back}?mp=success`,
        failure: `${back}?mp=failure`,
        pending: `${back}?mp=pending`,
      },
      auto_return: "approved",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al crear preferencia";
    console.error("[mp-preference]", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }

  const preferenceId = pref.id;
  const initPoint = pref.init_point ?? pref.sandbox_init_point;
  if (!preferenceId || !initPoint) {
    return NextResponse.json(
      { ok: false, error: "Mercado Pago no devolvió init_point" },
      { status: 502 },
    );
  }

  await db.collection("turnos").updateOne(
    { _id: oid, estado: "pending_payment" },
    {
      $set: {
        mpPreferenceId: preferenceId,
        mpPreferenceCreatedAt: new Date(),
        updatedAt: new Date(),
      },
    },
  );

  return NextResponse.json({
    ok: true,
    preferenceId,
    initPoint,
  });
}
