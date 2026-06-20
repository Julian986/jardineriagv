import type { Metadata } from "next";
import { MacetasFeatureImage } from "@/components/redesign/macetas/MacetasFeatureImage";
import { MacetasGallery } from "@/components/redesign/macetas/MacetasGallery";
import { MacetasHero } from "@/components/redesign/macetas/MacetasHero";
import { MacetasIntroStats } from "@/components/redesign/macetas/MacetasIntroStats";
import { MacetasOfrecemos } from "@/components/redesign/macetas/MacetasOfrecemos";
import { RedesignCtaBanner } from "@/components/redesign/RedesignCtaBanner";
import { RedesignShell } from "@/components/redesign/RedesignShell";
import { MACETAS_INTRO, TITULO_MACETAS } from "@/lib/macetas-redesign-contenido";

export const metadata: Metadata = {
  title: `${TITULO_MACETAS} | Jardinería GV`,
  description: MACETAS_INTRO,
};

export default function DecoracionPlantasMacetasPage() {
  return (
    <RedesignShell page="macetas">
      <MacetasHero />
      <MacetasIntroStats />
      <MacetasFeatureImage />
      <MacetasOfrecemos />
      <MacetasGallery />

      <div className="mx-auto max-w-6xl px-4 pb-8 md:px-6 md:pb-12">
        <RedesignCtaBanner />
      </div>
    </RedesignShell>
  );
}
