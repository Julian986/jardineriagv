import Image from "next/image";
import {
  REDESIGN_GALLERY_2COL_SIZES,
  REDESIGN_IMAGE_QUALITY,
} from "@/lib/redesign-image";
import { MADERA_GALERIA_IMAGENES, MADERA_GALERIA_TITULO } from "@/lib/madera-redesign-contenido";

export function MaderaGallery() {
  return (
    <section className="bg-[#fafaf7] px-4 py-12 md:px-6 md:py-16" aria-labelledby="madera-galeria-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2
            id="madera-galeria-heading"
            className="font-display text-2xl font-bold text-[#2d4a22] md:text-3xl"
          >
            {MADERA_GALERIA_TITULO}
          </h2>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {MADERA_GALERIA_IMAGENES.map((img) => (
            <div
              key={img.src}
              className="relative h-56 w-[85vw] shrink-0 snap-start overflow-hidden rounded-3xl md:h-72 md:w-auto"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                quality={REDESIGN_IMAGE_QUALITY}
                sizes={REDESIGN_GALLERY_2COL_SIZES}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
