"use client";

import { useEffect, useMemo, useState } from "react";
import { MaderaPedidoCreateSchema } from "@/lib/madera/pedido";
import { MADERA_VARIANTES } from "@/lib/madera-productos";
import {
  calcMaderaCheckoutAmounts,
  formatArs,
  formatFeeRatePercent,
  getMaderaMpCheckoutFeeRatePublic,
  getMaderaPrecioMetroLinealArsPublic,
} from "@/lib/madera/pricing";
import { extractPaymentIdFromReturnUrl } from "@/lib/mercadopago/return-url";
import { event as gaEvent } from "@/lib/gtag";

type FormFields = {
  productoId: string;
  metrosLineales: string;
  nombre: string;
  celular: string;
  notas: string;
};

const initialForm: FormFields = {
  productoId: MADERA_VARIANTES[0].id,
  metrosLineales: "1",
  nombre: "",
  celular: "",
  notas: "",
};

const FIELD_ERROR_CLASS = "mt-1.5 text-[13px] leading-snug font-medium text-[#b91c1c]";

export function MaderaCheckoutForm() {
  const [form, setForm] = useState<FormFields>(initialForm);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mpReturnHint, setMpReturnHint] = useState<"success" | "failure" | "pending" | null>(
    null,
  );
  const [mpConfirmStatus, setMpConfirmStatus] = useState<
    "idle" | "syncing" | "confirmed" | "pending" | "failed"
  >("idle");

  const precioMetro = getMaderaPrecioMetroLinealArsPublic();
  const feeRate = getMaderaMpCheckoutFeeRatePublic();

  const metrosNum = useMemo(() => {
    const n = Number.parseFloat(form.metrosLineales.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [form.metrosLineales]);

  const amounts = useMemo(() => {
    if (metrosNum <= 0) return null;
    return calcMaderaCheckoutAmounts(metrosNum, precioMetro, feeRate);
  }, [metrosNum, precioMetro, feeRate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mp = params.get("mp");
    if (mp === "success" || mp === "failure" || mp === "pending") {
      setMpReturnHint(mp);
    }

    const paymentId = extractPaymentIdFromReturnUrl(params);
    if (mp === "success" && paymentId) {
      setMpConfirmStatus("syncing");
      fetch("/api/madera/pedidos/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })
        .then((r) => r.json())
        .then((data: { ok?: boolean }) => {
          setMpConfirmStatus(data.ok ? "confirmed" : "pending");
        })
        .catch(() => setMpConfirmStatus("failed"));
    } else if (mp === "pending") {
      setMpConfirmStatus("pending");
    } else if (mp === "failure") {
      setMpConfirmStatus("failed");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const payload = {
      productoId: form.productoId,
      metrosLineales: metrosNum,
      nombre: form.nombre,
      celular: form.celular,
      notas: form.notas.trim() || undefined,
    };

    const parsed = MaderaPedidoCreateSchema.safeParse(payload);
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? "Revisá los datos.");
      setIsSubmitting(false);
      return;
    }

    try {
      gaEvent("madera_checkout_start", {
        producto_id: parsed.data.productoId,
        metros: parsed.data.metrosLineales,
      });

      const pendingRes = await fetch("/api/madera/pedidos/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const pendingData = (await pendingRes.json()) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };

      if (!pendingRes.ok || !pendingData.ok || !pendingData.id) {
        setSubmitError(pendingData.error ?? "No se pudo crear el pedido.");
        setIsSubmitting(false);
        return;
      }

      const prefRes = await fetch(`/api/madera/pedidos/${pendingData.id}/preference`, {
        method: "POST",
      });
      const prefData = (await prefRes.json()) as {
        ok?: boolean;
        initPoint?: string;
        error?: string;
      };

      if (!prefRes.ok || !prefData.ok || !prefData.initPoint) {
        setSubmitError(prefData.error ?? "No se pudo abrir Mercado Pago.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = prefData.initPoint;
    } catch {
      setSubmitError("Error de conexión. Intentá de nuevo.");
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="comprar"
      className="scroll-mt-24 rounded-2xl border border-[#e4ead8] bg-white p-6 shadow-sm md:p-8"
      aria-labelledby="comprar-heading"
    >
      <h2 id="comprar-heading" className="text-2xl font-bold text-[#2d5016] md:text-3xl">
        Comprar con Mercado Pago
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-[#555]">
        Precio por metro lineal:{" "}
        <strong className="text-[#1c1c1c]">{formatArs(precioMetro)}</strong>. El cargo por pago con
        tarjeta o Mercado Pago ({formatFeeRatePercent(feeRate)} estimado) lo asume el comprador.
      </p>

      {mpReturnHint === "success" && mpConfirmStatus === "confirmed" ? (
        <div
          className="mt-6 rounded-xl border border-[#c8d9b8] bg-[#f0f5ea] px-4 py-4 text-[15px] text-[#2d5016]"
          role="status"
        >
          ¡Pago recibido! Guillermo se pondrá en contacto para coordinar medidas y entrega.
        </div>
      ) : null}

      {mpReturnHint === "pending" || mpConfirmStatus === "pending" ? (
        <div
          className="mt-6 rounded-xl border border-[#e8d5a8] bg-[#fff8eb] px-4 py-4 text-[15px] text-[#7a5a12]"
          role="status"
        >
          Tu pago está en proceso. Te avisaremos cuando se acredite.
        </div>
      ) : null}

      {mpReturnHint === "failure" || mpConfirmStatus === "failed" ? (
        <div
          className="mt-6 rounded-xl border border-[#f0c4c4] bg-[#fef2f2] px-4 py-4 text-[15px] text-[#991b1b]"
          role="alert"
        >
          El pago no se completó. Podés intentar de nuevo o consultar por WhatsApp.
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        <fieldset>
          <legend className="text-sm font-semibold text-[#2d5016]">Espesor del estante</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {MADERA_VARIANTES.map((v) => (
              <label
                key={v.id}
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-colors ${
                  form.productoId === v.id
                    ? "border-[#2d5016] bg-[#f0f5ea]"
                    : "border-[#e4ead8] bg-[#fafaf7] hover:border-[#c8d9b8]"
                }`}
              >
                <input
                  type="radio"
                  name="productoId"
                  value={v.id}
                  checked={form.productoId === v.id}
                  onChange={() => setForm((f) => ({ ...f, productoId: v.id }))}
                  className="sr-only"
                />
                <span className="text-[15px] font-semibold text-[#1c1c1c]">{v.medidasLabel}</span>
                <span className="mt-1 text-sm text-[#555]">
                  {formatArs(precioMetro)} / metro lineal
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="metrosLineales" className="block text-sm font-semibold text-[#2d5016]">
            Metros lineales
          </label>
          <input
            id="metrosLineales"
            name="metrosLineales"
            type="text"
            inputMode="decimal"
            value={form.metrosLineales}
            onChange={(e) => setForm((f) => ({ ...f, metrosLineales: e.target.value }))}
            className="mt-2 w-full max-w-xs rounded-xl border border-[#d8e2cf] bg-white px-4 py-3 text-[15px] outline-none ring-[#2d5016]/20 focus:ring-2"
            placeholder="Ej. 2,5"
            required
          />
          <p className="mt-1.5 text-[13px] text-[#666]">Mínimo 0,5 m. Para pedidos grandes, WhatsApp.</p>
        </div>

        {amounts ? (
          <div className="rounded-xl border border-[#e4ead8] bg-[#fafaf7] p-4 text-[15px]">
            <div className="flex justify-between gap-4">
              <span className="text-[#555]">Subtotal ({amounts.metros} m)</span>
              <span className="font-semibold text-[#1c1c1c]">{formatArs(amounts.montoNetoArs)}</span>
            </div>
            <div className="mt-2 flex justify-between gap-4">
              <span className="text-[#555]">Cargo Mercado Pago (estimado)</span>
              <span className="font-semibold text-[#1c1c1c]">
                {formatArs(amounts.montoCargoMpArs)}
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-4 border-t border-[#e4ead8] pt-3">
              <span className="font-semibold text-[#2d5016]">Total a pagar</span>
              <span className="text-lg font-bold text-[#2d5016]">
                {formatArs(amounts.montoTotalCobroArs)}
              </span>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-[#2d5016]">
              Nombre y apellido
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-[#d8e2cf] bg-white px-4 py-3 text-[15px] outline-none ring-[#2d5016]/20 focus:ring-2"
              required
            />
          </div>
          <div>
            <label htmlFor="celular" className="block text-sm font-semibold text-[#2d5016]">
              Celular
            </label>
            <input
              id="celular"
              name="celular"
              type="tel"
              autoComplete="tel"
              value={form.celular}
              onChange={(e) => setForm((f) => ({ ...f, celular: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-[#d8e2cf] bg-white px-4 py-3 text-[15px] outline-none ring-[#2d5016]/20 focus:ring-2"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="notas" className="block text-sm font-semibold text-[#2d5016]">
            Notas (opcional)
          </label>
          <textarea
            id="notas"
            name="notas"
            rows={3}
            value={form.notas}
            onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-[#d8e2cf] bg-white px-4 py-3 text-[15px] outline-none ring-[#2d5016]/20 focus:ring-2"
            placeholder="Ej. cantidad de estantes, largo de cada uno, envío…"
          />
        </div>

        {submitError ? <p className={FIELD_ERROR_CLASS}>{submitError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-full bg-[#c4933f] px-8 py-3.5 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Redirigiendo a Mercado Pago…" : "Pagar con Mercado Pago"}
        </button>
      </form>
    </section>
  );
}
