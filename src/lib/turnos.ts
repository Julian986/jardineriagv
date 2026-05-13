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

/** getDay(): 0=dom … 6=sáb — visitas solo lunes, miércoles y viernes */
export const DIAS_SEMANA_RESERVA_PERMITIDOS = [1, 3, 5] as const;

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
  fechaReq: "Elegí un día para la visita (lunes, miércoles o viernes).",
  fechaInvalida: "Solo podés elegir lunes, miércoles o viernes.",
  fechaPasado: "Elegí una fecha desde hoy en adelante.",
  horarioReq: "Elegí un horario de preferencia.",
  horarioMin: "Elegí un horario de la lista.",
} as const;

function parseIsoDateLocal(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const date = new Date(y, mo, d, 12, 0, 0, 0);
  if (date.getFullYear() !== y || date.getMonth() !== mo || date.getDate() !== d)
    return null;
  return date;
}

function startOfTodayLocal(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

export function formatFechaPreferidaAR(isoDate: string): string {
  const d = parseIsoDateLocal(isoDate);
  if (!d) return isoDate;
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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
  fechaPreferida: z
    .string({ message: msg.fechaReq })
    .trim()
    .min(10, msg.fechaReq)
    .superRefine((val, ctx) => {
      const parsed = parseIsoDateLocal(val);
      if (!parsed) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg.fechaReq,
          path: ["fechaPreferida"],
        });
        return;
      }
      const today = startOfTodayLocal();
      if (parsed < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg.fechaPasado,
          path: ["fechaPreferida"],
        });
        return;
      }
      const dow = parsed.getDay();
      if (!(DIAS_SEMANA_RESERVA_PERMITIDOS as readonly number[]).includes(dow)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg.fechaInvalida,
          path: ["fechaPreferida"],
        });
      }
    }),
  horario: z
    .string({ message: msg.horarioReq })
    .trim()
    .min(3, msg.horarioMin)
    .refine((h) => (HORARIO_OPTIONS as readonly string[]).includes(h), {
      message: "Elegí un horario válido de la lista.",
    }),
  /** Sin campo en el formulario: valor por defecto para registros históricos / panel */
  motivo: z.enum(MOTIVO_VALUES).default("jardin_desde_cero"),
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
  const fechaFmt = formatFechaPreferidaAR(input.fechaPreferida);
  return `${fechaFmt} · ${input.horario} · ${dir}`;
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

