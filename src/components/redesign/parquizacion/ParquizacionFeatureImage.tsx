import { RedesignResponsiveFillImage } from "@/components/redesign/RedesignResponsiveFillImage";
import {
  PARQUIZACION_FEATURE_IMAGEN_DESKTOP,
  PARQUIZACION_FEATURE_IMAGEN_MOBILE,
} from "@/lib/parquizacion-redesign-contenido";

export function ParquizacionFeatureImage() {
  return (
    <section className="px-4 md:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-md">
        <div className="relative aspect-[16/7] w-full md:aspect-[16/6]">
          <RedesignResponsiveFillImage
            mobileSrc={PARQUIZACION_FEATURE_IMAGEN_MOBILE}
            desktopSrc={PARQUIZACION_FEATURE_IMAGEN_DESKTOP}
            alt="Sistema de riego automático en jardín"
            variant="feature"
          />
        </div>
      </div>
    </section>
  );
}
