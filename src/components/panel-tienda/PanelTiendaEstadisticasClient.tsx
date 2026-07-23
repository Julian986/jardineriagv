"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Lock,
  Package,
  Sparkles,
  TrendingUp,
  Unlock,
  X,
} from "lucide-react";
import { PanelTiendaShell } from "@/components/panel-tienda/PanelTiendaShell";
import { formatArs } from "@/lib/madera/pricing";
import type { TiendaStatsResult } from "@/lib/tienda/stats";

const MESES = [
  { value: "all", label: "Todo el año" },
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const DEMO_STATS: TiendaStatsResult = {
  filtro: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
  pedidosConfirmados: 18,
  unidadesVendidas: 47,
  ingresosNetoArs: 1_285_000,
  ingresosTotalCobradoArs: 1_390_000,
  porCategoria: [
    {
      categoriaSlug: "macetas",
      categoriaNombre: "Macetas",
      unidades: 16,
      ingresosNetoArs: 420_000,
      pedidos: 9,
    },
    {
      categoriaSlug: "sustratos",
      categoriaNombre: "Sustratos",
      unidades: 14,
      ingresosNetoArs: 168_000,
      pedidos: 8,
    },
    {
      categoriaSlug: "herramientas-jardin",
      categoriaNombre: "Herramientas de jardín",
      unidades: 10,
      ingresosNetoArs: 285_000,
      pedidos: 6,
    },
    {
      categoriaSlug: "articulos-deco",
      categoriaNombre: "Artículos deco",
      unidades: 7,
      ingresosNetoArs: 412_000,
      pedidos: 5,
    },
  ],
  topProductos: [
    {
      productoId: "demo-1",
      nombre: "Maceta cerámica para interior",
      categoriaNombre: "Macetas",
      unidades: 9,
      ingresosNetoArs: 346_500,
    },
    {
      productoId: "demo-2",
      nombre: "Tierra negra premium — bolsa 20 kg",
      categoriaNombre: "Sustratos",
      unidades: 11,
      ingresosNetoArs: 137_500,
    },
    {
      productoId: "demo-3",
      nombre: "Kit básico de riego por goteo",
      categoriaNombre: "Herramientas de jardín",
      unidades: 6,
      ingresosNetoArs: 168_000,
    },
  ],
};

function StatsContent({
  stats,
  year,
  month,
  years,
  onYear,
  onMonth,
  onRefresh,
  interactive,
}: {
  stats: TiendaStatsResult;
  year: string;
  month: string;
  years: number[];
  onYear: (v: string) => void;
  onMonth: (v: string) => void;
  onRefresh: () => void;
  interactive: boolean;
}) {
  const periodoLabel =
    month === "all"
      ? year
      : `${MESES.find((m) => m.value === month)?.label ?? ""} ${year}`;

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Movimientos de la tienda</h2>
          <p className="mt-1 text-sm text-[#747a71]">
            Ventas confirmadas con Mercado Pago · {periodoLabel}
          </p>
        </div>
        <Link href="/panel-tienda" className="text-sm font-semibold text-[#41613a] hover:underline">
          ← Volver a productos
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[#e0e4dd] bg-white p-4 shadow-sm sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label htmlFor="stats-year" className="text-xs font-semibold text-[#747a71]">
            Año
          </label>
          <select
            id="stats-year"
            value={year}
            disabled={!interactive}
            onChange={(e) => onYear(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#dce1da] bg-white px-3 text-sm outline-none focus:border-[#6f8b68] disabled:opacity-70"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="stats-month" className="text-xs font-semibold text-[#747a71]">
            Mes
          </label>
          <select
            id="stats-month"
            value={month}
            disabled={!interactive}
            onChange={(e) => onMonth(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#dce1da] bg-white px-3 text-sm outline-none focus:border-[#6f8b68] disabled:opacity-70"
          >
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          disabled={!interactive}
          onClick={onRefresh}
          className="h-11 self-end rounded-xl bg-[#41613a] px-4 text-sm font-bold text-white hover:bg-[#35532f] disabled:opacity-70"
        >
          Actualizar
        </button>
      </div>

      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Resumen">
        {[
          { label: "Pedidos pagos", value: String(stats.pedidosConfirmados) },
          { label: "Productos vendidos", value: String(stats.unidadesVendidas) },
          { label: "Ingresos (neto)", value: formatArs(stats.ingresosNetoArs) },
          { label: "Cobrado en MP", value: formatArs(stats.ingresosTotalCobradoArs) },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-[#e2e5df] bg-white p-4 shadow-sm">
            <p className="text-xl font-bold text-[#20231f] sm:text-2xl">{card.value}</p>
            <p className="mt-1 text-[11px] font-medium text-[#747a71] sm:text-xs">{card.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-[#e0e4dd] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#41613a]" />
          <h3 className="text-base font-bold">Por categoría</h3>
        </div>
        <ul className="mt-4 divide-y divide-[#edf0eb]">
          {stats.porCategoria.map((cat) => (
            <li
              key={cat.categoriaSlug}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{cat.categoriaNombre}</p>
                <p className="text-xs text-[#747a71]">
                  {cat.unidades} productos · {cat.pedidos} pedidos
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-[#41613a]">
                {formatArs(cat.ingresosNetoArs)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-[#e0e4dd] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#41613a]" />
          <h3 className="text-base font-bold">Productos más vendidos</h3>
        </div>
        <ul className="mt-4 divide-y divide-[#edf0eb]">
          {stats.topProductos.map((prod, index) => (
            <li
              key={prod.productoId}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  <span className="mr-2 text-[#9aa197]">{index + 1}.</span>
                  {prod.nombre}
                </p>
                <p className="text-xs text-[#747a71]">
                  {prod.categoriaNombre} · {prod.unidades}{" "}
                  {prod.unidades === 1 ? "unidad" : "unidades"}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-[#41613a]">
                {formatArs(prod.ingresosNetoArs)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function PanelTiendaEstadisticasClient() {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<TiendaStatsResult | null>(null);
  const [showUnlock, setShowUnlock] = useState(false);
  const [password, setPassword] = useState("");
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const years = useMemo(() => {
    const y = now.getFullYear();
    return [y, y - 1, y - 2, y - 3];
  }, [now]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ year });
      params.set("month", month === "all" ? "all" : month);
      const res = await fetch(`/api/tienda/stats?${params}`);
      if (res.status === 401) {
        router.replace("/panel-tienda/login");
        return;
      }
      if (res.status === 403) {
        setUnlocked(false);
        setStats(null);
        return;
      }
      const data = (await res.json()) as {
        ok?: boolean;
        stats?: TiendaStatsResult;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.stats) {
        setError(data.error ?? "No se pudieron cargar las estadísticas");
        return;
      }
      setUnlocked(true);
      setStats(data.stats);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [month, router, year]);

  useEffect(() => {
    async function checkUnlock() {
      try {
        const res = await fetch("/api/tienda/stats/unlock");
        if (res.status === 401) {
          router.replace("/panel-tienda/login");
          return;
        }
        const data = (await res.json()) as { unlocked?: boolean };
        if (data.unlocked) {
          setUnlocked(true);
        }
      } catch {
        // queda bloqueado
      } finally {
        setChecking(false);
      }
    }
    void checkUnlock();
  }, [router]);

  useEffect(() => {
    if (!unlocked) return;
    void load();
  }, [unlocked, load]);

  async function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    setUnlockBusy(true);
    setUnlockError("");
    try {
      const res = await fetch("/api/tienda/stats/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        code?: string;
      };
      if (!res.ok || !data.ok) {
        setUnlockError(
          data.error ??
            "No se pudo desbloquear. Esta función puede no estar incluida en tu plan.",
        );
        return;
      }
      setUnlocked(true);
      setShowUnlock(false);
      setPassword("");
    } catch {
      setUnlockError("Error de conexión");
    } finally {
      setUnlockBusy(false);
    }
  }

  const previewStats = stats ?? DEMO_STATS;

  return (
    <PanelTiendaShell title="Estadísticas">
      <div className="relative">
        <div
          className={
            unlocked
              ? ""
              : "pointer-events-none select-none blur-[3px] sm:blur-[4px]"
          }
          aria-hidden={!unlocked}
        >
          {unlocked && loading ? (
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-24 animate-pulse rounded-2xl border border-[#e4e7e1] bg-white"
                />
              ))}
            </div>
          ) : (
            <StatsContent
              stats={previewStats}
              year={year}
              month={month}
              years={years}
              onYear={setYear}
              onMonth={setMonth}
              onRefresh={() => void load()}
              interactive={unlocked}
            />
          )}
        </div>

        {!unlocked && !checking ? (
          <div className="absolute inset-0 z-10 flex items-start justify-center px-2 pt-10 sm:pt-16">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_24px_60px_rgba(32,40,28,0.22)] backdrop-blur-md">
              <div className="bg-gradient-to-br from-[#41613a] to-[#2d4a22] px-5 py-5 text-white">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium
                </div>
                <h2 className="mt-3 text-2xl font-bold leading-tight">
                  Estadísticas de tu tienda
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  Mirá cuánto vendiste, qué productos rinden más y filtrá por mes o año.
                </p>
              </div>

              <div className="space-y-3 px-5 py-5">
                <ul className="space-y-2.5 text-sm text-[#3e453c]">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#41613a]" />
                    Productos vendidos del mes y del año
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-[#41613a]" />
                    Desglose por categoría (macetas, sustratos, etc.)
                  </li>
                  <li className="flex items-start gap-2">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-[#41613a]" />
                    Ranking de productos más comprados
                  </li>
                </ul>

                <p className="rounded-xl bg-[#f4f6f2] px-3 py-2.5 text-xs leading-relaxed text-[#6a7168]">
                  Esta función no está incluida en tu plan actual. El fondo de ejemplo te muestra
                  cómo se vería con datos reales de tu ecommerce.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowUnlock(true);
                    setUnlockError("");
                  }}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#41613a] text-sm font-bold text-white shadow-sm hover:bg-[#35532f]"
                >
                  <Unlock className="h-4 w-4" />
                  Desbloquear
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {unlocked && error ? (
        <p className="mt-4 rounded-xl border border-[#f0caca] bg-[#fff5f5] px-3 py-2.5 text-sm text-[#a53c3c]">
          {error}
        </p>
      ) : null}

      {showUnlock ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1a1f18]/45 p-4 backdrop-blur-[2px] sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="unlock-stats-title"
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#e4e7e1] bg-white shadow-[0_20px_50px_rgba(26,31,24,0.25)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#edf0eb] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4eb] text-[#41613a]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="unlock-stats-title" className="text-base font-bold text-[#20231f]">
                    Desbloquear Estadísticas
                  </h3>
                  <p className="mt-1 text-sm text-[#6f756c]">
                    Ingresá el código de activación Premium.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setShowUnlock(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#7a8177] hover:bg-[#f3f4f2]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={tryUnlock} className="space-y-3 px-5 py-4">
              <div>
                <label htmlFor="stats-unlock-password" className="text-sm font-semibold text-[#343833]">
                  Contraseña
                </label>
                <input
                  id="stats-unlock-password"
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Código Premium"
                  className="mt-1.5 h-12 w-full rounded-xl border border-[#dce1da] px-3.5 text-base outline-none focus:border-[#6f8b68] focus:ring-2 focus:ring-[#dce8d8]"
                />
              </div>

              {unlockError ? (
                <p className="rounded-lg border border-[#f0caca] bg-[#fff5f5] px-3 py-2 text-sm text-[#a53c3c]">
                  {unlockError}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowUnlock(false)}
                  className="h-11 rounded-xl border border-[#dce1da] px-4 text-sm font-bold text-[#3e453c]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={unlockBusy || !password}
                  className="h-11 rounded-xl bg-[#41613a] px-4 text-sm font-bold text-white disabled:opacity-50"
                >
                  {unlockBusy ? "Validando…" : "Activar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </PanelTiendaShell>
  );
}
