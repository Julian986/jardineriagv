import type { Metadata } from "next";
import { ParquizacionFeatureImage } from "@/components/redesign/parquizacion/ParquizacionFeatureImage";
import { ParquizacionGallery } from "@/components/redesign/parquizacion/ParquizacionGallery";
import { ParquizacionHero } from "@/components/redesign/parquizacion/ParquizacionHero";
import { ParquizacionIntroStats } from "@/components/redesign/parquizacion/ParquizacionIntroStats";
import { ParquizacionOfrecemos } from "@/components/redesign/parquizacion/ParquizacionOfrecemos";
import { RedesignCtaBanner } from "@/components/redesign/RedesignCtaBanner";
import { RedesignShell } from "@/components/redesign/RedesignShell";
import {
  PARQUIZACION_INTRO,
  TITULO_PARQUIZACION,
} from "@/lib/parquizacion-redesign-contenido";

export const metadata: Metadata = {
  title: `${TITULO_PARQUIZACION} | Jardinería GV`,
  description: PARQUIZACION_INTRO,
};

export default function ParquizacionDisenoExteriorPage() {
  return (
    <RedesignShell page="parquizacion">
      <ParquizacionHero />
      <ParquizacionIntroStats />
      <ParquizacionFeatureImage />
      <ParquizacionOfrecemos />
      <ParquizacionGallery />

      <div className="mx-auto max-w-6xl px-4 pb-8 md:px-6 md:pb-12">
        <RedesignCtaBanner />
      </div>
    </RedesignShell>
  );
}
