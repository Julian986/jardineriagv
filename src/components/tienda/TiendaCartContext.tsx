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
import type { TiendaProductoDemo } from "@/lib/tienda-demo";
import {
  TIENDA_CART_STORAGE_KEY,
  calcTiendaCartItemCount,
  calcTiendaCartSubtotal,
  type TiendaCartItem,
} from "@/lib/tienda-cart";
import { lockBodyScroll } from "@/lib/body-scroll-lock";

type TiendaCartContextValue = {
  items: TiendaCartItem[];
  itemCount: number;
  subtotalArs: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addProduct: (producto: TiendaProductoDemo, cantidad?: number) => void;
  removeItem: (productoId: string) => void;
  setQuantity: (productoId: string, cantidad: number) => void;
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

  const addProduct = useCallback((producto: TiendaProductoDemo, cantidad = 1) => {
    const qty = Math.max(1, Math.floor(cantidad));
    setItems((prev) => {
      const existing = prev.find((item) => item.productoId === producto.id);
      if (existing) {
        return prev.map((item) =>
          item.productoId === producto.id
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
          imagen: producto.imagen,
          cantidad: qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((item) => item.productoId !== productoId));
  }, []);

  const setQuantity = useCallback((productoId: string, cantidad: number) => {
    const qty = Math.max(1, Math.floor(cantidad));
    setItems((prev) =>
      prev.map((item) => (item.productoId === productoId ? { ...item, cantidad: qty } : item)),
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
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addProduct,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [items, itemCount, subtotalArs, isOpen, addProduct, removeItem, setQuantity, clearCart],
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
