import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getAppBaseUrl } from "@/lib/mercadopago/config";
import { mpCreatePreference } from "@/lib/mercadopago/api";
import { COL_TIENDA_PEDIDOS } from "@/lib/tienda/pedido";
import { RUTA_TIENDA_GRACIAS } from "@/lib/tienda-routes";

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
  const pedido = await db.collection(COL_TIENDA_PEDIDOS).findOne({ _id: oid });

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

  const itemsRaw = Array.isArray(pedido.items) ? pedido.items : [];
  const mpItems = itemsRaw
    .map((item) => {
      const title = typeof item?.nombre === "string" ? item.nombre : "Producto";
      const quantity = typeof item?.cantidad === "number" ? item.cantidad : 0;
      const unit_price =
        typeof item?.precioUnitarioArs === "number" ? item.precioUnitarioArs : 0;
      if (quantity <= 0 || unit_price <= 0) return null;
      return {
        title: title.slice(0, 120),
        quantity,
        unit_price,
        currency_id: "ARS",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (mpItems.length === 0) {
    return NextResponse.json({ ok: false, error: "Pedido sin ítems válidos" }, { status: 500 });
  }

  // Sumar cargo MP en un ítem aparte para que el total coincida con montoTotalCobroArs
  const fee = Number(pedido.montoCargoMpArs) || 0;
  if (fee > 0) {
    mpItems.push({
      title: "Cargo por pago con Mercado Pago",
      quantity: 1,
      unit_price: fee,
      currency_id: "ARS",
    });
  }

  const notificationUrl = `${baseUrl}/api/webhooks/mercadopago`;
  const gracias = `${baseUrl}${RUTA_TIENDA_GRACIAS}`;
  const checkoutFail = `${baseUrl}/tienda/checkout`;

  let pref;
  try {
    pref = await mpCreatePreference({
      items: mpItems,
      external_reference: ext,
      notification_url: notificationUrl,
      back_urls: {
        success: `${gracias}?mp=success&pedido_id=${id}`,
        failure: `${checkoutFail}?mp=failure&pedido_id=${id}`,
        pending: `${gracias}?mp=pending&pedido_id=${id}`,
      },
      auto_return: "approved",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error al crear preferencia";
    console.error("[mp-tienda-preference]", msg);
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

  await db.collection(COL_TIENDA_PEDIDOS).updateOne(
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
