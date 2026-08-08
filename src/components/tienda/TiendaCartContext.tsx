"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildTiendaColorOptions } from "@/lib/tienda/product-colors";
import { findProductoColor, type TiendaColor, type TiendaProducto } from "@/lib/tienda/types";
import {
  TIENDA_CART_STORAGE_KEY,
  calcTiendaCartItemCount,
  calcTiendaCartSubtotal,
  tiendaCartLineKey,
  type TiendaCartItem,
} from "@/lib/tienda-cart";
import { lockBodyScroll } from "@/lib/body-scroll-lock";

export type TiendaCartToastData = {
  id: number;
  nombre: string;
  imagen: string;
  cantidad: number;
};

export type AddProductOptions = {
  cantidad?: number;
  color?: TiendaColor | null;
};

type TiendaCartContextValue = {
  items: TiendaCartItem[];
  itemCount: number;
  subtotalArs: number;
  isOpen: boolean;
  toast: TiendaCartToastData | null;
  openCart: () => void;
  closeCart: () => void;
  dismissToast: () => void;
  addProduct: (producto: TiendaProducto, options?: AddProductOptions) => boolean;
  removeItem: (lineKey: string) => void;
  setQuantity: (lineKey: string, cantidad: number) => void;
  clearCart: () => void;
};

const TiendaCartContext = createContext<TiendaCartContextValue | null>(null);

function readStoredCart(): TiendaCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TIENDA_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TiendaCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function TiendaCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TiendaCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<TiendaCartToastData | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(TIENDA_CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    return lockBodyScroll();
  }, [isOpen]);

  const dismissToast = useCallback(() => setToast(null), []);

  const addProduct = useCallback((producto: TiendaProducto, options?: AddProductOptions): boolean => {
    const qty = Math.max(1, Math.floor(options?.cantidad ?? 1));
    let color = options?.color ?? null;

    const colorOptions = buildTiendaColorOptions(producto);
    if (colorOptions.length > 1) {
      if (!color) return false;
      const selected = color;
      const match =
        findProductoColor(producto, selected.id) ||
        colorOptions.find((o) => o.id === selected.id);
      if (!match) return false;
      color = {
        id: match.id,
        nombre: match.nombre,
        ...("hex" in match && match.hex ? { hex: match.hex } : {}),
        imagen: "imageSrc" in match ? match.imageSrc : match.imagen,
      };
    } else if (!color && colorOptions.length === 1) {
      const only = colorOptions[0]!;
      color = {
        id: only.id,
        nombre: only.nombre,
        ...(only.hex ? { hex: only.hex } : {}),
        imagen: only.imageSrc,
      };
    }

    const colorId = color?.id;
    const colorNombre = color?.nombre;
    const imagen = color?.imagen?.trim() || producto.imagen;
    const displayNombre = colorNombre ? `${producto.nombre} · ${colorNombre}` : producto.nombre;
    const lineKey = tiendaCartLineKey({ productoId: producto.id, colorId });

    setItems((prev) => {
      const existing = prev.find((item) => tiendaCartLineKey(item) === lineKey);
      if (existing) {
        return prev.map((item) =>
          tiendaCartLineKey(item) === lineKey
            ? { ...item, cantidad: item.cantidad + qty }
            : item,
        );
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          slug: producto.slug,
          nombre: producto.nombre,
          precioArs: producto.precioArs,
          imagen,
          cantidad: qty,
          ...(colorId ? { colorId, colorNombre } : {}),
        },
      ];
    });
    setToast({
      id: Date.now(),
      nombre: displayNombre,
      imagen,
      cantidad: qty,
    });
    return true;
  }, []);

  const removeItem = useCallback((lineKey: string) => {
    setItems((prev) => prev.filter((item) => tiendaCartLineKey(item) !== lineKey));
  }, []);

  const setQuantity = useCallback((lineKey: string, cantidad: number) => {
    const qty = Math.max(1, Math.floor(cantidad));
    setItems((prev) =>
      prev.map((item) =>
        tiendaCartLineKey(item) === lineKey ? { ...item, cantidad: qty } : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => calcTiendaCartItemCount(items), [items]);
  const subtotalArs = useMemo(() => calcTiendaCartSubtotal(items), [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotalArs,
      isOpen,
      toast,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      dismissToast,
      addProduct,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotalArs,
      isOpen,
      toast,
      dismissToast,
      addProduct,
      removeItem,
      setQuantity,
      clearCart,
    ],
  );

  return <TiendaCartContext.Provider value={value}>{children}</TiendaCartContext.Provider>;
}

export function useTiendaCart() {
  const context = useContext(TiendaCartContext);
  if (!context) {
    throw new Error("useTiendaCart debe usarse dentro de TiendaCartProvider");
  }
  return context;
}
