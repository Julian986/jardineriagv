import { NextResponse } from "next/server";
import { extractPaymentIdsFromWebhook } from "@/lib/mercadopago/webhook-parser";
import { processApprovedPaymentForTurno } from "@/lib/reservas/mercadopago-confirmation";

export const dynamic = "force-dynamic";

function logMp(line: string, extra?: Record<string, unknown>) {
  if (extra) {
    console.info(`[mp-webhook] ${line}`, extra);
  } else {
    console.info(`[mp-webhook] ${line}`);
  }
}

async function processNotificationPayload(
  method: string,
  requestUrl: string,
  rawBody: string,
) {
  const url = new URL(requestUrl);
  const ids = extractPaymentIdsFromWebhook(method, url, rawBody);
  if (ids.length === 0) {
    logMp("sin payment id (topic distinto o payload vacío)", {
      method,
      path: url.pathname,
    });
    return;
  }
  const snippet = rawBody.length > 16_000 ? `${rawBody.slice(0, 16_000)}…` : rawBody;
  for (const paymentId of ids) {
    try {
      const r = await processApprovedPaymentForTurno(paymentId, {
        transport: method,
        rawSnippet: snippet,
      });
      logMp(`payment ${paymentId}`, { outcome: r.outcome, message: r.message });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[mp-webhook] error payment ${paymentId}`, msg);
    }
  }
}

async function handle(request: Request, method: string) {
  const url = request.url;
  let rawBody = "";
  if (method === "POST") {
    rawBody = await request.text();
  }

  try {
    await processNotificationPayload(method, url, rawBody);
  } catch (e) {
    console.error("[mp-webhook]", e);
  }

  return new NextResponse(null, { status: 200 });
}

export async function POST(request: Request) {
  return handle(request, "POST");
}

export async function GET(request: Request) {
  return handle(request, "GET");
}
