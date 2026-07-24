import { z, type ZodError } from "zod";

export const TIENDA_ENTREGA_OPTIONS = [
  { id: "retiro", label: "Retiro en Bahía Blanca", hint: "Coordinamos día y horario por WhatsApp" },
  {
    id: "envio",
    label: "Envío a coordinar",
    hint: "Guillermo te contacta para acordar la entrega",
  },
] as const;

export type TiendaEntregaId = (typeof TIENDA_ENTREGA_OPTIONS)[number]["id"];

export const TiendaCheckoutSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "Ingresá tu nombre y apellido.")
    .max(120, "El nombre es demasiado largo."),
  celular: z
    .string()
    .trim()
    .min(8, "Ingresá un celular válido con código de área.")
    .max(30, "El celular parece demasiado largo."),
  email: z
    .string()
    .trim()
    .max(120, "El email es demasiado largo.")
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Ingresá un email válido.",
    }),
  notas: z
    .string()
    .trim()
    .min(5, "Ingresá tu dirección.")
    .max(500, "La dirección es demasiado larga."),
  entrega: z.enum(["retiro", "envio"], {
    message: "Elegí cómo querés recibir el pedido.",
  }),
});

export type TiendaCheckoutInput = z.infer<typeof TiendaCheckoutSchema>;

export function formatTiendaCheckoutValidationError(error: ZodError): string {
  return error.issues[0]?.message ?? "Revisá los datos del pedido.";
}

export function normalizeTiendaCheckoutInput(raw: {
  nombre: string;
  celular: string;
  email: string;
  notas: string;
  entrega: string;
}): unknown {
  return {
    nombre: raw.nombre,
    celular: raw.celular,
    email: raw.email.trim() || "",
    notas: raw.notas.trim(),
    entrega: raw.entrega,
  };
}
