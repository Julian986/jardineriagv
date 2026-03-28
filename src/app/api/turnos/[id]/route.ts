import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { isPanelSessionValid, PANEL_SESSION_COOKIE } from "@/lib/panel-auth";
import { TurnoPatchSchema } from "@/lib/turnos";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const session = cookieStore.get(PANEL_SESSION_COOKIE)?.value;
  if (!isPanelSessionValid(session)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const parsed = TurnoPatchSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const db = await getDb();
  const update: Record<string, unknown> = {
    ...parsed.data,
    updatedAt: new Date(),
  };

  const result = await db.collection("turnos").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" },
  );

  if (!result) {
    return NextResponse.json(
      { ok: false, error: "Turno no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    turno: { id: result._id.toString(), ...result },
  });
}

