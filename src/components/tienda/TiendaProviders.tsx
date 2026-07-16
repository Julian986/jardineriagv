"use client";

import type { ReactNode } from "react";
import { TiendaCartDrawer } from "@/components/tienda/TiendaCartDrawer";
import { TiendaCartProvider } from "@/components/tienda/TiendaCartContext";

export function TiendaProviders({ children }: { children: ReactNode }) {
  return (
    <TiendaCartProvider>
      {children}
      <TiendaCartDrawer />
    </TiendaCartProvider>
  );
}
