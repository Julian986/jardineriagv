import Image from "next/image";
import {
  REDESIGN_FEATURE_SIZES,
  REDESIGN_IMAGE_QUALITY,
} from "@/lib/redesign-image";
import { MADERA_FEATURE_IMAGEN } from "@/lib/madera-redesign-contenido";

export function MaderaFeatureImage() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-md">
        <div className="relative aspect-[16/7] w-full md:aspect-[16/6]">
          <Image
            src={MADERA_FEATURE_IMAGEN}
            alt="Madera recuperada artesanal"
            fill
            className="object-cover"
            quality={REDESIGN_IMAGE_QUALITY}
            sizes={REDESIGN_FEATURE_SIZES}
          />
        </div>
      </div>
    </section>
  );
}
