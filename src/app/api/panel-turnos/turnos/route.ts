import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";
import {
  RESERVA_VISITA_MONTO_ARS,
  PanelTurnoCreateSchema,
  buildTurnoCodigo,
  buildTurnoDetalle,
  formatTurnoCreateValidationError,
  type PanelTurnoCreateInput,
} from "@/lib/turnos";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get(PANEL_SESSION_COOKIE)?.value;

  if (!isPanelSessionValid(session)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = PanelTurnoCreateSchema.safeParse(payload);
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

  const input: PanelTurnoCreateInput = parsed.data;
  const now = new Date();
  const turnoDetalle = buildTurnoDetalle({
    fechaPreferida: input.fechaPreferida,
    horario: input.horario,
    direccion: "",
  });

  const doc = {
    nombre: input.nombre,
    celular: input.celular.trim(),
    direccion: "",
    fechaPreferida: input.fechaPreferida,
    motivo: "jardin_desde_cero",
    horario: input.horario,
    turnoDetalle,
    turnoCodigo: buildTurnoCodigo(),
    precioReferenciaArs: RESERVA_VISITA_MONTO_ARS,
    montoTotalVisitaArs: RESERVA_VISITA_MONTO_ARS,
    montoReservaAlAgendarArs: RESERVA_VISITA_MONTO_ARS,
    aceptaPagoReserva: false,
    estado: "confirmed",
    origen: "panel" as const,
    checkoutProvider: null,
    mpExternalReference: null,
    mpPreferenceId: null,
    mpLastPaymentId: null,
    mpPaymentStatus: null,
    mpPaymentStatusDetail: null,
    confirmedMpPaymentId: null,
    mpPaidAt: null,
    paymentExpiresAt: null,
    notaInterna: input.notaInterna?.trim() ?? "",
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  const result = await db.collection("turnos").insertOne(doc);

  return NextResponse.json({
    ok: true,
    id: result.insertedId.toString(),
    turnoCodigo: doc.turnoCodigo,
  });
}
