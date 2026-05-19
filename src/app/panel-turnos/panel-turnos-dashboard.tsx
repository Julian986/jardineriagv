"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Leaf,
  MapPin,
  MessageCircle,
  Plus,
  Sprout,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  PANEL_WEEK_LETTERS,
  buildPanelMonthGrid,
  panelMonthTitle,
} from "@/lib/booking/panel-month-grid";
import {
  MOTIVO_OPTIONS,
  TURNO_ESTADOS,
  formatFechaPreferidaAR,
  normalizePhoneForWhatsApp,
} from "@/lib/turnos";

export type PanelTurno = {
  id: string;
  nombre: string;
  celular: string;
  direccion?: string;
  fechaPreferida: string;
  horario: string;
  motivo?: string;
  turnoDetalle: string;
  turnoCodigo: string;
  precioReferenciaArs: number;
  estado: string;
  notaInterna?: string;
  origen?: string;
  createdAt: string;
};

const PROFESIONAL_DEFAULT = "Guillermo";

const HIDDEN_BY_DEFAULT = new Set(["cancelado", "expired"]);

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayYmd(local: Date) {
  return `${local.getFullYear()}-${pad2(local.getMonth() + 1)}-${pad2(local.getDate())}`;
}

function weekdayLongFromKey(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const w = new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(dt);
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function dayLongFromKey(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" }).format(dt);
}

function horarioStart(horario: string) {
  const m = /^(\d{1,2}:\d{2})/.exec(horario.trim());
  return m ? m[1] : horario;
}

function formatMontoArs(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function whatsAppChatUrl(
  turno: PanelTurno,
  messageTemplate: string,
): string | null {
  const normalized = normalizePhoneForWhatsApp(turno.celular);
  if (!normalized) return null;
  const message = messageTemplate
    .replaceAll("{nombre}", turno.nombre)
    .replaceAll("{profesional}", PROFESIONAL_DEFAULT)
    .replaceAll("{turnoDetalle}", turno.turnoDetalle)
    .replaceAll("{direccion}", turno.direccion?.trim() || "(sin dirección)");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function StatusBadge({ estado }: { estado: string }) {
  if (estado === "cancelado") {
    return (
      <span className="inline-block rounded-full bg-red-500/12 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-red-300/95">
        Cancelada
      </span>
    );
  }
  if (estado === "expired") {
    return (
      <span className="inline-block rounded-full bg-zinc-500/14 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-zinc-300/90">
        Expirada
      </span>
    );
  }
  if (estado === "pending_payment") {
    return (
      <span className="inline-block rounded-full bg-amber-500/14 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-200/90">
        Pendiente de pago
      </span>
    );
  }
  if (estado === "confirmed" || estado === "confirmado") {
    return (
      <span className="inline-block rounded-full bg-emerald-500/14 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-300/95">
        Confirmada
      </span>
    );
  }
  if (estado === "contactado") {
    return (
      <span className="inline-block rounded-full bg-sky-500/14 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-sky-200/95">
        Contactado
      </span>
    );
  }
  if (estado === "pendiente") {
    return (
      <span className="inline-block rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#d4e8d4]/88">
        Pendiente
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#d4e8d4]/88">
      {estado}
    </span>
  );
}

function canCancel(estado: string) {
  return estado === "pending_payment" || estado === "confirmed" || estado === "confirmado" || estado === "pendiente" || estado === "contactado";
}

export function PanelTurnosDashboard() {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [list, setList] = useState<PanelTurno[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [syncingPaymentId, setSyncingPaymentId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mensajeTemplate, setMensajeTemplate] = useState(
    "Hola {nombre}, soy {profesional}. Te escribo por tu reserva ({turnoDetalle}). Dirección: {direccion}",
  );

  const grid = useMemo(() => buildPanelMonthGrid(year, month), [year, month]);
  const todayKey = todayYmd(now);

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const key = todayYmd(now);
    const [y, m] = key.split("-").map(Number);
    if (y === now.getFullYear() && m === now.getMonth() + 1) return key;
    return `${year}-${pad2(month)}-01`;
  });

  useEffect(() => {
    const curFirst = `${year}-${pad2(month)}-01`;
    const curLast = new Date(year, month, 0).getDate();
    const curLastKey = `${year}-${pad2(month)}-${pad2(curLast)}`;
    if (selectedKey >= curFirst && selectedKey <= curLastKey) return;

    if (todayKey >= curFirst && todayKey <= curLastKey) {
      setSelectedKey(todayKey);
      return;
    }
    setSelectedKey(curFirst);
  }, [year, month, selectedKey, todayKey]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/turnos?year=${year}&month=${month}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          ok?: boolean;
          turnos?: PanelTurno[];
          error?: string;
        };
        if (!res.ok) {
          if (res.status === 401) router.replace("/panel-turnos/login");
          return;
        }
        if (alive) setList(data.turnos ?? []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [year, month, router, refreshTick]);

  const visibleTurnos = useMemo(() => {
    if (showHidden) return list;
    return list.filter((t) => !HIDDEN_BY_DEFAULT.has(t.estado));
  }, [list, showHidden]);

  const countsByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of visibleTurnos) {
      if (t.fechaPreferida) {
        m.set(t.fechaPreferida, (m.get(t.fechaPreferida) ?? 0) + 1);
      }
    }
    return m;
  }, [visibleTurnos]);

  const hiddenCountSelectedDay = useMemo(
    () =>
      list.filter(
        (t) => t.fechaPreferida === selectedKey && HIDDEN_BY_DEFAULT.has(t.estado),
      ).length,
    [list, selectedKey],
  );

  const dayTurnos = useMemo(() => {
    return visibleTurnos
      .filter((t) => t.fechaPreferida === selectedKey)
      .sort((a, b) => a.horario.localeCompare(b.horario));
  }, [visibleTurnos, selectedKey]);

  const reloadMonth = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  async function patchTurno(id: string, patch: { estado?: string; notaInterna?: string }) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/turnos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json()) as { ok?: boolean; turno?: PanelTurno };
      if (!res.ok || !data.ok || !data.turno) return;
      setList((prev) => prev.map((t) => (t.id === id ? { ...t, ...data.turno } : t)));
    } finally {
      setSavingId(null);
    }
  }

  async function syncMercadoPagoPayment(id: string) {
    setSyncingPaymentId(id);
    try {
      const res = await fetch(`/api/panel-turnos/turnos/${id}/sync-payment`, {
        method: "POST",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) reloadMonth();
    } finally {
      setSyncingPaymentId(null);
    }
  }

  async function handleCancelTurno(id: string) {
    setCancellingId(id);
    try {
      await patchTurno(id, { estado: "cancelado" });
      reloadMonth();
    } finally {
      setCancellingId(null);
    }
  }

  async function handleLogout() {
    setLogoutBusy(true);
    await fetch("/api/panel/logout", { method: "POST" });
    router.replace("/panel-turnos/login");
    setLogoutBusy(false);
  }

  function prevMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
      return;
    }
    setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
      return;
    }
    setMonth((m) => m + 1);
  }

  return (
    <div className="min-h-screen bg-[#0f1a12] pb-24 text-[#e8f0e9]">
      <div className="mx-auto max-w-md px-4">
        <header className="flex items-start justify-between gap-4 pt-6 pb-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d5016] to-[#c4933f] shadow-[0_10px_28px_rgba(45,80,22,0.35)]">
              <Leaf className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[18px] font-bold leading-tight text-[#c4933f]">Jardinería GV</h1>
              <p className="text-[12px] leading-relaxed text-[#a8c4a8]/70">Panel de visitas</p>
            </div>
          </div>
          <Link
            href="/panel-turnos/nuevo"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[#c4933f]/35 bg-[#1a2e1a] text-[#c4933f] shadow-[0_6px_22px_rgba(0,0,0,0.35)] hover:bg-[#223822]"
            aria-label="Agregar visita"
          >
            <Plus className="h-5 w-5" strokeWidth={2.25} />
          </Link>
        </header>

        <section className="mt-5 rounded-[28px] border border-white/8 bg-[#1a2e1a] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.38)]">
          <div className="relative mb-3 flex items-center justify-center px-10">
            <button
              type="button"
              onClick={prevMonth}
              className="absolute left-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#a8c4a8]/70 hover:bg-white/5 hover:text-[#e8f0e9]"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-center text-[15px] font-semibold capitalize tracking-tight text-[#e8f0e9]">
              {panelMonthTitle(year, month)}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="absolute right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-[#a8c4a8]/70 hover:bg-white/5 hover:text-[#e8f0e9]"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold tracking-wide text-[#a8c4a8]/45">
            {PANEL_WEEK_LETTERS.map((L) => (
              <div key={L} className="py-2">
                {L}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center">
            {grid.map((cell) => {
              const sel = cell.dateKey === selectedKey;
              const count = countsByDay.get(cell.dateKey) ?? 0;
              const inMonth = cell.inMonth;

              return (
                <button
                  key={`${cell.dateKey}-${cell.inMonth}-${cell.day}`}
                  type="button"
                  onClick={() => setSelectedKey(cell.dateKey)}
                  className="flex w-full cursor-pointer flex-col items-center py-1"
                >
                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold leading-none transition",
                      inMonth ? "text-[#e8f0e9]" : "text-[#a8c4a8]/30",
                      sel
                        ? "bg-gradient-to-br from-[#1f5d38] to-[#2d5016] text-white shadow-[0_8px_24px_rgba(31,93,56,0.4)]"
                        : "hover:bg-white/5",
                    ].join(" ")}
                  >
                    {cell.day}
                  </span>
                  <span className="mt-0.5 flex h-2 items-center justify-center">
                    {count > 0 ? (
                      <span className="block h-1 w-1 rounded-full bg-[#c4933f]" />
                    ) : (
                      <span className="block h-1 w-1 rounded-full bg-transparent" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[22px] font-bold leading-tight tracking-tight text-[#e8f0e9]">
              {weekdayLongFromKey(selectedKey)}
            </p>
            <p className="mt-0.5 text-[14px] text-[#a8c4a8]/55">{dayLongFromKey(selectedKey)}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setShowHidden((v) => !v)}
              className={[
                "flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-[13px] transition",
                showHidden
                  ? "border-red-400/35 bg-red-500/12 text-red-200/95"
                  : "border-white/10 bg-[#1a2e1a] text-[#e8f0e9]/88 hover:bg-[#223822]",
              ].join(" ")}
              aria-pressed={showHidden}
            >
              <span className="font-semibold">{hiddenCountSelectedDay}</span>
              <span className="font-semibold">Ocultas</span>
            </button>
            <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#1a2e1a] px-3 py-2 text-[13px] text-[#e8f0e9]/88">
              <CalendarDays className="h-4 w-4 text-[#c4933f]" strokeWidth={1.75} />
              <span className="font-semibold">
                {dayTurnos.length} {dayTurnos.length === 1 ? "visita" : "visitas"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {loading ? (
            <p className="py-10 text-center text-[14px] text-[#a8c4a8]/55">Cargando agenda…</p>
          ) : dayTurnos.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-[#a8c4a8]/55">
              No hay visitas agendadas este día.
            </p>
          ) : (
            dayTurnos.map((turno) => {
              const waUrl = whatsAppChatUrl(turno, mensajeTemplate);
              const expanded = expandedId === turno.id;
              const motivoLabel = turno.motivo
                ? MOTIVO_OPTIONS.find((m) => m.value === turno.motivo)?.label ?? turno.motivo
                : null;

              return (
                <article
                  key={turno.id}
                  className="relative rounded-[20px] border border-white/8 bg-[#1a2e1a] px-4 py-4 shadow-[0_10px_32px_rgba(0,0,0,0.32)]"
                >
                  {canCancel(turno.estado) ? (
                    <button
                      type="button"
                      onClick={() => setCancelConfirmId(turno.id)}
                      disabled={cancellingId === turno.id}
                      aria-label="Cancelar visita"
                      className="absolute top-3 right-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-red-400/35 bg-red-500/10 text-red-200/95 transition hover:bg-red-500/16 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.9} />
                    </button>
                  ) : null}
                  <div className="flex gap-3">
                    <div className="w-[52px] shrink-0 text-left">
                      <p className="text-[15px] font-bold leading-none text-[#e8f0e9]">
                        {horarioStart(turno.horario)}
                      </p>
                      <p className="mt-2 text-[10px] leading-tight text-[#a8c4a8]/48">
                        {turno.horario}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1 pr-10">
                      <div className="flex gap-2">
                        <Sprout className="h-5 w-5 shrink-0 text-[#c4933f]" strokeWidth={1.85} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-bold leading-snug text-[#e8f0e9]">
                            {turno.nombre}
                          </p>
                          <p className="mt-0.5 text-[11px] font-medium text-[#c4933f]/90">
                            {turno.turnoCodigo}
                          </p>
                          {motivoLabel ? (
                            <p className="mt-1 text-[12px] text-[#a8c4a8]/58">{motivoLabel}</p>
                          ) : null}
                          <p className="mt-1.5 flex items-start gap-1.5 text-[12px] text-[#a8c4a8]/58">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                            <span className="line-clamp-2">
                              {turno.direccion?.trim() || "Sin dirección"}
                            </span>
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <div className="inline-flex shrink-0 items-center gap-1.5">
                              <StatusBadge estado={turno.estado} />
                              {turno.estado === "pending_payment" ? (
                                <button
                                  type="button"
                                  disabled={syncingPaymentId === turno.id}
                                  onClick={() => void syncMercadoPagoPayment(turno.id)}
                                  className="inline-flex cursor-pointer items-center rounded-md border border-amber-400/40 bg-amber-950/30 px-2 py-0.5 text-[10px] font-medium leading-tight text-amber-50/90 hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {syncingPaymentId === turno.id
                                    ? "Verificando…"
                                    : "Verificar pago MP"}
                                </button>
                              ) : null}
                            </div>
                            {turno.origen === "panel" ? (
                              <span className="inline-block rounded-full bg-sky-500/14 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-sky-200/95">
                                Manual
                              </span>
                            ) : null}
                            <span className="text-[11px] font-semibold text-[#a8c4a8]/70">
                              {formatMontoArs(turno.precioReferenciaArs)}
                            </span>
                            {waUrl ? (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#25D366]/16 px-3 py-1.5 text-[11px] font-semibold text-[#6ee7a5] ring-1 ring-[#25D366]/35 transition hover:bg-[#25D366]/24"
                              >
                                <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                                WhatsApp
                              </a>
                            ) : null}
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId((id) => (id === turno.id ? null : turno.id))
                              }
                              className="cursor-pointer text-[11px] font-semibold text-[#c4933f] underline-offset-2 hover:underline"
                            >
                              {expanded ? "Menos" : "Editar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {expanded ? (
                    <div className="mt-4 border-t border-white/8 pt-4">
                      <p className="text-[12px] text-[#a8c4a8]/55">
                        {formatFechaPreferidaAR(turno.fechaPreferida)}
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-[#a8c4a8]/70">
                        {turno.turnoDetalle}
                      </p>
                      <label className="mt-3 block">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#a8c4a8]/55">
                          Estado
                        </span>
                        <select
                          value={turno.estado}
                          disabled={savingId === turno.id}
                          onChange={(e) =>
                            void patchTurno(turno.id, { estado: e.target.value })
                          }
                          className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#141f14] px-3 text-[14px] text-[#e8f0e9] outline-none"
                        >
                          {TURNO_ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="mt-3 block">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#a8c4a8]/55">
                          Nota interna
                        </span>
                        <textarea
                          defaultValue={turno.notaInterna ?? ""}
                          disabled={savingId === turno.id}
                          onBlur={(e) => {
                            const v = e.target.value;
                            if (v === (turno.notaInterna ?? "")) return;
                            void patchTurno(turno.id, { notaInterna: v });
                          }}
                          rows={3}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#141f14] px-3 py-2 text-[14px] text-[#e8f0e9] outline-none"
                        />
                      </label>
                      <label className="mt-3 block">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#a8c4a8]/55">
                          Plantilla WhatsApp
                        </span>
                        <input
                          value={mensajeTemplate}
                          onChange={(e) => setMensajeTemplate(e.target.value)}
                          className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-[#141f14] px-3 text-[13px] text-[#e8f0e9] outline-none"
                        />
                      </label>
                    </div>
                  ) : null}
                </article>
              );
            })
          )}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutBusy}
            className="cursor-pointer text-[13px] text-[#a8c4a8]/50 underline-offset-4 hover:text-[#c4933f] hover:underline disabled:opacity-50"
          >
            Cerrar sesión del panel
          </button>
        </div>
      </div>

      {cancelConfirmId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
          onClick={() => {
            if (cancellingId !== cancelConfirmId) setCancelConfirmId(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/12 bg-[#1a2e1a] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[20px] font-bold text-[#e8f0e9]">Cancelar visita</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-[#a8c4a8]/78">
              ¿Estás seguro? La visita quedará marcada como cancelada.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelConfirmId(null)}
                disabled={cancellingId === cancelConfirmId}
                className="inline-flex h-9 items-center rounded-xl border border-white/15 px-3 text-[12px] font-semibold text-[#e8f0e9]/85 hover:bg-white/5 disabled:opacity-60"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = cancelConfirmId;
                  if (!id) return;
                  await handleCancelTurno(id);
                  setCancelConfirmId(null);
                }}
                disabled={cancellingId === cancelConfirmId}
                className="inline-flex h-9 items-center rounded-xl border border-red-400/45 bg-red-500/12 px-3 text-[12px] font-semibold text-red-200/95 hover:bg-red-500/18 disabled:opacity-60"
              >
                {cancellingId === cancelConfirmId ? "Cancelando…" : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
