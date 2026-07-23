"use client";

import { useEffect, useState } from "react";

type TiendaCatalogTitleProps = {
  title: string;
};

export function TiendaCatalogTitle({ title }: TiendaCatalogTitleProps) {
  const [displayed, setDisplayed] = useState(title);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (title === displayed) return;

    setVisible(false);
    const swap = window.setTimeout(() => {
      setDisplayed(title);
      window.requestAnimationFrame(() => setVisible(true));
    }, 179);

    return () => window.clearTimeout(swap);
  }, [title, displayed]);

  const isCatalogRoot = displayed === "Productos";

  return (
    <div
      className={`transition-opacity duration-[800ms] ease-out motion-reduce:transition-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {!isCatalogRoot ? (
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c4933f] sm:text-xs">
          Catálogo
        </p>
      ) : null}
      <h1
        className={`font-display text-[2rem] font-bold leading-[1.1] tracking-tight text-[#2d4a22] sm:text-4xl md:text-[2.75rem] ${
          isCatalogRoot ? "" : "mt-1.5"
        }`}
      >
        {displayed}
      </h1>
      <span
        className="mt-3 block h-1 w-12 rounded-full bg-[#c4933f] sm:w-14"
        aria-hidden
      />
    </div>
  );
}
