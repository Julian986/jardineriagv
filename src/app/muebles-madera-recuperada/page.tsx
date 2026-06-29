import type { Metadata } from "next";
import { MaderaCheckoutForm } from "@/components/MaderaCheckoutForm";
import { MaderaFeatureImage } from "@/components/redesign/madera/MaderaFeatureImage";
import { MaderaGallery } from "@/components/redesign/madera/MaderaGallery";
import { MaderaHero } from "@/components/redesign/madera/MaderaHero";
import { MaderaIntroStats } from "@/components/redesign/madera/MaderaIntroStats";
import { MaderaProceso } from "@/components/redesign/madera/MaderaProceso";
import { MaderaProducto } from "@/components/redesign/madera/MaderaProducto";
import { MaderaUsos } from "@/components/redesign/madera/MaderaUsos";
import { RedesignCtaBanner } from "@/components/redesign/RedesignCtaBanner";
import { RedesignShell } from "@/components/redesign/RedesignShell";
import { TerekuaMvpBlock } from "@/components/TerekuaMvpBlock";
import { MADERA_INTRO_HOME, TITULO_MADERA } from "@/lib/madera-redesign-contenido";

export const metadata: Metadata = {
  title: `${TITULO_MADERA} | Jardinería GV`,
  description: MADERA_INTRO_HOME,
};

export default function MueblesMaderaRecuperadaPage() {
  return (
    <RedesignShell page="madera">
      <MaderaHero />
      <MaderaIntroStats />
      <MaderaFeatureImage />
      <MaderaProducto />
      <MaderaProceso />
      <MaderaUsos />
      <MaderaGallery />

      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <TerekuaMvpBlock location="madera_mvp" page="madera" className="mb-12" />
        <MaderaCheckoutForm />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 md:px-6 md:pb-12">
        <RedesignCtaBanner />
      </div>
    </RedesignShell>
  );
}
