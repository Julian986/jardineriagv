import { z, type ZodError } from "zod";
import { MADERA_VARIANTES } from "@/lib/madera-productos";
import { calcMaderaCheckoutAmounts, getMaderaPrecioMetroLinealArsPublic } from "@/lib/madera/pricing";

const VARIANTE_IDS = MADERA_VARIANTES.map((v) => v.id) as [string, ...string[]];

export const MaderaPedidoCreateSchema = z.object({
  productoId: z.enum(VARIANTE_IDS, { message: "Elegí un espesor de estante." }),
  metrosLineales: z
    .number({ message: "Ingresá los metros lineales." })
    .min(0.5, "El mínimo es 0,5 metro lineal.")
    .max(100, "Para pedidos mayores consultanos por WhatsApp."),
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
  notas: z.string().trim().max(500, "La nota es demasiado larga.").optional(),
});

export type MaderaPedidoCreateInput = z.infer<typeof MaderaPedidoCreateSchema>;

export function formatMaderaPedidoValidationError(error: ZodError): string {
  return error.issues[0]?.message ?? "Revisá los datos del pedido.";
}

export function buildMaderaPedidoCodigo(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `MADERA-${n}`;
}

export function buildMaderaPedidoDetalle(input: MaderaPedidoCreateInput): string {
  const variante = MADERA_VARIANTES.find((v) => v.id === input.productoId);
  const medidas = variante?.medidasLabel ?? input.productoId;
  const metros = input.metrosLineales.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const parts = [
    `Estantes flotantes de pinotea — ${medidas}`,
    `${metros} m lineales`,
    `${input.nombre} · ${input.celular}`,
  ];
  if (input.notas?.trim()) parts.push(input.notas.trim());
  return parts.join(" · ");
}

export function buildMaderaAmountsForInput(input: MaderaPedidoCreateInput) {
  return calcMaderaCheckoutAmounts(input.metrosLineales, getMaderaPrecioMetroLinealArsPublic());
}
