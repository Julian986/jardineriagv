"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  HORARIO_OPTIONS,
  MOTIVO_OPTIONS,
  TurnoCreateSchema,
  type TurnoCreateInput,
} from "@/lib/turnos";

type FormState = TurnoCreateInput;

type ErrorState = Partial<Record<keyof FormState, string>>;
type TouchedState = Partial<Record<keyof FormState, boolean>>;

const initialForm: FormState = {
  nombre: "",
  mail: "",
  celular: "",
  motivo: MOTIVO_OPTIONS[0].value,
  horario: HORARIO_OPTIONS[0],
};

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
        mail: true,
        celular: true,
        motivo: true,
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

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setSubmitError(data.error ?? "No pudimos registrar la reserva.");
        return;
      }

      setSuccessMessage("Reserva enviada con éxito. Te vamos a contactar a la brevedad.");
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
        <p className="mt-3 text-[15px] leading-7 text-[#4b5563]">
          Completá el formulario y registramos tu solicitud. Te contactamos para confirmar la reserva.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                Mail
              </label>
              <input
                value={form.mail}
                onChange={(event) => updateField("mail", event.target.value)}
                onBlur={() => handleBlur("mail")}
                className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4"
                aria-invalid={Boolean(errors.mail)}
              />
              {touched.mail && errors.mail && (
                <p className="mt-1 text-xs text-[#b91c1c]">{errors.mail}</p>
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

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#1f5d38] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(31,93,56,0.2)] transition hover:bg-[#18492c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Confirmar reserva"}
            </button>
            <Link
              href="/"
              className="rounded-full border border-[#1f5d38]/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38]"
            >
              Volver
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

