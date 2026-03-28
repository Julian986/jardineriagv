"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TURNO_ESTADOS,
  normalizePhoneForWhatsApp,
} from "@/lib/turnos";

type Turno = {
  id: string;
  nombre: string;
  mail: string;
  celular: string;
  turnoDetalle: string;
  turnoCodigo: string;
  precioReferenciaArs: number;
  estado: (typeof TURNO_ESTADOS)[number];
  notaInterna?: string;
  createdAt: string;
};

const PROFESIONAL_DEFAULT = "Guillermo";

export default function PanelTurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | Turno["estado"]>("todos");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [mensajeTemplate, setMensajeTemplate] = useState(
    "Hola {nombre}, soy {profesional}. Te escribo por tu reserva ({turnoDetalle}).",
  );

  async function loadTurnos() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/turnos", { cache: "no-store" });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        turnos?: Turno[];
      };
      if (!response.ok || !data.ok) {
        setError(data.error ?? "No se pudieron cargar los turnos");
        return;
      }
      setTurnos(data.turnos ?? []);
    } catch {
      setError("Error de conexión al cargar turnos");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTurnos();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const turnosFiltrados = useMemo(() => {
    if (filtroEstado === "todos") return turnos;
    return turnos.filter((t) => t.estado === filtroEstado);
  }, [turnos, filtroEstado]);

  async function updateTurno(id: string, patch: Partial<Turno>) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/turnos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string; turno?: Turno };
      if (!response.ok || !data.ok || !data.turno) {
        setToast(data.error ?? "No se pudo guardar");
        return;
      }

      setTurnos((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data.turno } : item)),
      );
      setToast("Guardado");
    } catch {
      setToast("Error de conexión");
    } finally {
      setSavingId(null);
    }
  }

  function buildWhatsAppLink(turno: Turno): string | null {
    const normalized = normalizePhoneForWhatsApp(turno.celular);
    if (!normalized) return null;

    const message = mensajeTemplate
      .replaceAll("{nombre}", turno.nombre)
      .replaceAll("{profesional}", PROFESIONAL_DEFAULT)
      .replaceAll("{turnoDetalle}", turno.turnoDetalle);

    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  }

  async function logout() {
    await fetch("/api/panel/logout", { method: "POST" });
    window.location.href = "/panel-turnos/login";
  }

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#101828]">
            Panel privado de turnos
          </h1>
          <p className="mt-1 text-sm text-[#4b5563]">
            Gestión de reservas registradas desde el formulario.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-[#1f5d38]/20 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1f5d38]"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
            Filtrar por estado
          </span>
          <select
            value={filtroEstado}
            onChange={(event) =>
              setFiltroEstado(event.target.value as "todos" | Turno["estado"])
            }
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none"
          >
            <option value="todos">Todos</option>
            {TURNO_ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
            Mensaje de WhatsApp
          </span>
          <input
            value={mensajeTemplate}
            onChange={(event) => setMensajeTemplate(event.target.value)}
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none"
          />
        </label>
      </div>

      {toast && (
        <p className="mb-3 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">
          {toast}
        </p>
      )}

      {error && (
        <p className="mb-3 rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b91c1c]">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_18px_46px_rgba(31,41,55,0.07)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8faf8] text-[12px] uppercase tracking-[0.12em] text-[#6b7280]">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Persona</th>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3">Precio de referencia</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Nota interna</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && turnosFiltrados.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-[#6b7280]" colSpan={6}>
                    No hay turnos para mostrar.
                  </td>
                </tr>
              )}

              {turnosFiltrados.map((turno) => {
                const waLink = buildWhatsAppLink(turno);
                return (
                  <tr key={turno.id} className="border-t border-[#eef2f7] align-top">
                    <td className="px-4 py-3 text-[#374151]">
                      {new Date(turno.createdAt).toLocaleString("es-AR")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#111827]">{turno.nombre}</p>
                      <p className="text-[#4b5563]">{turno.mail}</p>
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1f5d38] underline underline-offset-2"
                        >
                          {turno.celular}
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setToast("Número inválido para WhatsApp")}
                          className="text-[#b91c1c] underline underline-offset-2"
                        >
                          {turno.celular}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      <p className="font-semibold">{turno.turnoCodigo}</p>
                      <p>{turno.turnoDetalle}</p>
                    </td>
                    <td className="px-4 py-3 text-[#374151]">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      }).format(turno.precioReferenciaArs)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={turno.estado}
                        onChange={(event) =>
                          void updateTurno(turno.id, {
                            estado: event.target.value as Turno["estado"],
                          })
                        }
                        disabled={savingId === turno.id}
                        className="h-9 w-[140px] rounded-lg border border-[#d1d5db] bg-white px-2 text-[13px] outline-none"
                      >
                        {TURNO_ESTADOS.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        defaultValue={turno.notaInterna ?? ""}
                        onBlur={(event) =>
                          void updateTurno(turno.id, { notaInterna: event.target.value })
                        }
                        disabled={savingId === turno.id}
                        className="min-h-[88px] w-[220px] rounded-lg border border-[#d1d5db] bg-white px-2 py-1.5 text-[13px] outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

