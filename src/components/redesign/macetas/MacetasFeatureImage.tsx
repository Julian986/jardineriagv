import { RedesignResponsiveFillImage } from "@/components/redesign/RedesignResponsiveFillImage";
import {
  MACETAS_FEATURE_IMAGEN_DESKTOP,
  MACETAS_FEATURE_IMAGEN_MOBILE,
} from "@/lib/macetas-redesign-contenido";

export function MacetasFeatureImage() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-md">
        <div className="relative aspect-[16/7] w-full md:aspect-[16/6]">
          <RedesignResponsiveFillImage
            mobileSrc={MACETAS_FEATURE_IMAGEN_MOBILE}
            desktopSrc={MACETAS_FEATURE_IMAGEN_DESKTOP}
            alt="Canteros y decoración con plantas"
            variant="feature"
          />
        </div>
      </div>
    </section>
  );
}
