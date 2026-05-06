import { z, type ZodError } from "zod";

export const TURNO_ESTADOS = [
  "pendiente",
  "contactado",
  "confirmado",
  "cancelado",
] as const;

export const MOTIVO_OPTIONS = [
  {
    value: "jardin_desde_cero",
    label: "Jardín desde cero",
  },
  {
    value: "riego",
    label: "Riego",
  },
  {
    value: "decoracion_plantas_macetas",
    label: "Decoración con plantas y macetas",
  },
] as const;

export const HORARIO_OPTIONS = [
  "Lunes a viernes - 09:00 a 12:00",
  "Lunes a viernes - 14:00 a 17:00",
  "Sábados - 10:00",
] as const;

const MOTIVO_VALUES = [
  "jardin_desde_cero",
  "riego",
  "decoracion_plantas_macetas",
] as const;

/** Monto que el cliente acepta abonar al agendar la visita (ARS). */
export const RESERVA_VISITA_MONTO_ARS = 25_000;

const msg = {
  nombreReq: "Ingresá tu nombre y apellido.",
  nombreMin: "El nombre debe tener al menos 3 letras.",
  celularReq: "Ingresá tu número de celular.",
  celularMin: "El celular parece incompleto. Incluí código de área.",
  direccionReq: "Ingresá la dirección donde querés la visita.",
  direccionMin: "La dirección es muy corta. Incluí calle, número y barrio o ciudad.",
  motivo: "Elegí un motivo de consulta.",
  horarioReq: "Elegí un horario de preferencia.",
  horarioMin: "Elegí un horario de la lista.",
  pagoReserva:
    "Tenés que marcar la casilla para aceptar abonar la seña de $ 25.000 con Mercado Pago.",
} as const;

export const TurnoCreateSchema = z.object({
  nombre: z
    .string({ message: msg.nombreReq })
    .trim()
    .min(3, msg.nombreMin),
  celular: z
    .string({ message: msg.celularReq })
    .trim()
    .min(8, msg.celularMin),
  direccion: z
    .string({ message: msg.direccionReq })
    .trim()
    .min(10, msg.direccionMin),
  motivo: z.enum(MOTIVO_VALUES, { message: msg.motivo }),
  horario: z
    .string({ message: msg.horarioReq })
    .trim()
    .min(3, msg.horarioMin)
    .refine((h) => (HORARIO_OPTIONS as readonly string[]).includes(h), {
      message: "Elegí un horario válido de la lista.",
    }),
  aceptaPagoReserva: z
    .boolean({ message: msg.pagoReserva })
    .refine((v) => v === true, { message: msg.pagoReserva }),
});

export const TurnoPatchSchema = z
  .object({
    estado: z.enum(TURNO_ESTADOS).optional(),
    notaInterna: z.string().max(800).optional(),
    canceladoPor: z.string().max(120).optional(),
    motivoCancelacion: z.string().max(300).optional(),
  })
  .refine((value) => Object.values(value).some((v) => v !== undefined), {
    message: "No hay cambios para guardar",
  });

export type TurnoCreateInput = z.infer<typeof TurnoCreateSchema>;
export type TurnoPatchInput = z.infer<typeof TurnoPatchSchema>;

/** Mensaje único para mostrar al usuario (formulario o API). */
export function formatTurnoCreateValidationError(error: ZodError): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const issue of error.issues) {
    const m = issue.message?.trim();
    if (!m || seen.has(m)) continue;
    seen.add(m);
    parts.push(m);
  }
  return parts.length > 0
    ? parts.join(" ")
    : "Revisá los datos del formulario e intentá de nuevo.";
}

export function getMotivoLabel(motivo: TurnoCreateInput["motivo"]): string {
  return MOTIVO_OPTIONS.find((m) => m.value === motivo)?.label ?? motivo;
}

export function buildTurnoDetalle(input: TurnoCreateInput): string {
  const dir = input.direccion.replace(/\s+/g, " ").trim();
  return `${getMotivoLabel(input.motivo)} · ${input.horario} · ${dir}`;
}

export function buildTurnoCodigo(): string {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `T-${Date.now().toString().slice(-6)}-${random}`;
}

export function normalizePhoneForWhatsApp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  let normalized = digits;

  if (normalized.startsWith("00")) normalized = normalized.slice(2);
  if (normalized.startsWith("549")) {
    // already normalized
  } else if (normalized.startsWith("54")) {
    normalized = `549${normalized.slice(2)}`;
  } else if (normalized.startsWith("9")) {
    normalized = `54${normalized}`;
  } else if (normalized.startsWith("0")) {
    normalized = `549${normalized.slice(1)}`;
  } else {
    normalized = `549${normalized}`;
  }

  if (normalized.length < 12 || normalized.length > 15) return null;
  return normalized;
}

