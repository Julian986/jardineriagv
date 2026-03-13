"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  title: string;
  badge: string;
};

export function ServiceGallery({ images, title, badge }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,246,241,0.95))] shadow-[0_22px_56px_rgba(31,41,55,0.09)]">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-[linear-gradient(145deg,#edf7ef_0%,#dce9dc_100%)]">
          <p className="text-[14px] text-[#6b7280]">Sin imágenes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,246,241,0.95))] shadow-[0_22px_56px_rgba(31,41,55,0.09)]">
      <div className="relative aspect-[4/3] w-full bg-[linear-gradient(145deg,#edf7ef_0%,#dce9dc_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_42%)]" />
        <span className="absolute left-5 top-5 z-10 rounded-full bg-[#101828] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          {badge}
        </span>

        <Image
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt={`${title} - imagen ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority={currentIndex === 0}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/25 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/40"
              aria-label="Imagen anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/25 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/40"
              aria-label="Siguiente imagen"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`Ir a imagen ${i + 1}`}
                  aria-current={i === currentIndex ? "true" : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="border-t border-white/60 bg-[#f7f7f5] px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, index) => (
              <button
                key={img}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-[16px] border-2 shadow-[0_8px_20px_rgba(31,41,55,0.06)] transition ${
                  index === currentIndex
                    ? "border-[#1f5d38] ring-2 ring-[#1f5d38]/30"
                    : "border-white/70 bg-[linear-gradient(145deg,#e8eee8_0%,#dce4db_100%)] hover:border-[#1f5d38]/50"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
