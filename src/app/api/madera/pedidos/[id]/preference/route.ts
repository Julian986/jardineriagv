import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getAppBaseUrl } from "@/lib/mercadopago/config";
import { mpCreatePreference } from "@/lib/mercadopago/api";
import { MADERA_PRODUCTO_TITULO } from "@/lib/madera-productos";
import { RUTA_MADERA } from "@/lib/madera-contenido";

type RouteContext = { params: Promise<{ id: string }> };

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
  const pedido = await db.collection("pedidos_madera").findOne({ _id: oid });

  if (!pedido) {
    return NextResponse.json({ ok: false, error: "Pedido no encontrado" }, { status: 404 });
  }

  if (pedido.estado !== "pending_payment") {
    return NextResponse.json(
      { ok: false, error: "El pedido no está esperando pago" },
      { status: 409 },
    );
  }

  const expiresAt = pedido.paymentExpiresAt ? new Date(pedido.paymentExpiresAt) : null;
  if (expiresAt && expiresAt < new Date()) {
    return NextResponse.json(
      { ok: false, error: "El pedido expiró. Volvé a armar la compra." },
      { status: 409 },
    );
  }

  const ext = typeof pedido.mpExternalReference === "string" ? pedido.mpExternalReference : "";
  if (!ext) {
    return NextResponse.json({ ok: false, error: "Pedido sin referencia de pago" }, { status: 500 });
  }

  const monto = Number(pedido.montoTotalCobroArs);
  if (!Number.isFinite(monto) || monto <= 0) {
    return NextResponse.json({ ok: false, error: "Monto inválido" }, { status: 500 });
  }

  const metros = Number(pedido.metrosLineales);
  const medidas =
    typeof pedido.productoMedidas === "string" ? pedido.productoMedidas : "a medida";
  const title = `${MADERA_PRODUCTO_TITULO} — ${medidas}`;
  const description =
    typeof pedido.pedidoDetalle === "string" && pedido.pedidoDetalle.trim().length > 0
      ? pedido.pedidoDetalle.trim().slice(0, 240)
      : `${metros} m lineales · ${pedido.pedidoCodigo ?? id}`;

  const notificationUrl = `${baseUrl}/api/webhooks/mercadopago`;
  const back = `${baseUrl}${RUTA_MADERA}`;

  let pref;
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
        success: `${back}?mp=success&pedido_id=${id}`,
        failure: `${back}?mp=failure&pedido_id=${id}`,
        pending: `${back}?mp=pending&pedido_id=${id}`,
      },
      auto_return: "approved",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al crear preferencia";
    console.error("[mp-madera-preference]", msg);
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

  await db.collection("pedidos_madera").updateOne(
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
