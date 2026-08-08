"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, Plus, Save, Trash2 } from "lucide-react";
import { PanelImageField } from "@/components/panel-tienda/PanelImageField";
import { PanelImageGalleryField } from "@/components/panel-tienda/PanelImageGalleryField";
import { PanelTiendaShell } from "@/components/panel-tienda/PanelTiendaShell";
import { slugifyTienda } from "@/lib/tienda/slugify";
import type { TiendaCategoria, TiendaProducto } from "@/lib/tienda/types";

type ColorDraft = {
  id?: string;
  nombre: string;
  hex: string;
  imagen: string;
};

const INPUT =
  "mt-1.5 h-12 w-full rounded-xl border border-[#dce1da] bg-white px-3.5 text-base text-[#20231f] outline-none placeholder:text-[#a2a79f] focus:border-[#6f8b68] focus:ring-2 focus:ring-[#dce8d8] sm:text-sm";
const TEXTAREA = `${INPUT} h-auto min-h-28 py-3`;
const LABEL = "text-sm font-semibold text-[#343833]";
const SECTION = "rounded-2xl border border-[#e0e4dd] bg-white p-4 shadow-sm sm:p-5";

type Props = {
  mode: "create" | "edit";
  productoId?: string;
};

export function PanelTiendaProductoForm({ mode, productoId }: Props) {
  const router = useRouter();
  const [categorias, setCategorias] = useState<TiendaCategoria[]>([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categoriaId, setCategoriaId] = useState("");
  const [precioArs, setPrecioArs] = useState("");
  const [imagen, setImagen] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [descripcionTitulo, setDescripcionTitulo] = useState("");
  const [cuotas, setCuotas] = useState("");
  const [descuento, setDescuento] = useState("10");
  const [highlightsText, setHighlightsText] = useState("");
  const [medidasText, setMedidasText] = useState("");
  const [colores, setColores] = useState<ColorDraft[]>([]);
  const [stock, setStock] = useState("");
  const [activo, setActivo] = useState(true);

  const autoSlug = useMemo(() => slugifyTienda(nombre), [nombre]);

  useEffect(() => {
    if (!slugTouched) setSlug(autoSlug);
  }, [autoSlug, slugTouched]);

  useEffect(() => {
    async function init() {
      try {
        const catRes = await fetch("/api/tienda/categorias?admin=1");
        if (catRes.status === 401) {
          router.replace("/panel-tienda/login");
          return;
        }
        const catData = (await catRes.json()) as {
          ok?: boolean;
          categorias?: TiendaCategoria[];
        };
        const cats = catData.categorias ?? [];
        setCategorias(cats);
        if (mode === "create" && cats[0]) setCategoriaId(cats[0].id);

        if (mode === "edit" && productoId) {
          const res = await fetch(`/api/tienda/productos/${productoId}`);
          if (res.status === 401) {
            router.replace("/panel-tienda/login");
            return;
          }
          const data = (await res.json()) as {
            ok?: boolean;
            producto?: TiendaProducto;
            error?: string;
          };
          if (!res.ok || !data.producto) {
            setError(data.error ?? "Producto no encontrado");
            return;
          }
          const p = data.producto;
          setNombre(p.nombre);
          setSlug(p.slug);
          setSlugTouched(true);
          setCategoriaId(p.categoriaId);
          setPrecioArs(String(p.precioArs));
          setImagen(p.imagen);
          setImagenes(p.imagenes.filter((url) => url && url !== p.imagen));
          setDescripcion(p.descripcion.join("\n\n"));
          setDescripcionTitulo(p.descripcionTitulo ?? "");
          setCuotas(p.cuotas ? String(p.cuotas) : "");
          setDescuento(
            p.descuentoTransferenciaPct !== undefined
              ? String(p.descuentoTransferenciaPct)
              : "",
          );
          setHighlightsText((p.highlights ?? []).join("\n"));
          setMedidasText(
            (p.medidas ?? []).map((m) => `${m.label}|${m.valor}`).join("\n"),
          );
          setColores(
            (p.colores ?? []).map((c) => ({
              id: c.id,
              nombre: c.nombre,
              hex: c.hex ?? "",
              imagen: c.imagen ?? "",
            })),
          );
          setStock(p.stock === null || p.stock === undefined ? "" : String(p.stock));
          setActivo(p.activo);
        }
      } catch {
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }
    void init();
  }, [mode, productoId, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!imagen.trim()) {
      setError("Subí una foto del producto para continuar.");
      return;
    }

    setSaving(true);

    const highlights = highlightsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const medidas = medidasText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split("|");
        return { label: (label ?? "").trim(), valor: rest.join("|").trim() };
      })
      .filter((m) => m.label && m.valor);

    const gallery = [imagen, ...imagenes.filter((url) => url !== imagen)];
    const coloresPayload = colores
      .map((c) => ({
        id: c.id,
        nombre: c.nombre.trim(),
        hex: c.hex.trim(),
        imagen: c.imagen.trim(),
      }))
      .filter((c) => c.nombre);

    const body = {
      nombre,
      slug,
      categoriaId,
      precioArs: Number(precioArs),
      imagen,
      imagenes: gallery,
      descripcion,
      descripcionTitulo: descripcionTitulo || undefined,
      cuotas: cuotas ? Number(cuotas) : null,
      descuentoTransferenciaPct: descuento === "" ? null : Number(descuento),
      highlights: highlights.length ? highlights : undefined,
      medidas: medidas.length ? medidas : undefined,
      colores: coloresPayload.length ? coloresPayload : null,
      stock: stock === "" ? null : Number(stock),
      activo,
    };

    try {
      const url =
        mode === "create"
          ? "/api/tienda/productos"
          : `/api/tienda/productos/${productoId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      const data = (await res.json()) as { ok?: boolean; error?: string; producto?: TiendaProducto };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo guardar");
        return;
      }
      router.replace("/panel-tienda");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }


  return (
    <PanelTiendaShell title={mode === "create" ? "Nuevo producto" : "Editar producto"}>
      <Link
        href="/panel-tienda"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#5e675b] hover:text-[#35532f]"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      {loading ? (
        <div className="h-72 animate-pulse rounded-2xl border border-[#e0e4dd] bg-white" />
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-4 pb-20 sm:pb-4"
        >
          {error ? (
            <p className="rounded-xl border border-[#f0caca] bg-[#fff5f5] px-3 py-2.5 text-sm text-[#a53c3c]">
              {error}
            </p>
          ) : null}

          <section className={SECTION}>
            <h2 className="text-base font-bold">Información principal</h2>
            <p className="mt-1 text-xs text-[#777d74]">Lo esencial para mostrar el producto en la tienda.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className={LABEL} htmlFor="nombre">Nombre del producto</label>
                <input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={INPUT}
                  placeholder="Ej. Maceta de cerámica"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="precio">Precio</label>
                  <div className="relative">
                    <span className="absolute top-[17px] left-3.5 text-sm font-semibold text-[#72786f]">$</span>
                    <input
                      id="precio"
                      required
                      inputMode="numeric"
                      value={precioArs}
                      onChange={(e) => setPrecioArs(e.target.value)}
                      className={`${INPUT} pl-8`}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className={LABEL} htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    required
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className={INPUT}
                  >
                    <option value="">Elegí una categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className={SECTION}>
            <PanelImageField
              value={imagen}
              onChange={setImagen}
              required
              label="Foto principal"
              helper="Subí una foto desde la galería y ajustala al recuadro punteado."
            />
          </section>

          <section className={SECTION}>
            <h2 className="text-base font-bold">Descripción</h2>
            <div className="mt-4">
              <label className={LABEL} htmlFor="descripcion">Contale al cliente sobre el producto</label>
              <textarea
                id="descripcion"
                required
                rows={5}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={TEXTAREA}
                placeholder="Características, usos y beneficios…"
              />
            </div>
          </section>

          <section className={SECTION}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">Colores</h2>
                <p className="mt-1 text-xs text-[#777d74]">
                  Si cargás 2 o más, en la ficha aparece el selector de color.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setColores((prev) => [...prev, { nombre: "", hex: "", imagen: "" }])
                }
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-[#dce1da] bg-[#f7f9f5] px-3 text-xs font-bold text-[#35532f] hover:bg-[#eef4eb]"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar color
              </button>
            </div>

            {colores.length === 0 ? (
              <p className="mt-4 rounded-xl bg-[#f4f6f2] px-3 py-2.5 text-xs text-[#6a7168]">
                Sin colores cargados. El producto se vende sin selector.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {colores.map((color, index) => (
                  <li
                    key={color.id ?? `nuevo-${index}`}
                    className="rounded-xl border border-[#e4e7e1] bg-[#fafbf9] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#6a7168]">
                        Color {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setColores((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#8a9190] hover:bg-[#f8ecec] hover:text-[#b42318]"
                        aria-label={`Eliminar color ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_120px]">
                      <div>
                        <label className={LABEL} htmlFor={`color-nombre-${index}`}>
                          Nombre
                        </label>
                        <input
                          id={`color-nombre-${index}`}
                          value={color.nombre}
                          onChange={(e) =>
                            setColores((prev) =>
                              prev.map((c, i) =>
                                i === index ? { ...c, nombre: e.target.value } : c,
                              ),
                            )
                          }
                          className={INPUT}
                          placeholder="Ej. Terracota"
                        />
                      </div>
                      <div>
                        <label className={LABEL} htmlFor={`color-hex-${index}`}>
                          Muestra
                        </label>
                        <div className="mt-1.5 flex items-center gap-2">
                          <input
                            id={`color-hex-${index}`}
                            type="color"
                            value={
                              /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color.hex)
                                ? color.hex.length === 4
                                  ? `#${color.hex[1]}${color.hex[1]}${color.hex[2]}${color.hex[2]}${color.hex[3]}${color.hex[3]}`
                                  : color.hex
                                : "#c4933f"
                            }
                            onChange={(e) =>
                              setColores((prev) =>
                                prev.map((c, i) =>
                                  i === index ? { ...c, hex: e.target.value } : c,
                                ),
                              )
                            }
                            className="h-12 w-12 cursor-pointer rounded-lg border border-[#dce1da] bg-white p-1"
                          />
                          <input
                            value={color.hex}
                            onChange={(e) =>
                              setColores((prev) =>
                                prev.map((c, i) =>
                                  i === index ? { ...c, hex: e.target.value } : c,
                                ),
                              )
                            }
                            className={`${INPUT} mt-0`}
                            placeholder="#c4933f"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <PanelImageField
                        value={color.imagen}
                        onChange={(url) =>
                          setColores((prev) =>
                            prev.map((c, i) => (i === index ? { ...c, imagen: url } : c)),
                          )
                        }
                        label="Foto del color (opcional)"
                        helper="Si la cargás, se usa en el carrito al elegir este color."
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={SECTION}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL} htmlFor="stock">Stock disponible</label>
                <input
                  id="stock"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={INPUT}
                  placeholder="Sin control"
                />
                <p className="mt-1.5 text-[11px] text-[#858b82]">Dejalo vacío si no querés controlar stock.</p>
              </div>
              <div>
                <span className={LABEL}>Estado</span>
                <button
                  type="button"
                  onClick={() => setActivo((current) => !current)}
                  className={`mt-1.5 flex h-12 w-full items-center justify-between rounded-xl border px-3.5 text-sm font-semibold ${
                    activo
                      ? "border-[#bad3b5] bg-[#eff7ed] text-[#3f6a38]"
                      : "border-[#ddd8cc] bg-[#f7f4ed] text-[#7e6b48]"
                  }`}
                >
                  {activo ? "Publicado en la tienda" : "Oculto en la tienda"}
                  <span className={`relative h-6 w-11 rounded-full ${activo ? "bg-[#56804e]" : "bg-[#b6b7b2]"}`}>
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${activo ? "left-6" : "left-1"}`} />
                  </span>
                </button>
              </div>
            </div>
          </section>

          <details className={`${SECTION} group`}>
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <div>
                <h2 className="text-base font-bold">Más opciones</h2>
                <p className="mt-1 text-xs text-[#777d74]">Galería, cuotas, descuento y detalles técnicos.</p>
              </div>
              <ChevronDown className="h-5 w-5 text-[#72786f] transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-5 space-y-4 border-t border-[#edf0eb] pt-5">
              <div>
                <label className={LABEL} htmlFor="slug">Dirección URL</label>
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className={INPUT}
                />
              </div>
              <PanelImageGalleryField value={imagenes} onChange={setImagenes} />
              <div>
                <label className={LABEL} htmlFor="desc-titulo">Título de la descripción</label>
                <input
                  id="desc-titulo"
                  value={descripcionTitulo}
                  onChange={(e) => setDescripcionTitulo(e.target.value)}
                  className={INPUT}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL} htmlFor="cuotas">Cantidad de cuotas</label>
                  <input id="cuotas" inputMode="numeric" value={cuotas} onChange={(e) => setCuotas(e.target.value)} className={INPUT} placeholder="6" />
                </div>
                <div>
                  <label className={LABEL} htmlFor="descuento">Descuento por transferencia (%)</label>
                  <input id="descuento" inputMode="numeric" value={descuento} onChange={(e) => setDescuento(e.target.value)} className={INPUT} placeholder="10" />
                </div>
              </div>
              <div>
                <label className={LABEL} htmlFor="highlights">Características destacadas (una por línea)</label>
                <textarea id="highlights" rows={3} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} className={TEXTAREA} />
              </div>
              <div>
                <label className={LABEL} htmlFor="medidas">Detalles (formato: nombre|valor)</label>
                <textarea id="medidas" rows={3} value={medidasText} onChange={(e) => setMedidasText(e.target.value)} className={TEXTAREA} placeholder="Presentación|Bolsa 20 kg" />
              </div>
            </div>
          </details>

          <div className="sticky bottom-[68px] z-20 -mx-4 border-t border-[#dfe3dc] bg-white/95 p-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#41613a] text-sm font-bold text-white shadow-sm hover:bg-[#35532f] disabled:opacity-50 sm:w-auto sm:px-8"
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardando…" : mode === "create" ? "Crear producto" : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </PanelTiendaShell>
  );
}
