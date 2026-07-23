"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  TIENDA_CAROUSEL_SLIDES,
  type TiendaCarouselSlide,
} from "@/lib/tienda-carousel";

const AUTO_MS = 5000;
const FADE_MS = 700;

export function TiendaHeroCarousel() {
  const slides = TIENDA_CAROUSEL_SLIDES;
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const paused = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      const len = slides.length;
      setCurrent(((index % len) + len) % len);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) next();
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [next]);

  const slide = slides[current] as TiendaCarouselSlide;

  const arrowClass =
    "absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#2d4a22] shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:h-11 sm:w-11";

  return (
    <section
      className="relative"
      aria-roledescription="carrusel"
      aria-label="Promociones de la tienda"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
        paused.current = true;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        paused.current = false;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return;
        if (delta < 0) next();
        else prev();
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[#e8ebe3] sm:aspect-[21/9] sm:rounded-xl">
        {slides.map((item, i) => (
          <div
            key={item.id}
            className="absolute inset-0 transition-opacity ease-out"
            style={{
              opacity: i === current ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
              pointerEvents: i === current ? "auto" : "none",
            }}
            aria-hidden={i !== current}
          >
            <Image
              src={item.imagen}
              alt={item.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(20,42,8,0.78) 0%, rgba(20,42,8,0.35) 45%, rgba(20,42,8,0.12) 100%)",
              }}
              aria-hidden
            />
          </div>
        ))}

        <button
          type="button"
          onClick={prev}
          className={`${arrowClass} left-2 sm:left-3`}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
        </button>
        <button
          type="button"
          onClick={next}
          className={`${arrowClass} right-2 sm:right-3`}
          aria-label="Slide siguiente"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.25} />
        </button>

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 md:p-8">
          {slide.titulo ? (
            <p className="font-display text-xl font-bold leading-tight text-white drop-shadow sm:text-2xl md:text-3xl">
              {slide.titulo}
            </p>
          ) : null}
          {slide.subtitulo ? (
            <p className="mt-1 max-w-xl text-sm text-white/90 sm:text-base">
              {slide.subtitulo}
            </p>
          ) : null}
          {slide.href && slide.cta ? (
            <Link
              href={slide.href}
              className="mt-3 inline-flex rounded-full bg-[#c4933f] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:mt-4 sm:px-5 sm:text-sm"
            >
              {slide.cta}
            </Link>
          ) : null}
        </div>
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Slides del carrusel"
      >
        {slides.map((item, i) => {
          const active = i === current;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Ir a promoción ${i + 1}: ${item.titulo ?? item.alt}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                active
                  ? "h-2.5 w-2.5 bg-[#2d4a22]"
                  : "h-2.5 w-2.5 border border-[#bbb] bg-transparent hover:border-[#2d4a22]"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
