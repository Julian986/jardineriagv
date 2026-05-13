"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DIAS_SEMANA_RESERVA_PERMITIDOS,
  HORARIO_OPTIONS,
  RESERVA_VISITA_MONTO_ARS,
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

const initialForm: FormFields = {
  nombre: "",
  celular: "",
  direccion: "",
  fechaPreferida: "",
  horario: HORARIO_OPTIONS[0],
};

const montoVisitaFormateado = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
}).format(RESERVA_VISITA_MONTO_ARS);

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
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [cursorMonth, setCursorMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const horariosDisponibles = useMemo(() => HORARIO_OPTIONS, []);

  const calendarWeeks = useMemo(
    () => buildMonthWeeks(cursorMonth.getFullYear(), cursorMonth.getMonth()),
    [cursorMonth],
  );

  function validateForm(values: FormFields) {
    return TurnoCreateSchema.safeParse(values);
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
    setSuccessMessage("");

    const validation = validateForm(form);
    if (!validation.success) {
      const nextErrors: ErrorState = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof FormFields;
        if (typeof field === "string" && field in initialForm && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      setTouched({
        nombre: true,
        celular: true,
        direccion: true,
        fechaPreferida: true,
        horario: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        issues?: { path: string[]; message: string }[];
      };

      if (!response.ok || !data.ok) {
        const issues = data.issues ?? [];
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
          setErrors((prev) => ({ ...prev, ...nextErrors }));
          setTouched({
            nombre: true,
            celular: true,
            direccion: true,
            fechaPreferida: true,
            horario: true,
          });
          setSubmitError("");
        } else {
          setSubmitError(
            data.error?.trim() ||
              "No pudimos registrar la reserva. Revisá los datos e intentá de nuevo.",
          );
        }
        return;
      }

      setSuccessMessage(
        "Tu visita se registró con éxito. Te vamos a contactar por WhatsApp para coordinar la hora exacta y el pago con Mercado Pago.",
      );
      setForm(initialForm);
      setErrors({});
      setTouched({});
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
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="inline-flex items-center gap-2 rounded-full border border-[#1f5d38]/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38] transition hover:bg-[#f0fdf4]"
          >
            <span aria-hidden className="text-sm leading-none">
              ←
            </span>
            Volver
          </Link>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6a3c]">
          Reserva de visita
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#101828] md:text-4xl">
          Agendar visita
        </h1>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Nombre y apellido
            </label>
            <input
              value={form.nombre}
              onChange={(event) => updateField("nombre", event.target.value)}
              onBlur={() => handleBlur("nombre")}
              className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4"
              aria-invalid={Boolean(errors.nombre)}
            />
            {touched.nombre && errors.nombre && (
              <p className="mt-1 text-xs text-[#b91c1c]">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Celular
            </label>
            <input
              value={form.celular}
              onChange={(event) => updateField("celular", event.target.value)}
              onBlur={() => handleBlur("celular")}
              className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4"
              aria-invalid={Boolean(errors.celular)}
            />
            {touched.celular && errors.celular && (
              <p className="mt-1 text-xs text-[#b91c1c]">{errors.celular}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Direccion
            </label>
            <textarea
              value={form.direccion}
              onChange={(event) => updateField("direccion", event.target.value)}
              onBlur={() => handleBlur("direccion")}
              rows={3}
              placeholder="Ej: Mitre 1234, entre calles X e Y, Bahía Blanca"
              className="w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4"
              aria-invalid={Boolean(errors.direccion)}
            />
            {touched.direccion && errors.direccion && (
              <p className="mt-1 text-xs text-[#b91c1c]">{errors.direccion}</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
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
              <p className="mt-3 text-xs text-[#b91c1c]">{errors.fechaPreferida}</p>
            )}
          </div>

          {form.fechaPreferida && (
            <div className="space-y-3 rounded-xl border border-[#d1fae5] bg-[#f0fdf4] px-4 py-4">
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
                  className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4"
                  aria-invalid={Boolean(errors.horario)}
                >
                  {horariosDisponibles.map((horario) => (
                    <option key={horario} value={horario}>
                      {horario}
                    </option>
                  ))}
                </select>
                {touched.horario && errors.horario && (
                  <p className="mt-1 text-xs text-[#b91c1c]">{errors.horario}</p>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[#e5e7eb] bg-[#fafafa] p-5">
            <p className="text-center text-[15px] font-semibold text-[#101828]">
              El valor de la visita y asesoramiento es de{" "}
              <span className="text-[#1f5d38]">{montoVisitaFormateado}</span>
            </p>
            <p className="mt-2 text-center text-[13px] text-[#6b7280]">
              Importe total de la visita (no es seña).
            </p>
          </div>

          {submitError && (
            <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b91c1c]">
              {submitError}
            </p>
          )}

          {successMessage && (
            <p className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">
              {successMessage}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#1f5d38] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(31,93,56,0.2)] transition hover:bg-[#18492c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Procesando..." : "Pagar y reservar"}
              </button>
              <Link
                href="/"
                className="rounded-full border border-[#1f5d38]/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38]"
              >
                Volver
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
