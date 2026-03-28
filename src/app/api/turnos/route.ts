import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";
import {
  TurnoCreateSchema,
  buildTurnoCodigo,
  buildTurnoDetalle,
  type TurnoCreateInput,
} from "@/lib/turnos";

const TURNO_PRECIO_REFERENCIA = 30000;

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
      { ok: false, error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const input: TurnoCreateInput = parsed.data;
  const now = new Date();
  const turnoDetalle = buildTurnoDetalle(input);

  const doc = {
    nombre: input.nombre,
    mail: input.mail,
    celular: input.celular,
    motivo: input.motivo,
    horario: input.horario,
    turnoDetalle,
    turnoCodigo: buildTurnoCodigo(),
    precioReferenciaArs: TURNO_PRECIO_REFERENCIA,
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

