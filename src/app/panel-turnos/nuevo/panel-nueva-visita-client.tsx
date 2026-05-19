"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  PANEL_WEEK_LETTERS,
  buildPanelMonthGrid,
  panelMonthTitle,
} from "@/lib/booking/panel-month-grid";
import {
  DIAS_SEMANA_RESERVA_PERMITIDOS,
  HORARIO_OPTIONS,
  PanelTurnoCreateSchema,
  formatFechaPreferidaAR,
} from "@/lib/turnos";

type FormState = {
  nombre: string;
  celular: string;
  fechaPreferida: string;
  horario: string;
  notaInterna: string;
};

const initialForm: FormState = {
  nombre: "",
  celular: "",
  fechaPreferida: "",
  horario: HORARIO_OPTIONS[0],
  notaInterna: "",
};

function startOfTodayLocal(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

export function PanelNuevaVisitaClient() {
  const router = useRouter();
  const today = useMemo(() => startOfTodayLocal(), []);

  const [form, setForm] = useState<FormState>(initialForm);
  const [cursorMonth, setCursorMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const grid = useMemo(
    () => buildPanelMonthGrid(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1),
    [cursorMonth],
  );

  const hasDate = Boolean(form.fechaPreferida);

  useEffect(() => {
    if (!form.fechaPreferida) return;
    const id = window.setTimeout(() => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      window.scrollTo({ top: maxScroll, behavior: "smooth" });
    }, 100);
    return () => window.clearTimeout(id);
  }, [form.fechaPreferida]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function selectCalendarDay(dateKey: string) {
    updateField("fechaPreferida", dateKey);
  }

  function prevMonth() {
    const y = cursorMonth.getFullYear();
    const m = cursorMonth.getMonth();
    if (m === 0) setCursorMonth(new Date(y - 1, 11, 1));
    else setCursorMonth(new Date(y, m - 1, 1));
  }

  function nextMonth() {
    const y = cursorMonth.getFullYear();
    const m = cursorMonth.getMonth();
    if (m === 11) setCursorMonth(new Date(y + 1, 0, 1));
    else setCursorMonth(new Date(y, m + 1, 1));
  }

  async function handleSubmit() {
    setError(null);
    const parsed = PanelTurnoCreateSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      setError("Revisá los datos marcados.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/panel-turnos/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        issues?: { path: string[]; message: string }[];
        id?: string;
      };

      if (!res.ok || !data.ok) {
        if (data.issues?.length) {
          const next: Record<string, string> = {};
          for (const issue of data.issues) {
            const key = issue.path[0];
            if (key && !next[key]) next[key] = issue.message;
          }
          setFieldErrors(next);
        }
        setError(data.error ?? "No se pudo guardar la visita.");
        return;
      }

      router.push("/panel-turnos");
      router.refresh();
    } catch {
      setError("Sin conexión. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1a12] pb-28 text-[#e8f0e9]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <header className="mb-5 flex items-center gap-3">
          <Link
            href="/panel-turnos"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#1a2e1a] text-[#e8f0e9]/88 hover:bg-[#223822]"
            aria-label="Volver al panel"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.85} />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold leading-tight text-[#c4933f]">Nueva visita</h1>
            <p className="mt-0.5 text-[12px] text-[#a8c4a8]/55">Alta manual · sin pago online</p>
          </div>
        </header>

        <section className="rounded-[28px] border border-white/8 bg-[#1a2e1a] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.38)]">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#a8c4a8]/55">
            Día de la visita
          </p>
          <p className="mb-4 text-[13px] leading-relaxed text-[#a8c4a8]/70">
            Solo lunes, miércoles y viernes.
          </p>

          <div className="relative mb-3 flex items-center justify-center px-10">
            <button
              type="button"
              onClick={prevMonth}
              className="absolute left-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#a8c4a8]/70 hover:bg-white/5"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-center text-[15px] font-semibold capitalize text-[#e8f0e9]">
              {panelMonthTitle(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1)}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="absolute right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#a8c4a8]/70 hover:bg-white/5"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold text-[#a8c4a8]/45">
            {PANEL_WEEK_LETTERS.map((L) => (
              <div key={L} className="py-1">
                {L}
              </div>
            ))}
          </div>

          <div className="mt-1 space-y-1">
            {Array.from({ length: Math.ceil(grid.length / 7) }, (_, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {grid.slice(wi * 7, wi * 7 + 7).map((cell) => {
                  if (!cell.inMonth) {
                    return <div key={`e-${cell.dateKey}`} className="aspect-square p-0.5" />;
                  }
                  const [y, mo, d] = cell.dateKey.split("-").map(Number);
                  const cellDate = new Date(y, mo - 1, d, 12, 0, 0, 0);
                  const dow = cellDate.getDay();
                  const permitido = DIAS_SEMANA_RESERVA_PERMITIDOS.includes(
                    dow as (typeof DIAS_SEMANA_RESERVA_PERMITIDOS)[number],
                  );
                  const pasado = cellDate < today;
                  const disabled = !permitido || pasado;
                  const seleccionado = form.fechaPreferida === cell.dateKey;

                  return (
                    <div key={cell.dateKey} className="aspect-square p-0.5">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => selectCalendarDay(cell.dateKey)}
                        className={`flex h-full w-full items-center justify-center rounded-lg text-sm font-medium transition ${
                          seleccionado
                            ? "bg-gradient-to-br from-[#1f5d38] to-[#2d5016] text-white shadow-md"
                            : disabled
                              ? "cursor-not-allowed bg-[#141f14] text-[#a8c4a8]/25"
                              : "bg-[#223822] text-[#c8e6c8] hover:bg-[#2a452a]"
                        }`}
                      >
                        {cell.day}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {fieldErrors.fechaPreferida ? (
            <p className="mt-2 text-xs text-red-300/95">{fieldErrors.fechaPreferida}</p>
          ) : null}
        </section>

        {hasDate ? (
          <section className="mt-6 space-y-4 rounded-[28px] border border-white/8 bg-[#1a2e1a] px-4 py-4 shadow-[0_10px_32px_rgba(0,0,0,0.32)]">
            <p className="text-[12px] text-[#a8c4a8]/70">
              {formatFechaPreferidaAR(form.fechaPreferida)}
            </p>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#a8c4a8]/55">
                Rango horario
              </span>
              <select
                value={form.horario}
                onChange={(e) => updateField("horario", e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-[#141f14] px-3 text-[14px] text-[#e8f0e9] outline-none"
              >
                {HORARIO_OPTIONS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              {fieldErrors.horario ? (
                <p className="mt-1 text-xs text-red-300/95">{fieldErrors.horario}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#a8c4a8]/55">
                Nombre y apellido
              </span>
              <input
                value={form.nombre}
                onChange={(e) => updateField("nombre", e.target.value)}
                autoComplete="name"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141f14] px-3 py-3 text-[15px] text-[#e8f0e9] outline-none focus:border-[#c4933f]/55"
              />
              {fieldErrors.nombre ? (
                <p className="mt-1 text-xs text-red-300/95">{fieldErrors.nombre}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#a8c4a8]/55">
                Celular / WhatsApp (opcional)
              </span>
              <input
                type="tel"
                value={form.celular}
                onChange={(e) => updateField("celular", e.target.value)}
                autoComplete="tel"
                placeholder="Ej: 291 1234567"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#141f14] px-3 py-3 text-[15px] text-[#e8f0e9] outline-none focus:border-[#c4933f]/55"
              />
              {fieldErrors.celular ? (
                <p className="mt-1 text-xs text-red-300/95">{fieldErrors.celular}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#a8c4a8]/55">
                Nota interna (opcional)
              </span>
              <textarea
                value={form.notaInterna}
                onChange={(e) => updateField("notaInterna", e.target.value)}
                rows={2}
                placeholder="Solo visible en el panel…"
                className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-[#141f14] px-3 py-2 text-[14px] text-[#e8f0e9] outline-none"
              />
            </label>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-red-500/35 bg-red-950/35 px-3 py-2.5 text-center text-[12px] text-red-200/95"
              >
                {error}
              </p>
            ) : null}

            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleSubmit()}
              className="flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#1f5d38] to-[#2d5016] text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(31,93,56,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-5 w-5" strokeWidth={2.25} />
              {submitting ? "Guardando…" : "Confirmar visita"}
            </button>
            <div className="h-0 w-full shrink-0" aria-hidden />
          </section>
        ) : (
          <p className="mt-6 text-center text-[14px] text-[#a8c4a8]/55">
            Elegí un día en el calendario para continuar.
          </p>
        )}
      </div>
    </div>
  );
}
