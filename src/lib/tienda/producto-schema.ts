import { z, type ZodError } from "zod";
import { slugifyTienda } from "@/lib/tienda/slugify";

const medidaSchema = z.object({
  label: z.string().trim().min(1).max(80),
  valor: z.string().trim().min(1).max(120),
});

export const TiendaCategoriaWriteSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresá un nombre.").max(80),
  slug: z.string().trim().max(80).optional(),
  orden: z.coerce.number().int().min(0).max(9999).optional(),
  activa: z.boolean().optional(),
});

export type TiendaCategoriaWriteInput = z.infer<typeof TiendaCategoriaWriteSchema>;

export function normalizeCategoriaWrite(data: TiendaCategoriaWriteInput) {
  const slugSource = data.slug?.trim() || data.nombre;
  return {
    nombre: data.nombre,
    slug: slugifyTienda(slugSource) || undefined,
    orden: data.orden,
    activa: data.activa,
  };
}

export const TiendaProductoWriteSchema = z
  .object({
    nombre: z.string().trim().min(2, "Ingresá el nombre del producto.").max(160),
    slug: z.string().trim().max(80).optional(),
    categoriaId: z.string().trim().min(1, "Elegí una categoría."),
    precioArs: z.coerce
      .number({ message: "Ingresá un precio válido." })
      .int("El precio debe ser un número entero.")
      .min(1, "El precio debe ser mayor a 0.")
      .max(100_000_000),
    imagen: z.string().trim().min(1, "Ingresá la imagen principal (URL o path).").max(500),
    imagenes: z.array(z.string().trim().min(1).max(500)).max(12).optional(),
    descripcion: z
      .union([z.string(), z.array(z.string())])
      .transform((v) => {
        const parts = Array.isArray(v)
          ? v
          : v
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean);
        return parts.length > 0 ? parts : [""];
      })
      .pipe(z.array(z.string().trim().min(1, "Agregá una descripción.")).min(1).max(20)),
    descripcionTitulo: z.string().trim().max(160).optional().or(z.literal("")),
    cuotas: z.coerce.number().int().min(1).max(24).optional().nullable(),
    descuentoTransferenciaPct: z.coerce.number().int().min(0).max(50).optional().nullable(),
    highlights: z.array(z.string().trim().min(1).max(120)).max(12).optional(),
    medidas: z.array(medidaSchema).max(12).optional(),
    stock: z.coerce.number().int().min(0).max(1_000_000).optional().nullable(),
    activo: z.boolean().optional(),
  })
  .transform((data) => {
    const slugRaw = data.slug?.trim();
    const slug = slugRaw && slugRaw.length > 0 ? slugifyTienda(slugRaw) : slugifyTienda(data.nombre);
    const imagenes =
      data.imagenes && data.imagenes.length > 0
        ? data.imagenes.map((u) => u.trim()).filter(Boolean)
        : [data.imagen];
    return {
      ...data,
      slug,
      imagenes,
      descripcionTitulo: data.descripcionTitulo?.trim() || undefined,
      cuotas: data.cuotas ?? undefined,
      descuentoTransferenciaPct:
        data.descuentoTransferenciaPct === null || data.descuentoTransferenciaPct === undefined
          ? undefined
          : data.descuentoTransferenciaPct,
      stock: data.stock === undefined ? null : data.stock,
      activo: data.activo ?? true,
      highlights: data.highlights?.filter(Boolean),
      medidas: data.medidas,
    };
  });

export type TiendaProductoWrite = z.infer<typeof TiendaProductoWriteSchema>;

export const TiendaProductoPatchSchema = z
  .object({
    nombre: z.string().trim().min(2).max(160).optional(),
    slug: z.string().trim().max(80).optional(),
    categoriaId: z.string().trim().min(1).optional(),
    precioArs: z.coerce.number().int().min(1).max(100_000_000).optional(),
    imagen: z.string().trim().min(1).max(500).optional(),
    imagenes: z.array(z.string().trim().min(1).max(500)).max(12).optional(),
    descripcion: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        const parts = Array.isArray(v)
          ? v
          : v
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean);
        return parts;
      }),
    descripcionTitulo: z.string().trim().max(160).optional().nullable(),
    cuotas: z.coerce.number().int().min(1).max(24).optional().nullable(),
    descuentoTransferenciaPct: z.coerce.number().int().min(0).max(50).optional().nullable(),
    highlights: z.array(z.string().trim().min(1).max(120)).max(12).optional().nullable(),
    medidas: z.array(medidaSchema).max(12).optional().nullable(),
    stock: z.coerce.number().int().min(0).max(1_000_000).optional().nullable(),
    activo: z.boolean().optional(),
  })
  .transform((data) => {
    const out: Record<string, unknown> = { ...data };
    if (typeof data.slug === "string" && data.slug.trim()) {
      out.slug = slugifyTienda(data.slug);
    } else if (data.slug !== undefined) {
      delete out.slug;
    }
    if (data.nombre && !data.slug) {
      // slug only auto on create; patch keeps existing unless provided
    }
    if (data.descripcionTitulo === "") out.descripcionTitulo = null;
    return out;
  });

export function formatTiendaValidationError(error: ZodError): string {
  return error.issues[0]?.message ?? "Revisá los datos.";
}
