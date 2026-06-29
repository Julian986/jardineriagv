"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type NavMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NavMenuContext = createContext<NavMenuContextValue | null>(null);

export function NavMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <NavMenuContext.Provider value={{ open, setOpen }}>{children}</NavMenuContext.Provider>
  );
}

export function useNavMenu() {
  const context = useContext(NavMenuContext);
  if (!context) {
    throw new Error("useNavMenu debe usarse dentro de NavMenuProvider");
  }
  return context;
}

export function useNavMenuOptional() {
  return useContext(NavMenuContext);
}
