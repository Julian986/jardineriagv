"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Package } from "lucide-react";
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

export function PanelTiendaEstadisticasClient() {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<TiendaStatsResult | null>(null);

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
      const data = (await res.json()) as {
        ok?: boolean;
        stats?: TiendaStatsResult;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.stats) {
        setError(data.error ?? "No se pudieron cargar las estadísticas");
        return;
      }
      setStats(data.stats);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [month, router, year]);

  useEffect(() => {
    void load();
  }, [load]);

  const periodoLabel =
    month === "all"
      ? year
      : `${MESES.find((m) => m.value === month)?.label ?? ""} ${year}`;

  return (
    <PanelTiendaShell title="Estadísticas">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Movimientos de la tienda</h2>
          <p className="mt-1 text-sm text-[#747a71]">
            Ventas confirmadas con Mercado Pago · {periodoLabel}
          </p>
        </div>
        <Link
          href="/panel-tienda"
          className="text-sm font-semibold text-[#41613a] hover:underline"
        >
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
            onChange={(e) => setYear(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#dce1da] bg-white px-3 text-sm outline-none focus:border-[#6f8b68]"
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
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#dce1da] bg-white px-3 text-sm outline-none focus:border-[#6f8b68]"
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
          onClick={() => void load()}
          className="h-11 self-end rounded-xl bg-[#41613a] px-4 text-sm font-bold text-white hover:bg-[#35532f]"
        >
          Actualizar
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-[#f0caca] bg-[#fff5f5] px-3 py-2.5 text-sm text-[#a53c3c]">
          {error}
        </p>
      ) : null}

      {loading || !stats ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 animate-pulse rounded-2xl border border-[#e4e7e1] bg-white" />
          ))}
        </div>
      ) : (
        <>
          <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Resumen">
            {[
              { label: "Pedidos pagos", value: String(stats.pedidosConfirmados) },
              { label: "Productos vendidos", value: String(stats.unidadesVendidas) },
              { label: "Ingresos (neto)", value: formatArs(stats.ingresosNetoArs) },
              { label: "Cobrado en MP", value: formatArs(stats.ingresosTotalCobradoArs) },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[#e2e5df] bg-white p-4 shadow-sm"
              >
                <p className="text-xl font-bold text-[#20231f] sm:text-2xl">{card.value}</p>
                <p className="mt-1 text-[11px] font-medium text-[#747a71] sm:text-xs">
                  {card.label}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-2xl border border-[#e0e4dd] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#41613a]" />
              <h3 className="text-base font-bold">Por categoría</h3>
            </div>
            {stats.porCategoria.length === 0 ? (
              <p className="mt-4 text-sm text-[#747a71]">
                No hay ventas confirmadas en este período.
              </p>
            ) : (
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
            )}
          </section>

          <section className="mt-4 rounded-2xl border border-[#e0e4dd] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#41613a]" />
              <h3 className="text-base font-bold">Productos más vendidos</h3>
            </div>
            {stats.topProductos.length === 0 ? (
              <p className="mt-4 text-sm text-[#747a71]">Sin productos vendidos en este período.</p>
            ) : (
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
            )}
          </section>
        </>
      )}
    </PanelTiendaShell>
  );
}
