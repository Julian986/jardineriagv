import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export function assertTiendaImageFile(file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Formato no permitido. Usá JPG, PNG o WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("La imagen pesa demasiado (máx. 4 MB).");
  }
}

function buildFilename(ext: string) {
  const stamp = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `tienda-${stamp}-${rand}.${ext}`;
}

function extFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

/**
 * Sube a Vercel Blob si hay token.
 * En local sin token: guarda en public/uploads/tienda.
 * En Vercel / producción serverless: Blob es obligatorio (el filesystem es de solo lectura).
 */
export async function uploadTiendaImage(file: File): Promise<{ url: string; storage: "blob" | "local" }> {
  assertTiendaImageFile(file);
  const ext = extFromType(file.type);
  const filename = buildFilename(ext);
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const onVercel = Boolean(process.env.VERCEL);

  if (token) {
    const blob = await put(`tienda/${filename}`, file, {
      access: "public",
      token,
      contentType: file.type,
    });
    return { url: blob.url, storage: "blob" };
  }

  if (onVercel || process.env.NODE_ENV === "production") {
    throw new Error(
      "Falta configurar BLOB_READ_WRITE_TOKEN en Vercel. Sin eso no se pueden subir imágenes en producción.",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads", "tienda");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return { url: `/uploads/tienda/${filename}`, storage: "local" };
}
