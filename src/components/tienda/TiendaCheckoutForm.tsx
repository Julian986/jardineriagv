"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTiendaCart } from "@/components/tienda/TiendaCartContext";
import {
  formatArs,
  formatFeeRatePercent,
} from "@/lib/madera/pricing";
import {
  formatTiendaCheckoutValidationError,
  normalizeTiendaCheckoutInput,
  TIENDA_ENTREGA_OPTIONS,
  TiendaCheckoutSchema,
} from "@/lib/tienda/checkout";
import {
  calcTiendaCheckoutAmounts,
  getTiendaMpCheckoutFeeRatePublic,
} from "@/lib/tienda/pedido";
import { RUTA_TIENDA, rutaProductoTienda } from "@/lib/tienda-routes";

const FIELD_ERROR = "mt-1.5 text-[13px] leading-snug font-medium text-[#b91c1c]";
const INPUT =
  "w-full rounded-md border border-[#ddd] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none transition-colors placeholder:text-[#aaa] focus:border-[#2d4a22] focus:ring-1 focus:ring-[#2d4a22]/30";

type FieldErrors = Partial<Record<"nombre" | "celular" | "email" | "notas" | "entrega", string>>;

export function TiendaCheckoutForm() {
  const { items, subtotalArs, itemCount } = useTiendaCart();
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [notas, setNotas] = useState("");
  const [entrega, setEntrega] = useState<"retiro" | "envio">("retiro");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverLines, setServerLines] = useState<
    { productoId: string; nombre: string; precioUnitarioArs: number; cantidad: number }[] | null
  >(null);

  const empty = items.length === 0;
  const feeRate = getTiendaMpCheckoutFeeRatePublic();
  const amounts = useMemo(
    () => calcTiendaCheckoutAmounts(subtotalArs, feeRate),
    [subtotalArs, feeRate],
  );
  const transferenciaHint = useMemo(() => Math.round(subtotalArs * 0.9), [subtotalArs]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mp = params.get("mp");
    if (mp === "failure") {
      setSubmitError("El pago no se completó. Podés intentar de nuevo cuando quieras.");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setFieldErrors({});
    setServerLines(null);

    const payload = normalizeTiendaCheckoutInput({
      nombre,
      celular,
      email,
      notas,
      entrega,
    });

    const parsed = TiendaCheckoutSchema.safeParse(payload);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === "nombre" ||
          key === "celular" ||
          key === "email" ||
          key === "notas" ||
          key === "entrega"
        ) {
          if (!next[key]) next[key] = issue.message;
        }
      }
      setFieldErrors(next);
      setSubmitError(formatTiendaCheckoutValidationError(parsed.error));
      return;
    }

    if (items.length === 0) {
      setSubmitError("Tu carrito está vacío.");
      return;
    }

    setIsSubmitting(true);

    try {
      const pendingRes = await fetch("/api/tienda/pedidos/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          items: items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
          })),
        }),
      });
      const pendingData = (await pendingRes.json()) as {
        ok?: boolean;
        id?: string;
        error?: string;
        items?: {
          productoId: string;
          nombre: string;
          precioUnitarioArs: number;
          cantidad: number;
        }[];
        amounts?: { montoTotalCobroArs: number };
      };

      if (!pendingRes.ok || !pendingData.ok || !pendingData.id) {
        setSubmitError(pendingData.error ?? "No se pudo crear el pedido.");
        setIsSubmitting(false);
        return;
      }

      if (pendingData.items?.length) {
        setServerLines(pendingData.items);
      }

      const prefRes = await fetch(`/api/tienda/pedidos/${pendingData.id}/preference`, {
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

  if (empty) {
    return (
      <div className="rounded-xl border border-[#e8ebe3] bg-white px-6 py-14 text-center shadow-sm">
        <p className="font-display text-2xl font-bold text-[#2d4a22]">Tu carrito está vacío</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#666]">
          Agregá productos desde la tienda para continuar con la compra.
        </p>
        <Link
          href={RUTA_TIENDA}
          className="mt-6 inline-flex rounded-full bg-[#2d4a22] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#243c1c]"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10"
    >
      <div className="space-y-6">
        <section className="rounded-xl border border-[#e8ebe3] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-bold text-[#2d4a22]">Tus datos</h2>
          <p className="mt-1 text-sm text-[#666]">
            Los usamos para coordinar el pedido y la entrega.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="checkout-nombre" className="mb-1.5 block text-sm font-semibold text-[#333]">
                Nombre y apellido
              </label>
              <input
                id="checkout-nombre"
                name="nombre"
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={INPUT}
                placeholder="Ej. María Gómez"
              />
              {fieldErrors.nombre ? <p className={FIELD_ERROR}>{fieldErrors.nombre}</p> : null}
            </div>

            <div>
              <label htmlFor="checkout-celular" className="mb-1.5 block text-sm font-semibold text-[#333]">
                Celular / WhatsApp
              </label>
              <input
                id="checkout-celular"
                name="celular"
                autoComplete="tel"
                inputMode="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className={INPUT}
                placeholder="Ej. 291 555-1234"
              />
              {fieldErrors.celular ? <p className={FIELD_ERROR}>{fieldErrors.celular}</p> : null}
            </div>

            <div>
              <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-semibold text-[#333]">
                Email <span className="font-normal text-[#888]">(opcional)</span>
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT}
                placeholder="tu@email.com"
              />
              {fieldErrors.email ? <p className={FIELD_ERROR}>{fieldErrors.email}</p> : null}
            </div>

            <div>
              <label htmlFor="checkout-notas" className="mb-1.5 block text-sm font-semibold text-[#333]">
                Dirección
              </label>
              <textarea
                id="checkout-notas"
                name="notas"
                rows={3}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className={`${INPUT} resize-y`}
                placeholder="Calle, número, barrio y referencia"
              />
              <p className="mt-1.5 text-xs text-[#888]">
                Coordinamos entrega o retiro por WhatsApp después de la compra.
              </p>
              {fieldErrors.notas ? <p className={FIELD_ERROR}>{fieldErrors.notas}</p> : null}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#e8ebe3] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-bold text-[#2d4a22]">Entrega</h2>
          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">Método de entrega</legend>
            {TIENDA_ENTREGA_OPTIONS.map((opt) => {
              const selected = entrega === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    selected
                      ? "border-[#2d4a22] bg-[#f3f5f0]"
                      : "border-[#e5e5e5] bg-white hover:border-[#2d4a22]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="entrega"
                    value={opt.id}
                    checked={selected}
                    onChange={() => setEntrega(opt.id)}
                    className="mt-1 accent-[#2d4a22]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#1a1a1a]">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-[#666]">{opt.hint}</span>
                  </span>
                </label>
              );
            })}
          </fieldset>
          {fieldErrors.entrega ? <p className={FIELD_ERROR}>{fieldErrors.entrega}</p> : null}
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-[#e8ebe3] bg-white p-5 shadow-sm lg:sticky lg:top-24 sm:p-6">
        <h2 className="font-display text-xl font-bold text-[#2d4a22]">Resumen</h2>
        <p className="mt-1 text-xs text-[#888]">
          {itemCount} {itemCount === 1 ? "producto" : "productos"}
        </p>

        <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto border-b border-[#eee] pb-4">
          {items.map((item) => {
            const server = serverLines?.find((line) => line.productoId === item.productoId);
            const unit = server?.precioUnitarioArs ?? item.precioArs;
            return (
              <li key={item.productoId} className="flex gap-3">
                <Link
                  href={rutaProductoTienda(item.slug)}
                  className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-[#eee] bg-[#fafafa]"
                >
                  <Image src={item.imagen} alt="" fill className="object-cover" sizes="56px" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={rutaProductoTienda(item.slug)}
                    className="line-clamp-2 text-sm leading-snug text-[#333] hover:text-[#2d4a22]"
                  >
                    {item.nombre}
                  </Link>
                  <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[#666]">
                    <span>× {item.cantidad}</span>
                    <span className="font-semibold text-[#1a1a1a]">
                      {formatArs(unit * item.cantidad)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 space-y-2 text-sm text-[#444]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-[#1a1a1a]">{formatArs(amounts.montoNetoArs)}</span>
          </div>
          <div className="flex justify-between text-[#666]">
            <span>Cargo Mercado Pago ({formatFeeRatePercent(feeRate)})</span>
            <span>{formatArs(amounts.montoCargoMpArs)}</span>
          </div>
          <div className="flex justify-between text-[#666]">
            <span>Envío</span>
            <span>A coordinar</span>
          </div>
          <div className="flex justify-between border-t border-[#e8e8e8] pt-3 text-base font-bold text-[#1a1a1a]">
            <span>Total a pagar</span>
            <span>{formatArs(amounts.montoTotalCobroArs)}</span>
          </div>
          <p className="text-xs leading-relaxed text-[#666]">
            El precio de cada producto se confirma al pagar con el valor actual de la tienda. Con
            transferencia o depósito:{" "}
            <span className="font-semibold text-[#2d4a22]">{formatArs(transferenciaHint)}</span>{" "}
            (10% OFF estimado — se coordina aparte).
          </p>
        </div>

        {submitError ? (
          <p
            className="mt-4 rounded-lg border border-[#f0d0d0] bg-[#fff5f5] px-3 py-2 text-sm text-[#b91c1c]"
            role="alert"
          >
            {submitError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-[#2d4a22] text-sm font-bold text-white transition-colors hover:bg-[#243c1c] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "Redirigiendo a Mercado Pago…" : "Continuar al pago"}
        </button>

        <Link
          href={RUTA_TIENDA}
          className="mt-3 block text-center text-sm font-medium text-[#2d4a22] underline-offset-2 hover:underline"
        >
          Seguir comprando
        </Link>
      </aside>
    </form>
  );
}
