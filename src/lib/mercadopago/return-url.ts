/** IDs que Mercado Pago envía en back_urls tras Checkout Pro. */
export function extractPaymentIdFromReturnUrl(
  searchParams: URLSearchParams,
): string | null {
  const candidates = [
    searchParams.get("payment_id"),
    searchParams.get("collection_id"),
  ];
  for (const raw of candidates) {
    const id = raw?.trim();
    if (id && /^\d+$/.test(id)) return id;
  }
  return null;
}
