"use client";

import type { ReactNode } from "react";
import { TiendaCartDrawer } from "@/components/tienda/TiendaCartDrawer";
import { TiendaCartProvider } from "@/components/tienda/TiendaCartContext";
import { TiendaCartToast } from "@/components/tienda/TiendaCartToast";

export function TiendaProviders({ children }: { children: ReactNode }) {
  return (
    <TiendaCartProvider>
      {children}
      <TiendaCartToast />
      <TiendaCartDrawer />
    </TiendaCartProvider>
  );
}
