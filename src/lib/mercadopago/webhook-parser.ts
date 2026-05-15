/**
 * Mercado Pago envía notificaciones por IPN (form/query) y webhooks JSON.
 * @see https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */

function pushUnique(arr: string[], id: string | null | undefined): void {
  if (!id) return;
  const s = String(id).trim();
  if (!s || arr.includes(s)) return;
  arr.push(s);
}

export function extractPaymentIdsFromWebhook(
  method: string,
  url: URL,
  rawBody: string,
): string[] {
  const searchParams = url.searchParams;
  const ids: string[] = [];

  const tryJson = () => {
    const trimmed = rawBody.trim();
    if (!trimmed.startsWith("{")) return;
    try {
      const j = JSON.parse(trimmed) as Record<string, unknown>;
      const type = typeof j.type === "string" ? j.type : "";
      const data = j.data as Record<string, unknown> | undefined;
      const dataId = data?.id;
      if (type === "payment" && dataId != null) {
        pushUnique(ids, String(dataId));
      }
      if (typeof j.action === "string" && j.action.startsWith("payment.") && dataId != null) {
        pushUnique(ids, String(dataId));
      }
    } catch {
      /* no JSON */
    }
  };

  tryJson();

  const topic = searchParams.get("topic") ?? searchParams.get("type");
  const id = searchParams.get("id") ?? searchParams.get("data.id");
  if (topic === "payment" && id) pushUnique(ids, id);

  if (rawBody && !rawBody.trim().startsWith("{")) {
    const params = new URLSearchParams(rawBody);
    const t = params.get("topic") ?? params.get("type");
    const pid = params.get("id") ?? params.get("data.id");
    if (t === "payment" && pid) pushUnique(ids, pid);
  }

  if (method === "GET" && ids.length === 0 && topic === "payment" && id) {
    pushUnique(ids, id);
  }

  return ids;
}
