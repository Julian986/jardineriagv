import { NextResponse } from "next/server";
import { processApprovedPaymentForTiendaPedido } from "@/lib/tienda/mercadopago-confirmation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const paymentId =
    payload &&
    typeof payload === "object" &&
    "paymentId" in payload &&
    typeof (payload as { paymentId: unknown }).paymentId === "string"
      ? (payload as { paymentId: string }).paymentId.trim()
      : "";

  if (!paymentId || !/^\d+$/.test(paymentId)) {
    return NextResponse.json({ ok: false, error: "paymentId inválido" }, { status: 400 });
  }

  const result = await processApprovedPaymentForTiendaPedido(paymentId, {
    transport: "client_return",
    rawSnippet: JSON.stringify({ paymentId }),
  });

  const ok =
    result.outcome === "confirmed" || result.outcome === "already_confirmed";

  return NextResponse.json({
    ok,
    outcome: result.outcome,
    message: result.message,
  });
}
