import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";
import {
  RESERVA_VISITA_MONTO_ARS,
  TurnoCreateSchema,
  buildTurnoCodigo,
  buildTurnoDetalle,
  formatTurnoCreateValidationError,
  type TurnoCreateInput,
} from "@/lib/turnos";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
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
  const now = new Date();
  const turnoDetalle = buildTurnoDetalle(input);

  const doc = {
    nombre: input.nombre,
    celular: input.celular,
    direccion: input.direccion.trim(),
    fechaPreferida: input.fechaPreferida,
    motivo: input.motivo,
    horario: input.horario,
    turnoDetalle,
    turnoCodigo: buildTurnoCodigo(),
    precioReferenciaArs: RESERVA_VISITA_MONTO_ARS,
    /** Total visita y asesoramiento (no es seña) */
    montoTotalVisitaArs: RESERVA_VISITA_MONTO_ARS,
    montoReservaAlAgendarArs: RESERVA_VISITA_MONTO_ARS,
    aceptaPagoReserva: true,
    estado: "pendiente" as const,
    notaInterna: "",
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  const result = await db.collection("turnos").insertOne(doc);

  return NextResponse.json({
    ok: true,
    id: result.insertedId.toString(),
  });
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

