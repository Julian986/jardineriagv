"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { PanelConfirmModal } from "@/components/panel-tienda/PanelConfirmModal";
import { PanelTiendaShell } from "@/components/panel-tienda/PanelTiendaShell";
import type { TiendaCategoria } from "@/lib/tienda/types";

const INPUT =
  "h-11 w-full rounded-xl border border-[#dce1da] bg-white px-3.5 text-base text-[#20231f] outline-none placeholder:text-[#a2a79f] focus:border-[#6f8b68] focus:ring-2 focus:ring-[#dce8d8] sm:text-sm";

export function PanelTiendaCategoriasClient() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<TiendaCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [pendingDelete, setPendingDelete] = useState<TiendaCategoria | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tienda/categorias?admin=1");
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      const data = (await res.json()) as {
        ok?: boolean;
        categorias?: TiendaCategoria[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudieron cargar");
        return;
      }
      setCategorias(data.categorias ?? []);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/tienda/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo crear");
        return;
      }
      setNombre("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function guardarEdit(id: string) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/tienda/categorias/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: editNombre }),
      });
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo guardar");
        return;
      }
      setEditId(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActiva(cat: TiendaCategoria) {
    const res = await fetch(`/api/tienda/categorias/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activa: !cat.activa }),
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
  }

  async function eliminar(cat: TiendaCategoria) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/tienda/categorias/${cat.id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo eliminar");
        return;
      }
      setPendingDelete(null);
      await load();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <PanelTiendaShell title="Categorías">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Organizá tu catálogo</h2>
        <p className="mt-1 text-sm text-[#747a71]">
          Las categorías ayudan a los clientes a encontrar productos.
        </p>
      </div>

      <form onSubmit={crear} className="rounded-2xl border border-[#e0e4dd] bg-white p-4 shadow-sm">
        <label htmlFor="nueva-categoria" className="text-sm font-semibold text-[#343833]">
          Nueva categoría
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="nueva-categoria"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Macetas"
            required
            className={INPUT}
          />
          <button
            type="submit"
            disabled={saving || !nombre.trim()}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-[#41613a] px-4 text-sm font-bold text-white disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-4 rounded-xl border border-[#f0caca] bg-[#fff5f5] px-3 py-2.5 text-sm text-[#a53c3c]">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-5 h-48 animate-pulse rounded-2xl border border-[#e0e4dd] bg-white" />
      ) : categorias.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[#cfd5cc] bg-white py-10 text-center">
          <Tags className="mx-auto h-8 w-8 text-[#92998f]" />
          <p className="mt-2 text-sm font-semibold">Todavía no hay categorías</p>
        </div>
      ) : (
        <ul className="mt-5 overflow-hidden rounded-2xl border border-[#e0e4dd] bg-white shadow-sm">
          {categorias.map((cat) => (
            <li
              key={cat.id}
              className="border-b border-[#edf0eb] p-3 last:border-b-0 sm:p-4"
            >
              {editId === cat.id ? (
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    className={INPUT}
                  />
                  <button
                    type="button"
                    onClick={() => void guardarEdit(cat.id)}
                    className="h-11 rounded-xl bg-[#41613a] px-4 text-sm font-bold text-white"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="h-11 rounded-xl border border-[#dce1da] px-4 text-sm font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4eb] text-[#41613a]">
                      <Tags className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold">{cat.nombre}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          cat.activa ? "bg-[#eaf4e7] text-[#3f6a38]" : "bg-[#f4f1ea] text-[#7e6b48]"
                        }`}>
                          {cat.activa ? "Visible" : "Oculta"}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#7b8178]">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end gap-1 border-t border-[#f0f2ee] pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(cat.id);
                        setEditNombre(cat.nombre);
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#41613a] hover:bg-[#eef4eb]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleActiva(cat)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#62685f] hover:bg-[#f2f3f1]"
                    >
                      {cat.activa ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {cat.activa ? "Ocultar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      aria-label={`Eliminar ${cat.nombre}`}
                      onClick={() => setPendingDelete(cat)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#a64b4b] hover:bg-[#fff1f1]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <PanelConfirmModal
        open={Boolean(pendingDelete)}
        title="¿Eliminar categoría?"
        description={
          pendingDelete
            ? `Se va a eliminar “${pendingDelete.nombre}”. Solo se puede si no tiene productos asociados.`
            : ""
        }
        confirmLabel="Eliminar categoría"
        busy={deleting}
        onCancel={() => {
          if (deleting) return;
          setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) void eliminar(pendingDelete);
        }}
      />
    </PanelTiendaShell>
  );
}
