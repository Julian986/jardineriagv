"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { markBackNavigation } from "@/lib/navigation-scroll";

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
  className,
  ...rest
}: HistoryBackLinkProps) {
  const router = useRouter();

  return (
    <button
      type={type}
      className={[className, "cursor-pointer"].filter(Boolean).join(" ")}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        if (typeof window !== "undefined" && window.history.length > 1) {
          markBackNavigation();
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
