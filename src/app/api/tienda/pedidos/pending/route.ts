import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getPaymentExpiryDate } from "@/lib/reservas/mercadopago-confirmation";
import { getProductoById } from "@/lib/tienda/productos";
import {
  buildTiendaPedidoCodigo,
  calcTiendaCheckoutAmounts,
  COL_TIENDA_PEDIDOS,
  formatTiendaPedidoValidationError,
  TiendaPedidoPendingSchema,
  type TiendaPedidoItemSnapshot,
} from "@/lib/tienda/pedido";
import { buildTiendaMpExternalReference } from "@/lib/tienda/mercadopago-confirmation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = TiendaPedidoPendingSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: formatTiendaPedidoValidationError(parsed.error) },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const items: TiendaPedidoItemSnapshot[] = [];

  for (const line of input.items) {
    const producto = await getProductoById(line.productoId);
    if (!producto || !producto.activo) {
      return NextResponse.json(
        { ok: false, error: "Hay un producto no disponible. Actualizá el carrito." },
        { status: 409 },
      );
    }
    if (typeof producto.stock === "number" && producto.stock < line.cantidad) {
      return NextResponse.json(
        {
          ok: false,
          error: `Stock insuficiente para “${producto.nombre}” (disponible: ${producto.stock}).`,
        },
        { status: 409 },
      );
    }

    items.push({
      productoId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      categoriaId: producto.categoriaId,
      categoriaSlug: producto.categoriaSlug,
      categoriaNombre: producto.categoriaLabel || producto.categoriaSlug,
      precioUnitarioArs: producto.precioArs,
      cantidad: line.cantidad,
      subtotalArs: producto.precioArs * line.cantidad,
      imagen: producto.imagen,
    });
  }

  const subtotalArs = items.reduce((sum, item) => sum + item.subtotalArs, 0);
  if (subtotalArs <= 0) {
    return NextResponse.json({ ok: false, error: "Monto inválido" }, { status: 400 });
  }

  const amounts = calcTiendaCheckoutAmounts(subtotalArs);
  const now = new Date();
  const _id = new ObjectId();
  const mpExternalReference = buildTiendaMpExternalReference(_id);
  const paymentExpiresAt = getPaymentExpiryDate();

  const doc = {
    _id,
    items,
    itemCount: items.reduce((sum, item) => sum + item.cantidad, 0),
    comprador: {
      nombre: input.nombre,
      celular: input.celular,
      email: input.email || undefined,
      notas: input.notas,
      entrega: input.entrega,
    },
    subtotalArs: amounts.montoNetoArs,
    montoNetoArs: amounts.montoNetoArs,
    montoCargoMpArs: amounts.montoCargoMpArs,
    montoTotalCobroArs: amounts.montoTotalCobroArs,
    mpFeeRateUsed: amounts.feeRate,
    pedidoCodigo: buildTiendaPedidoCodigo(),
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
  await db.collection(COL_TIENDA_PEDIDOS).insertOne(doc);

  return NextResponse.json({
    ok: true,
    id: _id.toString(),
    pedidoCodigo: doc.pedidoCodigo,
    externalReference: mpExternalReference,
    paymentExpiresAt: paymentExpiresAt.toISOString(),
    amounts: {
      subtotalArs: amounts.montoNetoArs,
      montoCargoMpArs: amounts.montoCargoMpArs,
      montoTotalCobroArs: amounts.montoTotalCobroArs,
    },
    items: items.map((item) => ({
      productoId: item.productoId,
      nombre: item.nombre,
      precioUnitarioArs: item.precioUnitarioArs,
      cantidad: item.cantidad,
    })),
  });
}
