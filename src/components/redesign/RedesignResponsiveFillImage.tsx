import Image from "next/image";
import {
  REDESIGN_FEATURE_DESKTOP_SIZES,
  REDESIGN_FEATURE_MOBILE_SIZES,
  REDESIGN_HERO_SIZES,
  REDESIGN_IMAGE_QUALITY,
} from "@/lib/redesign-image";

type RedesignResponsiveFillImageProps = {
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
  priority?: boolean;
  /** hero = pantalla completa; feature = bloque intermedio ancho */
  variant?: "hero" | "feature";
  className?: string;
};

export function RedesignResponsiveFillImage({
  mobileSrc,
  desktopSrc,
  alt,
  priority,
  variant = "hero",
  className = "object-cover",
}: RedesignResponsiveFillImageProps) {
  const mobileSizes = variant === "hero" ? REDESIGN_HERO_SIZES : REDESIGN_FEATURE_MOBILE_SIZES;
  const desktopSizes = variant === "hero" ? REDESIGN_HERO_SIZES : REDESIGN_FEATURE_DESKTOP_SIZES;

  return (
    <>
      <Image
        src={mobileSrc}
        alt={alt}
        fill
        priority={priority}
        className={`${className} md:hidden`}
        quality={REDESIGN_IMAGE_QUALITY}
        sizes={mobileSizes}
      />
      <Image
        src={desktopSrc}
        alt={alt}
        fill
        priority={priority}
        className={`${className} hidden md:block`}
        quality={REDESIGN_IMAGE_QUALITY}
        sizes={desktopSizes}
      />
    </>
  );
}
