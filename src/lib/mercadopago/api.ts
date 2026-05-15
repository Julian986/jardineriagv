import { getMercadoPagoAccessToken } from "./config";
import type { MpPaymentResource, MpPreferenceCreateResponse } from "./types";

const MP_API = "https://api.mercadopago.com";

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getMercadoPagoAccessToken()}`,
    "Content-Type": "application/json",
  };
}

export type PreferenceItem = {
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency_id: string;
};

export type CreatePreferenceInput = {
  items: PreferenceItem[];
  external_reference: string;
  notification_url: string;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: "approved" | "all";
};

export async function mpCreatePreference(
  body: CreatePreferenceInput,
): Promise<MpPreferenceCreateResponse> {
  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as MpPreferenceCreateResponse & {
    message?: string;
    error?: string;
    cause?: unknown;
  };

  if (!res.ok) {
    const msg =
      typeof json.message === "string"
        ? json.message
        : typeof json.error === "string"
          ? json.error
          : `HTTP ${res.status}`;
    throw new Error(`Mercado Pago preferences: ${msg}`);
  }

  return json;
}

export async function mpGetPayment(paymentId: string): Promise<MpPaymentResource> {
  const res = await fetch(`${MP_API}/v1/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const json = (await res.json().catch(() => ({}))) as MpPaymentResource & {
    message?: string;
  };

  if (!res.ok) {
    const msg = typeof json.message === "string" ? json.message : `HTTP ${res.status}`;
    throw new Error(`Mercado Pago payment ${paymentId}: ${msg}`);
  }

  return json;
}
