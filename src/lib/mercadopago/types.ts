/** Respuesta mínima de creación de preferencia Checkout Pro */
export type MpPreferenceCreateResponse = {
  id?: string;
  init_point?: string;
  sandbox_init_point?: string;
};

/** Respuesta mínima GET /v1/payments/:id */
export type MpPaymentResource = {
  id?: number | string;
  status?: string;
  status_detail?: string;
  external_reference?: string | null;
  transaction_amount?: number;
  currency_id?: string;
  date_approved?: string | null;
};
