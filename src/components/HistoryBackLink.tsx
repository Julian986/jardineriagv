"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type HistoryBackLinkProps = {
  /** Si no hay historial (ej. entró directo a la página), navega acá. */
  fallbackHref?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Botón “Volver” que usa el historial del navegador (restaura scroll al volver).
 * Evita `Link href="/"`, que siempre abre el inicio arriba del todo.
 */
export function HistoryBackLink({
  fallbackHref = "/",
  children,
  type = "button",
  onClick,
  ...rest
}: HistoryBackLinkProps) {
  const router = useRouter();

  return (
    <button
      type={type}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
    >
      {children}
    </button>
  );
}
