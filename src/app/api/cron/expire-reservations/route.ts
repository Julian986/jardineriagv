import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCronSecret } from "@/lib/mercadopago/config";

/**
 * Marca como expiradas las reservas con pago pendiente vencido.
 * Proteger con CRON_SECRET (Authorization: Bearer …).
 */
export async function GET(request: Request) {
  const secret = getCronSecret();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET no configurado" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization")?.trim();
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const db = await getDb();
  const result = await db.collection("turnos").updateMany(
    {
      estado: "pending_payment",
      paymentExpiresAt: { $lte: now },
    },
    {
      $set: {
        estado: "expired",
        updatedAt: now,
      },
    },
  );

  return NextResponse.json({
    ok: true,
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount,
  });
}
