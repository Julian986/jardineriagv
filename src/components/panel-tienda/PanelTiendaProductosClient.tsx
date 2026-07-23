"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Eye, EyeOff, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { PanelConfirmModal } from "@/components/panel-tienda/PanelConfirmModal";
import { PanelTiendaShell } from "@/components/panel-tienda/PanelTiendaShell";
import { formatArs } from "@/lib/madera/pricing";
import type { TiendaProducto } from "@/lib/tienda/types";

export function PanelTiendaProductosClient() {
  const router = useRouter();
  const [productos, setProductos] = useState<TiendaProducto[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<TiendaProducto | null>(null);

  const activos = productos.filter((producto) => producto.activo).length;
  const ocultos = productos.length - activos;

  const filtrados = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return productos;
    return productos.filter((producto) => {
      const haystack = [
        producto.nombre,
        producto.slug,
        producto.categoriaLabel,
        producto.categoriaSlug,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [productos, q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tienda/productos?admin=1");
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      const data = (await res.json()) as {
        ok?: boolean;
        productos?: TiendaProducto[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudieron cargar los productos");
        return;
      }
      setProductos(data.productos ?? []);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleActivo(producto: TiendaProducto) {
    setBusyId(producto.id);
    try {
      const res = await fetch(`/api/tienda/productos/${producto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !producto.activo }),
      });
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "No se pudo actualizar");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function eliminar(producto: TiendaProducto) {
    setBusyId(producto.id);
    try {
      const res = await fetch(`/api/tienda/productos/${producto.id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "No se pudo eliminar");
        return;
      }
      setPendingDelete(null);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <PanelTiendaShell title="Productos">
      <section className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Resumen de productos">
        {[
          { label: "Total", value: productos.length, tone: "text-[#20231f]" },
          { label: "Publicados", value: activos, tone: "text-[#3f6a38]" },
          { label: "Ocultos", value: ocultos, tone: "text-[#8a6630]" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#e2e5df] bg-white p-3 shadow-sm sm:p-4">
            <p className={`text-2xl font-bold leading-none ${item.tone}`}>{loading ? "–" : item.value}</p>
            <p className="mt-1.5 text-[11px] font-medium text-[#747a71] sm:text-xs">{item.label}</p>
          </div>
        ))}
      </section>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Catálogo</h2>
          <p className="text-xs text-[#747a71]">Tocá un producto para modificarlo.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/panel-tienda/estadisticas"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d5ddd1] bg-white px-3 text-sm font-bold text-[#41613a] shadow-sm hover:bg-[#eef4eb] sm:px-4"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Estadísticas</span>
            <span className="sm:hidden">Stats</span>
          </Link>
          <Link
            href="/panel-tienda/productos/nuevo"
            className="hidden h-11 items-center justify-center gap-2 rounded-xl bg-[#41613a] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#35532f] sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Agregar producto
          </Link>
        </div>
      </div>

      <div className="relative mt-4" role="search">
        <label htmlFor="panel-tienda-buscar" className="sr-only">
          Buscar productos
        </label>
        <input
          id="panel-tienda-buscar"
          type="search"
          name="panel_tienda_catalog_filter"
          role="searchbox"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, categoría…"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          data-bwignore="true"
          data-form-type="other"
          className="h-11 w-full rounded-xl border border-[#dfe3dc] bg-white py-2.5 pr-4 pl-10 text-sm text-[#20231f] outline-none placeholder:text-[#999f96] focus:border-[#6f8b68] focus:ring-2 focus:ring-[#dce8d8] [&::-webkit-search-cancel-button]:appearance-none"
        />
        <Search className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-[#858b82]" />
      </div>
      {q.trim() ? (
        <p className="mt-2 text-xs text-[#747a71]" aria-live="polite">
          {filtrados.length === 1
            ? "1 resultado"
            : `${filtrados.length} resultados`}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-xl border border-[#f0caca] bg-[#fff5f5] px-3 py-2.5 text-sm text-[#a53c3c]">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-5 space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-2xl border border-[#e4e7e1] bg-white" />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#cfd5cc] bg-white px-5 py-12 text-center">
          <Package className="mx-auto h-9 w-9 text-[#8b9388]" />
          <p className="mt-3 font-semibold">No encontramos productos</p>
          <p className="mt-1 text-sm text-[#747a71]">
            {q.trim() ? "Probá otra búsqueda." : "Agregá el primero desde Agregar producto."}
          </p>
        </div>
      ) : (
        <ul className="mt-4 overflow-hidden rounded-2xl border border-[#e0e4dd] bg-white shadow-sm">
          {filtrados.map((p) => (
            <li
              key={p.id}
              className="border-b border-[#edf0eb] p-3 last:border-b-0 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <Link href={`/panel-tienda/productos/${p.id}`} className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border border-[#e1e5de] bg-[#f5f6f4]">
                  {p.imagen ? (
                    <Image src={p.imagen} alt="" fill className="object-cover" sizes="68px" />
                  ) : (
                    <Package className="absolute inset-0 m-auto h-6 w-6 text-[#a2a89f]" />
                  )}
                </Link>
                <Link href={`/panel-tienda/productos/${p.id}`} className="min-w-0 flex-1 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm font-bold leading-snug text-[#252824] sm:text-base">{p.nombre}</p>
                    <span className={`mt-0.5 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                      p.activo ? "bg-[#eaf4e7] text-[#3f6a38]" : "bg-[#f4f1ea] text-[#7e6b48]"
                    }`}>
                      {p.activo ? "Publicado" : "Oculto"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#41613a]">{formatArs(p.precioArs)}</p>
                  <p className="mt-0.5 truncate text-xs text-[#7b8178]">
                    {p.categoriaLabel || "Sin categoría"}
                    {p.stock !== null ? ` · Stock: ${p.stock}` : ""}
                  </p>
                </Link>
              </div>
              <div className="mt-3 flex items-center justify-end gap-1 border-t border-[#f0f2ee] pt-2.5 sm:mt-0 sm:border-0 sm:pt-0">
                <Link
                  href={`/panel-tienda/productos/${p.id}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#41613a] hover:bg-[#eef4eb]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
                <button
                  type="button"
                  disabled={busyId === p.id}
                  onClick={() => void toggleActivo(p)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#62685f] hover:bg-[#f2f3f1] disabled:opacity-50"
                >
                  {p.activo ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {p.activo ? "Ocultar" : "Publicar"}
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${p.nombre}`}
                  disabled={busyId === p.id}
                  onClick={() => setPendingDelete(p)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#a64b4b] hover:bg-[#fff1f1] disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PanelConfirmModal
        open={Boolean(pendingDelete)}
        title="¿Eliminar producto?"
        description={
          pendingDelete
            ? `Se va a eliminar “${pendingDelete.nombre}”. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar producto"
        busy={Boolean(pendingDelete && busyId === pendingDelete.id)}
        onCancel={() => {
          if (busyId) return;
          setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) void eliminar(pendingDelete);
        }}
      />
    </PanelTiendaShell>
  );
}
