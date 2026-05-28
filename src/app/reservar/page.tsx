"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { HistoryBackLink } from "@/components/HistoryBackLink";
import { extractPaymentIdFromReturnUrl } from "@/lib/mercadopago/return-url";
import { event as gaEvent } from "@/lib/gtag";
import { getReservaVisitaMontoArsPublic } from "@/lib/mercadopago/config";
import {
  DIAS_SEMANA_RESERVA_PERMITIDOS,
  HORARIO_OPTIONS,
  TurnoCreateSchema,
} from "@/lib/turnos";

type FormFields = {
  nombre: string;
  celular: string;
  direccion: string;
  fechaPreferida: string;
  horario: string;
};

type ErrorState = Partial<Record<keyof FormFields, string>>;
type TouchedState = Partial<Record<keyof FormFields, boolean>>;

const FORM_FIELD_ORDER: (keyof FormFields)[] = [
  "nombre",
  "celular",
  "direccion",
  "fechaPreferida",
  "horario",
];

const FIELD_ERROR_CLASS = "mt-1.5 text-[13px] leading-snug font-medium text-[#b91c1c]";

const initialForm: FormFields = {
  nombre: "",
  celular: "",
  direccion: "",
  fechaPreferida: "",
  horario: HORARIO_OPTIONS[0],
};

const montoVisitaFormateado = `$${new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
}).format(getReservaVisitaMontoArsPublic())}`;

const WEEKDAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function toIsoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfTodayLocal(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

function buildMonthWeeks(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function ReservarPage() {
  const [form, setForm] = useState<FormFields>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [mpReturnHint, setMpReturnHint] = useState<"success" | "failure" | "pending" | null>(
    null,
  );
  const [mpConfirmStatus, setMpConfirmStatus] = useState<
    "idle" | "syncing" | "confirmed" | "pending" | "failed"
  >("idle");

  const [cursorMonth, setCursorMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const despuesDeFechaRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Partial<Record<keyof FormFields, HTMLElement | null>>>({});

  const horariosDisponibles = useMemo(() => HORARIO_OPTIONS, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mp = params.get("mp");
    if (mp === "success" || mp === "failure" || mp === "pending") {
      setMpReturnHint(mp);
    }

    if (mp !== "success" && mp !== "pending") return;

    const paymentId = extractPaymentIdFromReturnUrl(params);
    if (!paymentId) return;

    let cancelled = false;

    async function tryConfirm(attempt: number) {
      setMpConfirmStatus("syncing");
      try {
        const res = await fetch("/api/reservas/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });
        const data = (await res.json()) as { ok?: boolean; outcome?: string };
        if (cancelled) return;
        if (data.ok) {
          setMpConfirmStatus("confirmed");
          return;
        }
        if (data.outcome === "not_approved" && mp === "pending" && attempt < 4) {
          window.setTimeout(() => void tryConfirm(attempt + 1), 2000);
          return;
        }
        if (attempt < 3) {
          window.setTimeout(() => void tryConfirm(attempt + 1), 1500);
          return;
        }
        setMpConfirmStatus("pending");
      } catch {
        if (!cancelled) setMpConfirmStatus("failed");
      }
    }

    void tryConfirm(0);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!form.fechaPreferida) return;
    const el = despuesDeFechaRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [form.fechaPreferida]);

  const calendarWeeks = useMemo(
    () => buildMonthWeeks(cursorMonth.getFullYear(), cursorMonth.getMonth()),
    [cursorMonth],
  );

  function validateForm(values: FormFields) {
    return TurnoCreateSchema.safeParse(values);
  }

  function focusFirstInvalidField(errorMap: ErrorState) {
    const first = FORM_FIELD_ORDER.find((key) => errorMap[key]);
    if (!first) return;

    window.setTimeout(() => {
      const section = fieldRefs.current[first];
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusable = section.querySelector<HTMLElement>(
        "input:not([disabled]), textarea:not([disabled]), select:not([disabled])",
      );
      if (focusable) {
        focusable.focus({ preventScroll: true });
      } else {
        section.focus({ preventScroll: true });
      }
    }, 80);
  }

  function applyFieldErrors(nextErrors: ErrorState) {
    setErrors(nextErrors);
    setTouched({
      nombre: true,
      celular: true,
      direccion: true,
      fechaPreferida: true,
      horario: true,
    });
    focusFirstInvalidField(nextErrors);
  }

  function updateField<K extends keyof FormFields>(field: K, value: FormFields[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof FormFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateForm(form);

    if (validation.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return;
    }

    const issue = validation.error.issues.find((i) => i.path[0] === field);
    setErrors((prev) => ({ ...prev, [field]: issue?.message }));
  }

  function selectCalendarDay(day: number) {
    const d = new Date(cursorMonth.getFullYear(), cursorMonth.getMonth(), day, 12, 0, 0, 0);
    const iso = toIsoDateLocal(d);
    updateField("fechaPreferida", iso);
    setTouched((prev) => ({ ...prev, fechaPreferida: true }));
    const validation = validateForm({ ...form, fechaPreferida: iso });
    if (!validation.success) {
      const issue = validation.error.issues.find((i) => i.path[0] === "fechaPreferida");
      setErrors((prev) => ({ ...prev, fechaPreferida: issue?.message }));
    } else {
      setErrors((prev) => ({ ...prev, fechaPreferida: undefined }));
    }
  }

  function shiftMonth(delta: number) {
    setCursorMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const validation = validateForm(form);
    if (!validation.success) {
      const nextErrors: ErrorState = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof FormFields;
        if (typeof field === "string" && field in initialForm && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      applyFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const pendingRes = await fetch("/api/reservas/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const pendingJson = (await pendingRes.json()) as {
        ok?: boolean;
        error?: string;
        issues?: { path: string[]; message: string }[];
        id?: string;
      };

      if (!pendingRes.ok || !pendingJson.ok || !pendingJson.id) {
        const issues = pendingJson.issues ?? [];
        const formKeys = new Set<string>([
          "nombre",
          "celular",
          "direccion",
          "fechaPreferida",
          "horario",
        ]);
        const nextErrors: ErrorState = {};
        for (const issue of issues) {
          const key = issue.path[0];
          if (typeof key === "string" && formKeys.has(key)) {
            const f = key as keyof FormFields;
            if (!nextErrors[f]) nextErrors[f] = issue.message;
          }
        }
        if (Object.keys(nextErrors).length > 0) {
          applyFieldErrors(nextErrors);
          setSubmitError("");
        } else {
          setSubmitError(
            pendingJson.error?.trim() ||
              "No pudimos guardar la reserva. Revisá los datos e intentá de nuevo.",
          );
        }
        return;
      }

      const prefRes = await fetch(`/api/reservas/${pendingJson.id}/preference`, {
        method: "POST",
      });
      const prefJson = (await prefRes.json()) as {
        ok?: boolean;
        error?: string;
        initPoint?: string;
      };

      if (!prefRes.ok || !prefJson.ok || !prefJson.initPoint) {
        setSubmitError(
          prefJson.error?.trim() ||
            "No pudimos iniciar el pago con Mercado Pago. Intentá de nuevo en unos minutos o contactanos por WhatsApp.",
        );
        return;
      }

      gaEvent("reserva_iniciada", {
        event_category: "reservar",
        event_label: "redirect_mercadopago",
        value: 1,
      });

      window.location.assign(prefJson.initPoint);
    } catch {
      setSubmitError("Ocurrió un error de conexión. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const today = startOfTodayLocal();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,246,241,0.96))] p-6 shadow-[0_18px_46px_rgba(31,41,55,0.08)] md:p-8">
        <div className="mb-5">
          <HistoryBackLink
            aria-label="Volver al inicio"
            onClick={() => gaEvent("volver_inicio_click", { location: "reservar_header" })}
            className="inline-flex items-center gap-2 rounded-full border border-[#1f5d38]/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38] transition hover:bg-[#f0fdf4]"
          >
            <span aria-hidden className="text-sm leading-none">
              ←
            </span>
            Volver
          </HistoryBackLink>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6a3c]">
          Reserva de visita
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#101828] md:text-4xl">
          Agendar visita
        </h1>

        {mpReturnHint === "success" && mpConfirmStatus === "confirmed" && (
          <p className="mt-4 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[14px] leading-relaxed text-[#14532d]">
            <strong>Pago confirmado.</strong> Tu visita quedó registrada. Te contactaremos por WhatsApp.
          </p>
        )}
        {mpReturnHint === "success" && mpConfirmStatus === "syncing" && (
          <p className="mt-4 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-[14px] leading-relaxed text-[#1e3a8a]">
            Verificando el pago con Mercado Pago…
          </p>
        )}
        {mpReturnHint === "success" &&
          (mpConfirmStatus === "pending" || mpConfirmStatus === "failed" || mpConfirmStatus === "idle") && (
          <p className="mt-4 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-[14px] leading-relaxed text-[#1e3a8a]">
            Si completaste el pago, la confirmación puede demorar unos segundos. Revisá el panel de turnos o
            contactanos si el estado no se actualiza.
          </p>
        )}
        {mpReturnHint === "failure" && (
          <p className="mt-4 rounded-xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-[14px] leading-relaxed text-[#991b1b]">
            El pago no se completó o fue rechazado. Podés volver a cargar el formulario e intentar de nuevo.
          </p>
        )}
        {mpReturnHint === "pending" && (
          <p className="mt-4 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[14px] leading-relaxed text-[#92400e]">
            Tu pago puede estar pendiente de acreditación. Cuando Mercado Pago lo apruebe, la reserva pasará a
            confirmada. Si tenés dudas, escribinos por WhatsApp.
          </p>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
          <div
            ref={(el) => {
              fieldRefs.current.nombre = el;
            }}
            className="scroll-mt-24"
          >
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Nombre y apellido
            </label>
            <input
              value={form.nombre}
              onChange={(event) => updateField("nombre", event.target.value)}
              onBlur={() => handleBlur("nombre")}
              className={`h-11 w-full rounded-xl border bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4 ${
                touched.nombre && errors.nombre
                  ? "border-[#f87171] ring-red-500/15"
                  : "border-[#d1d5db]"
              }`}
              aria-invalid={Boolean(touched.nombre && errors.nombre)}
            />
            {touched.nombre && errors.nombre && (
              <p className={FIELD_ERROR_CLASS} role="alert">
                {errors.nombre}
              </p>
            )}
          </div>

          <div
            ref={(el) => {
              fieldRefs.current.celular = el;
            }}
            className="scroll-mt-24"
          >
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Celular
            </label>
            <input
              value={form.celular}
              onChange={(event) => updateField("celular", event.target.value)}
              onBlur={() => handleBlur("celular")}
              className={`h-11 w-full rounded-xl border bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4 ${
                touched.celular && errors.celular
                  ? "border-[#f87171] ring-red-500/15"
                  : "border-[#d1d5db]"
              }`}
              aria-invalid={Boolean(touched.celular && errors.celular)}
            />
            {touched.celular && errors.celular && (
              <p className={FIELD_ERROR_CLASS} role="alert">
                {errors.celular}
              </p>
            )}
          </div>

          <div
            ref={(el) => {
              fieldRefs.current.direccion = el;
            }}
            className="scroll-mt-24"
          >
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Direccion
            </label>
            <textarea
              value={form.direccion}
              onChange={(event) => updateField("direccion", event.target.value)}
              onBlur={() => handleBlur("direccion")}
              rows={3}
              placeholder="Ej: Mitre 1234, entre calles X e Y, Bahía Blanca"
              className={`w-full rounded-xl border bg-white px-3 py-2 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4 ${
                touched.direccion && errors.direccion
                  ? "border-[#f87171] ring-red-500/15"
                  : "border-[#d1d5db]"
              }`}
              aria-invalid={Boolean(touched.direccion && errors.direccion)}
            />
            {touched.direccion && errors.direccion && (
              <p className={FIELD_ERROR_CLASS} role="alert">
                {errors.direccion}
              </p>
            )}
          </div>

          <div
            ref={(el) => {
              fieldRefs.current.fechaPreferida = el;
            }}
            tabIndex={-1}
            className={`scroll-mt-24 rounded-2xl border bg-white p-4 shadow-sm outline-none ${
              touched.fechaPreferida && errors.fechaPreferida
                ? "border-[#f87171] ring-2 ring-red-500/12"
                : "border-[#e5e7eb]"
            }`}
          >
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Elegí el día
            </p>
            <p className="mb-4 text-[13px] leading-relaxed text-[#4b5563]">
              Visitas disponibles los <strong className="text-[#101828]">lunes</strong>,{" "}
              <strong className="text-[#101828]">miércoles</strong> y{" "}
              <strong className="text-[#101828]">viernes</strong>.
            </p>

            <div className="mb-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Mes anterior"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d1d5db] text-lg font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                <span aria-hidden>←</span>
              </button>
              <p className="text-center text-sm font-semibold text-[#101828]">
                {MONTH_NAMES[cursorMonth.getMonth()]} {cursorMonth.getFullYear()}
              </p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Mes siguiente"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d1d5db] text-lg font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                <span aria-hidden>→</span>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
              {WEEKDAY_HEADERS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>

            <div className="mt-1 space-y-1">
              {calendarWeeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((day, di) => {
                    if (day === null) {
                      return <div key={`e-${wi}-${di}`} className="aspect-square p-0.5" />;
                    }
                    const cellDate = new Date(
                      cursorMonth.getFullYear(),
                      cursorMonth.getMonth(),
                      day,
                      12,
                      0,
                      0,
                      0,
                    );
                    const dow = cellDate.getDay();
                    const permitido = DIAS_SEMANA_RESERVA_PERMITIDOS.includes(
                      dow as (typeof DIAS_SEMANA_RESERVA_PERMITIDOS)[number],
                    );
                    const pasado = cellDate < today;
                    const iso = toIsoDateLocal(cellDate);
                    const seleccionado = form.fechaPreferida === iso;
                    const disabled = !permitido || pasado;

                    return (
                      <div key={iso} className="aspect-square p-0.5">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => selectCalendarDay(day)}
                          className={`flex h-full w-full items-center justify-center rounded-lg text-sm font-medium transition ${
                            seleccionado
                              ? "bg-[#1f5d38] text-white shadow-md"
                              : disabled
                                ? "cursor-not-allowed bg-[#f3f4f6] text-[#d1d5db]"
                                : "bg-[#f0fdf4] text-[#166534] hover:bg-[#dcfce7]"
                          }`}
                        >
                          {day}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {touched.fechaPreferida && errors.fechaPreferida && (
              <p className={FIELD_ERROR_CLASS} role="alert">
                {errors.fechaPreferida}
              </p>
            )}
          </div>

          {(form.fechaPreferida || (touched.horario && errors.horario)) && (
            <div
              ref={(el) => {
                despuesDeFechaRef.current = el;
                fieldRefs.current.horario = el;
              }}
              className="scroll-mt-6 space-y-3 rounded-xl border border-[#d1fae5] bg-[#f0fdf4] px-4 py-4"
            >
              <p className="text-[14px] leading-relaxed text-[#166534]">
                Seleccioná el rango horario y ese día nos contactaremos para coordinar la hora
                exacta. 
              </p>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                  Rango horario
                </label>
                <select
                  value={form.horario}
                  onChange={(event) => updateField("horario", event.target.value)}
                  onBlur={() => handleBlur("horario")}
                  className={`h-11 w-full rounded-xl border bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4 ${
                    touched.horario && errors.horario
                      ? "border-[#f87171] ring-red-500/15"
                      : "border-[#d1d5db]"
                  }`}
                  aria-invalid={Boolean(touched.horario && errors.horario)}
                >
                  {horariosDisponibles.map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
                </select>
                {touched.horario && errors.horario && (
                  <p className={FIELD_ERROR_CLASS} role="alert">
                    {errors.horario}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-5">
            <p className="text-center text-[15px] font-semibold text-[#101828]">
              El valor de la visita y asesoramiento es{" "}
              <span className="text-[#1f5d38]">{montoVisitaFormateado}</span>
            </p>
          {/*   <p className="mt-2 text-center text-[13px] text-[#6b7280]">
              Importe total de la visita (no es seña). La reserva queda{" "}
              <strong className="text-[#374151]">confirmada solo cuando Mercado Pago acredite el pago</strong>, no
              al volver de la página de pago.
            </p> */}
          </div>

          {submitError && (
            <p
              className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2.5 text-[14px] leading-snug font-medium text-[#b91c1c]"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() =>
                  gaEvent("pagar_reservar_click", {
                    location: "reservar_form",
                    has_fecha_preferida: Boolean(form.fechaPreferida),
                    horario: form.horario,
                  })
                }
                className="rounded-full bg-[#1f5d38] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(31,93,56,0.2)] transition hover:bg-[#18492c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Redirigiendo…" : "Pagar y reservar"}
              </button>
              <HistoryBackLink
                onClick={() => gaEvent("volver_inicio_click", { location: "reservar_footer" })}
                className="rounded-full border border-[#1f5d38]/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38]"
              >
                Volver
              </HistoryBackLink>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
