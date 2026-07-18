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

  return (
    <h1
      className={`font-display text-3xl font-bold text-[#1a1a1a] transition-opacity duration-[800ms] ease-out motion-reduce:transition-none sm:text-4xl ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {displayed}
    </h1>
  );
}
