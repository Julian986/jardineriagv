import Image from "next/image";
import {
  REDESIGN_GALLERY_4COL_SIZES,
  REDESIGN_IMAGE_QUALITY,
} from "@/lib/redesign-image";
import {
  MACETAS_GALERIA_IMAGENES,
  MACETAS_GALERIA_TITULO,
} from "@/lib/macetas-redesign-contenido";

export function MacetasGallery() {
  return (
    <section className="px-4 py-12 md:px-6 md:py-16" aria-labelledby="macetas-galeria-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2
            id="macetas-galeria-heading"
            className="font-display text-2xl font-bold text-[#2d4a22] md:text-3xl"
          >
            {MACETAS_GALERIA_TITULO}
          </h2>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {MACETAS_GALERIA_IMAGENES.map((img) => (
            <div
              key={img.src}
              className="relative h-48 w-[72vw] shrink-0 snap-start overflow-hidden rounded-3xl md:h-52 md:w-auto"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                quality={REDESIGN_IMAGE_QUALITY}
                sizes={REDESIGN_GALLERY_4COL_SIZES}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
