import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getMaderaVarianteById } from "@/lib/madera-productos";
import {
  MaderaPedidoCreateSchema,
  buildMaderaAmountsForInput,
  buildMaderaPedidoCodigo,
  buildMaderaPedidoDetalle,
  formatMaderaPedidoValidationError,
  type MaderaPedidoCreateInput,
} from "@/lib/madera/pedido";
import { buildMaderaMpExternalReference } from "@/lib/madera/mercadopago-confirmation";
import { getPaymentExpiryDate } from "@/lib/reservas/mercadopago-confirmation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = MaderaPedidoCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: formatMaderaPedidoValidationError(parsed.error),
        issues: parsed.error.issues.map((i) => ({
          path: i.path.map(String),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const input: MaderaPedidoCreateInput = parsed.data;
  const variante = getMaderaVarianteById(input.productoId);
  if (!variante) {
    return NextResponse.json({ ok: false, error: "Producto inválido" }, { status: 400 });
  }

  const amounts = buildMaderaAmountsForInput(input);
  const now = new Date();
  const _id = new ObjectId();
  const mpExternalReference = buildMaderaMpExternalReference(_id);
  const paymentExpiresAt = getPaymentExpiryDate();

  const doc = {
    _id,
    productoId: input.productoId,
    productoMedidas: variante.medidasLabel,
    metrosLineales: input.metrosLineales,
    nombre: input.nombre,
    celular: input.celular,
    notas: input.notas?.trim() ?? "",
    pedidoCodigo: buildMaderaPedidoCodigo(),
    pedidoDetalle: buildMaderaPedidoDetalle(input),
    precioMetroLinealArs: amounts.precioMetroArs,
    montoNetoArs: amounts.montoNetoArs,
    montoCargoMpArs: amounts.montoCargoMpArs,
    montoTotalCobroArs: amounts.montoTotalCobroArs,
    mpFeeRateUsed: amounts.feeRate,
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
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDb();
  await db.collection("pedidos_madera").insertOne(doc);

  return NextResponse.json({
    ok: true,
    id: _id.toString(),
    externalReference: mpExternalReference,
    paymentExpiresAt: paymentExpiresAt.toISOString(),
    amounts: {
      montoNetoArs: amounts.montoNetoArs,
      montoCargoMpArs: amounts.montoCargoMpArs,
      montoTotalCobroArs: amounts.montoTotalCobroArs,
    },
  });
}
