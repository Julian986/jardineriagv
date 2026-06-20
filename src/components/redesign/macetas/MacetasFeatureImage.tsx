import Image from "next/image";
import { MACETAS_FEATURE_IMAGEN } from "@/lib/macetas-redesign-contenido";

export function MacetasFeatureImage() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-md">
        <div className="relative aspect-[16/7] w-full md:aspect-[16/6]">
          <Image
            src={MACETAS_FEATURE_IMAGEN}
            alt="Canteros y decoración con plantas"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>
      </div>
    </section>
  );
}
