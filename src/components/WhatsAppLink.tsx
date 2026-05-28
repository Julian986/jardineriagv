"use client";

import type { ComponentProps } from "react";
import { event as gaEvent } from "@/lib/gtag";
import { WHATSAPP_HREF } from "@/lib/whatsapp";

type WhatsAppLinkProps = ComponentProps<"a"> & {
  /** Identificador del botón/enlace (ej. sticky_button, sobre_mi). */
  location: string;
  /** Página donde aparece el enlace (ej. home, macetas). */
  page: string;
};

export function WhatsAppLink({
  location,
  page,
  href = WHATSAPP_HREF,
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: WhatsAppLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      {...props}
      onClick={(event) => {
        gaEvent("whatsapp_click", {
          location,
          page,
          transport_type: "beacon",
        });
        onClick?.(event);
      }}
    />
  );
}
