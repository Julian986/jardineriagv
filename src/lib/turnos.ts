import { z } from "zod";

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

export const TurnoCreateSchema = z.object({
  nombre: z.string().trim().min(3, "Ingresá nombre y apellido"),
  mail: z.string().trim().email("Ingresá un mail válido"),
  celular: z.string().trim().min(8, "Ingresá un celular válido"),
  motivo: z.enum(MOTIVO_VALUES),
  horario: z.string().trim().min(3, "Seleccioná un horario"),
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

export function getMotivoLabel(motivo: TurnoCreateInput["motivo"]): string {
  return MOTIVO_OPTIONS.find((m) => m.value === motivo)?.label ?? motivo;
}

export function buildTurnoDetalle(input: TurnoCreateInput): string {
  return `${getMotivoLabel(input.motivo)} · ${input.horario}`;
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

