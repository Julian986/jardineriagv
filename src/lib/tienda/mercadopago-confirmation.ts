import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { mpGetPayment } from "@/lib/mercadopago/api";
import type { MpPaymentResource } from "@/lib/mercadopago/types";
import { COL_TIENDA_PEDIDOS } from "@/lib/tienda/pedido";
import { COL_PRODUCTOS } from "@/lib/tienda/productos";

export type TiendaPaymentConfirmationOutcome =
  | "confirmed"
  | "already_confirmed"
  | "not_approved"
  | "missing_external_reference"
  | "pedido_not_found"
  | "wrong_state"
  | "fetch_error";

export function buildTiendaMpExternalReference(pedidoId: ObjectId): string {
  return `jgv_tienda_${pedidoId.toHexString()}`;
}

export async function processApprovedPaymentForTiendaPedido(
  paymentId: string,
  auditPayload: { transport: string; rawSnippet: string },
): Promise<{ outcome: TiendaPaymentConfirmationOutcome; message?: string }> {
  const db = await getDb();
  const pedidos = db.collection(COL_TIENDA_PEDIDOS);
  const payments = db.collection("mp_payments");
  const audit = db.collection("mp_webhook_events");

  let payment: MpPaymentResource;
  try {
    payment = await mpGetPayment(paymentId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await audit.insertOne({
      createdAt: new Date(),
      paymentId,
      transport: auditPayload.transport,
      rawSnippet: auditPayload.rawSnippet.slice(0, 16_000),
      outcome: "fetch_error",
      domain: "tienda",
      detail: msg,
    });
    return { outcome: "fetch_error", message: msg };
  }

  const mpId = payment.id != null ? String(payment.id) : paymentId;
  const status = (payment.status ?? "").toLowerCase();

  await payments.updateOne(
    { mpPaymentId: mpId },
    {
      $set: {
        mpPaymentId: mpId,
        status: payment.status ?? null,
        statusDetail: payment.status_detail ?? null,
        externalReference: payment.external_reference ?? null,
        transactionAmount: payment.transaction_amount ?? null,
        currencyId: payment.currency_id ?? null,
        dateApproved: payment.date_approved ?? null,
        snapshot: payment as object,
        updatedAt: new Date(),
        domain: "tienda",
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  if (status !== "approved") {
    await audit.insertOne({
      createdAt: new Date(),
      paymentId: mpId,
      transport: auditPayload.transport,
      rawSnippet: auditPayload.rawSnippet.slice(0, 16_000),
      outcome: "not_approved",
      domain: "tienda",
      mpStatus: payment.status ?? null,
    });
    return { outcome: "not_approved", message: payment.status ?? undefined };
  }

  const ext = payment.external_reference?.trim();
  if (!ext || !ext.startsWith("jgv_tienda_")) {
    await audit.insertOne({
      createdAt: new Date(),
      paymentId: mpId,
      transport: auditPayload.transport,
      rawSnippet: auditPayload.rawSnippet.slice(0, 16_000),
      outcome: "missing_external_reference",
      domain: "tienda",
    });
    return { outcome: "missing_external_reference" };
  }

  const pedido = await pedidos.findOne({ mpExternalReference: ext });
  if (!pedido) {
    await audit.insertOne({
      createdAt: new Date(),
      paymentId: mpId,
      transport: auditPayload.transport,
      rawSnippet: auditPayload.rawSnippet.slice(0, 16_000),
      outcome: "pedido_not_found",
      domain: "tienda",
      externalReference: ext,
    });
    return { outcome: "pedido_not_found" };
  }

  const pedidoId = pedido._id as ObjectId;

  if (pedido.estado === "confirmed" || pedido.estado === "paid") {
    const existing =
      pedido.confirmedMpPaymentId != null ? String(pedido.confirmedMpPaymentId) : "";
    if (existing === mpId) return { outcome: "already_confirmed" };
    return { outcome: "wrong_state", message: "confirmed_with_different_payment" };
  }

  if (pedido.estado !== "pending_payment") {
    return { outcome: "wrong_state", message: String(pedido.estado) };
  }

  const now = new Date();
  const updated = await pedidos.findOneAndUpdate(
    {
      _id: pedidoId,
      estado: "pending_payment",
      mpExternalReference: ext,
    },
    {
      $set: {
        estado: "confirmed",
        mpLastPaymentId: mpId,
        mpPaymentStatus: payment.status ?? "approved",
        mpPaymentStatusDetail: payment.status_detail ?? null,
        confirmedMpPaymentId: mpId,
        mpPaidAt: now,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );

  if (!updated) {
    const again = await pedidos.findOne({ _id: pedidoId });
    if (
      again &&
      (again.estado === "confirmed" || again.estado === "paid") &&
      again.confirmedMpPaymentId != null &&
      String(again.confirmedMpPaymentId) === mpId
    ) {
      return { outcome: "already_confirmed" };
    }
    return { outcome: "wrong_state", message: "race_or_state_changed" };
  }

  // Descontar stock si el producto lo controla
  const items = Array.isArray(updated.items) ? updated.items : [];
  for (const item of items) {
    const productoId = typeof item?.productoId === "string" ? item.productoId : "";
    const cantidad = typeof item?.cantidad === "number" ? item.cantidad : 0;
    if (!ObjectId.isValid(productoId) || cantidad <= 0) continue;
    await db.collection(COL_PRODUCTOS).updateOne(
      {
        _id: new ObjectId(productoId),
        stock: { $type: "number", $gte: cantidad },
      },
      {
        $inc: { stock: -cantidad },
        $set: { updatedAt: now },
      },
    );
  }

  await audit.insertOne({
    createdAt: new Date(),
    paymentId: mpId,
    transport: auditPayload.transport,
    rawSnippet: auditPayload.rawSnippet.slice(0, 16_000),
    outcome: "confirmed",
    domain: "tienda",
    pedidoId,
  });

  return { outcome: "confirmed" };
}
