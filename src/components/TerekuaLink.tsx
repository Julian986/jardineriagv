"use client";

import type { ComponentProps } from "react";
import { event as gaEvent } from "@/lib/gtag";
import { buildTerekuaPartnerHref } from "@/lib/terekua";

type TerekuaLinkProps = ComponentProps<"a"> & {
  /** Identificador del bloque (ej. home_mvp, madera_mvp). */
  location: string;
  /** Página donde aparece el enlace. */
  page: string;
};

export function TerekuaLink({
  location,
  page,
  href,
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: TerekuaLinkProps) {
  const partnerHref = href ?? buildTerekuaPartnerHref(location);

  return (
    <a
      href={partnerHref}
      target={target}
      rel={rel}
      {...props}
      onClick={(event) => {
        gaEvent("terekua_click", {
          location,
          page,
          transport_type: "beacon",
        });
        onClick?.(event);
      }}
    />
  );
}
