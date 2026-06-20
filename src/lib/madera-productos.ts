/** Estantes flotantes de pinotea — variantes y precio (texto del cliente). */

export const MADERA_PRECIO_METRO_LINEAL_ARS = 130_000;

export const MADERA_PRODUCTO_TITULO = "Estantes flotantes de pinotea";

export const MADERA_VARIANTES = [
  {
    id: "estante-pinotea-5cm",
    anchoCm: 13.5,
    espesorCm: 5,
    medidasLabel: "13,5 cm de ancho × 5 cm de espesor",
  },
  {
    id: "estante-pinotea-2-5cm",
    anchoCm: 13,
    espesorCm: 2.5,
    medidasLabel: "15 cm de ancho × 2,5 cm de espesor",
  },
] as const;

export type MaderaVarianteId = (typeof MADERA_VARIANTES)[number]["id"];

export function getMaderaVarianteById(id: string) {
  return MADERA_VARIANTES.find((v) => v.id === id);
}
