"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  HORARIO_OPTIONS,
  MOTIVO_OPTIONS,
  RESERVA_VISITA_MONTO_ARS,
  TurnoCreateSchema,
  type TurnoCreateInput,
} from "@/lib/turnos";

type FormState = TurnoCreateInput;

type ErrorState = Partial<Record<keyof FormState, string>>;
type TouchedState = Partial<Record<keyof FormState, boolean>>;

const initialForm: FormState = {
  nombre: "",
  celular: "",
  direccion: "",
  motivo: MOTIVO_OPTIONS[0].value,
  horario: HORARIO_OPTIONS[0],
  aceptaPagoReserva: false,
};

const montoReservaFormateado = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
}).format(RESERVA_VISITA_MONTO_ARS);

export default function ReservarPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const horariosDisponibles = useMemo(() => HORARIO_OPTIONS, []);

  function validateForm(values: FormState) {
    return TurnoCreateSchema.safeParse(values);
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: keyof FormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateForm(form);

    if (validation.success) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return;
    }

    const issue = validation.error.issues.find((i) => i.path[0] === field);
    setErrors((prev) => ({ ...prev, [field]: issue?.message }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    const validation = validateForm(form);
    if (!validation.success) {
      const nextErrors: ErrorState = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setTouched({
        nombre: true,
        celular: true,
        direccion: true,
        motivo: true,
        horario: true,
        aceptaPagoReserva: true,
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
          "motivo",
          "horario",
          "aceptaPagoReserva",
        ]);
        const nextErrors: ErrorState = {};
        for (const issue of issues) {
          const key = issue.path[0];
          if (typeof key === "string" && formKeys.has(key)) {
            const f = key as keyof FormState;
            if (!nextErrors[f]) nextErrors[f] = issue.message;
          }
        }
        if (Object.keys(nextErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...nextErrors }));
          setTouched({
            nombre: true,
            celular: true,
            direccion: true,
            motivo: true,
            horario: true,
            aceptaPagoReserva: true,
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
        "Tu visita se agendó con éxito. Te vamos a contactar por WhatsApp con el link o los datos para abonar la seña con Mercado Pago y confirmar el turno.",
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

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,246,241,0.96))] p-6 shadow-[0_18px_46px_rgba(31,41,55,0.08)] md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b6a3c]">
          Reserva de visita
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#101828] md:text-4xl">
          Agendar visita
        </h1>
        <p className="mt-3 text-[15px] leading-6 text-[#4b5563]">
          Completá dirección y celular. Seña de{" "}
          <strong className="text-[#101828]">{montoReservaFormateado}</strong> con{" "}
          <strong className="text-[#101828]">Mercado Pago</strong> para confirmar la visita; el turno
          lo coordinás por <strong className="text-[#101828]">WhatsApp</strong> con Guillermo.
        </p>
        <p className="mt-2 text-[13px] text-[#6b7280]">
          💳 Pronto vas a poder abonar la seña desde esta misma página.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
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

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Motivo de consulta
            </label>
            <select
              value={form.motivo}
              onChange={(event) =>
                updateField("motivo", event.target.value as FormState["motivo"])
              }
              onBlur={() => handleBlur("motivo")}
              className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4"
              aria-invalid={Boolean(errors.motivo)}
            >
              {MOTIVO_OPTIONS.map((motivo) => (
                <option key={motivo.value} value={motivo.value}>
                  {motivo.label}
                </option>
              ))}
            </select>
            {touched.motivo && errors.motivo && (
              <p className="mt-1 text-xs text-[#b91c1c]">{errors.motivo}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Horario
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

          <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.aceptaPagoReserva}
                onChange={(event) =>
                  updateField("aceptaPagoReserva", event.target.checked)
                }
                onBlur={() => handleBlur("aceptaPagoReserva")}
                className="mt-1 h-4 w-4 shrink-0 rounded border-[#d1d5db] text-[#1f5d38] focus:ring-[#1f5d38]"
                aria-invalid={Boolean(errors.aceptaPagoReserva)}
              />
              <span className="text-[14px] leading-6 text-[#374151]">
                Acepto abonar la <strong>seña de {montoReservaFormateado}</strong> con{" "}
                <strong>Mercado Pago</strong> para reservar la visita. Entiendo que, una vez
                acreditado el pago, me van a contactar por <strong>WhatsApp</strong> para confirmar
                día y hora.
              </span>
            </label>
            {touched.aceptaPagoReserva && errors.aceptaPagoReserva && (
              <p className="mt-2 text-xs text-[#b91c1c]">{errors.aceptaPagoReserva}</p>
            )}
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

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#1f5d38] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(31,93,56,0.2)] transition hover:bg-[#18492c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Enviando..." : "Enviar solicitud de reserva"}
              </button>
              <Link
                href="/"
                className="rounded-full border border-[#1f5d38]/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38]"
              >
                Volver
              </Link>
            </div>
            <p className="text-[12px] leading-5 text-[#6b7280]">
              Por ahora solo enviamos tu solicitud; el pago con Mercado Pago se agrega después.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

