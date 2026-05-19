import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getReservaVisitaMontoArs } from "@/lib/mercadopago/config";
import {
  TurnoCreateSchema,
  buildTurnoCodigo,
  buildTurnoDetalle,
  formatTurnoCreateValidationError,
  type TurnoCreateInput,
} from "@/lib/turnos";
import { buildMpExternalReference, getPaymentExpiryDate } from "@/lib/reservas/mercadopago-confirmation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = TurnoCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: formatTurnoCreateValidationError(parsed.error),
        issues: parsed.error.issues.map((i) => ({
          path: i.path.map(String),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const input: TurnoCreateInput = parsed.data;
  const montoArs = getReservaVisitaMontoArs();
  const now = new Date();
  const turnoDetalle = buildTurnoDetalle(input);
  const _id = new ObjectId();
  const mpExternalReference = buildMpExternalReference(_id);
  const paymentExpiresAt = getPaymentExpiryDate();

  const doc = {
    _id,
    nombre: input.nombre,
    celular: input.celular,
    direccion: input.direccion.trim(),
    fechaPreferida: input.fechaPreferida,
    motivo: input.motivo,
    horario: input.horario,
    turnoDetalle,
    turnoCodigo: buildTurnoCodigo(),
    precioReferenciaArs: montoArs,
    montoTotalVisitaArs: montoArs,
    montoReservaAlAgendarArs: montoArs,
    aceptaPagoReserva: true,
    estado: "pending_payment" as const,
    checkoutProvider: "mercadopago_checkout_pro" as const,
    mpExternalReference,
    mpPreferenceId: null as string | null,
    mpLastPaymentId: null as string | null,
    mpPaymentStatus: null as string | null,
    mpPaymentStatusDetail: null as string | null,
    confirmedMpPaymentId: null as string | null,
    mpPaidAt: null as Date | null,
    paymentExpiresAt,
    notaInterna: "",
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  await db.collection("turnos").insertOne(doc);

  return NextResponse.json({
    ok: true,
    id: _id.toString(),
    externalReference: mpExternalReference,
    paymentExpiresAt: paymentExpiresAt.toISOString(),
  });
}
