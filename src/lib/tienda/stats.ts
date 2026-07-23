import { getDb } from "@/lib/mongodb";
import { COL_TIENDA_PEDIDOS } from "@/lib/tienda/pedido";

export type TiendaStatsFiltro = {
  year: number;
  month: number | null; // 1-12, null = todo el año
};

export type TiendaStatsCategoria = {
  categoriaSlug: string;
  categoriaNombre: string;
  unidades: number;
  ingresosNetoArs: number;
  pedidos: number;
};

export type TiendaStatsProducto = {
  productoId: string;
  nombre: string;
  categoriaNombre: string;
  unidades: number;
  ingresosNetoArs: number;
};

export type TiendaStatsResult = {
  filtro: TiendaStatsFiltro;
  pedidosConfirmados: number;
  unidadesVendidas: number;
  ingresosNetoArs: number;
  ingresosTotalCobradoArs: number;
  porCategoria: TiendaStatsCategoria[];
  topProductos: TiendaStatsProducto[];
};

function periodBounds(year: number, month: number | null) {
  if (month == null) {
    return {
      start: new Date(year, 0, 1, 0, 0, 0, 0),
      end: new Date(year + 1, 0, 1, 0, 0, 0, 0),
    };
  }
  return {
    start: new Date(year, month - 1, 1, 0, 0, 0, 0),
    end: new Date(year, month, 1, 0, 0, 0, 0),
  };
}

export async function getTiendaStats(filtro: TiendaStatsFiltro): Promise<TiendaStatsResult> {
  const { start, end } = periodBounds(filtro.year, filtro.month);
  const db = await getDb();

  const pedidos = await db
    .collection(COL_TIENDA_PEDIDOS)
    .find({
      estado: { $in: ["confirmed", "paid"] },
      mpPaidAt: { $gte: start, $lt: end },
    })
    .toArray();

  let unidadesVendidas = 0;
  let ingresosNetoArs = 0;
  let ingresosTotalCobradoArs = 0;

  const catMap = new Map<
    string,
    { categoriaNombre: string; unidades: number; ingresosNetoArs: number; pedidos: Set<string> }
  >();
  const prodMap = new Map<
    string,
    { nombre: string; categoriaNombre: string; unidades: number; ingresosNetoArs: number }
  >();

  for (const pedido of pedidos) {
    const pedidoId = String(pedido._id);
    const neto = typeof pedido.montoNetoArs === "number" ? pedido.montoNetoArs : 0;
    const total =
      typeof pedido.montoTotalCobroArs === "number" ? pedido.montoTotalCobroArs : neto;
    ingresosNetoArs += neto;
    ingresosTotalCobradoArs += total;

    const items = Array.isArray(pedido.items) ? pedido.items : [];
    for (const item of items) {
      const cantidad = typeof item?.cantidad === "number" ? item.cantidad : 0;
      const subtotal =
        typeof item?.subtotalArs === "number"
          ? item.subtotalArs
          : (typeof item?.precioUnitarioArs === "number" ? item.precioUnitarioArs : 0) *
            cantidad;
      const categoriaSlug =
        typeof item?.categoriaSlug === "string" && item.categoriaSlug
          ? item.categoriaSlug
          : "sin-categoria";
      const categoriaNombre =
        typeof item?.categoriaNombre === "string" && item.categoriaNombre
          ? item.categoriaNombre
          : "Sin categoría";
      const productoId =
        typeof item?.productoId === "string" ? item.productoId : `unknown-${item?.nombre}`;
      const nombre = typeof item?.nombre === "string" ? item.nombre : "Producto";

      unidadesVendidas += cantidad;

      const cat = catMap.get(categoriaSlug) ?? {
        categoriaNombre,
        unidades: 0,
        ingresosNetoArs: 0,
        pedidos: new Set<string>(),
      };
      cat.unidades += cantidad;
      cat.ingresosNetoArs += subtotal;
      cat.pedidos.add(pedidoId);
      catMap.set(categoriaSlug, cat);

      const prod = prodMap.get(productoId) ?? {
        nombre,
        categoriaNombre,
        unidades: 0,
        ingresosNetoArs: 0,
      };
      prod.unidades += cantidad;
      prod.ingresosNetoArs += subtotal;
      prodMap.set(productoId, prod);
    }
  }

  const porCategoria = [...catMap.entries()]
    .map(([categoriaSlug, value]) => ({
      categoriaSlug,
      categoriaNombre: value.categoriaNombre,
      unidades: value.unidades,
      ingresosNetoArs: value.ingresosNetoArs,
      pedidos: value.pedidos.size,
    }))
    .sort((a, b) => b.unidades - a.unidades);

  const topProductos = [...prodMap.entries()]
    .map(([productoId, value]) => ({
      productoId,
      nombre: value.nombre,
      categoriaNombre: value.categoriaNombre,
      unidades: value.unidades,
      ingresosNetoArs: value.ingresosNetoArs,
    }))
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 12);

  return {
    filtro,
    pedidosConfirmados: pedidos.length,
    unidadesVendidas,
    ingresosNetoArs,
    ingresosTotalCobradoArs,
    porCategoria,
    topProductos,
  };
}
