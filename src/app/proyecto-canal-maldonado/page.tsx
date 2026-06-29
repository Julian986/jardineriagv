import type { Metadata } from "next";
import { RedesignCtaBanner } from "@/components/redesign/RedesignCtaBanner";
import { RedesignShell } from "@/components/redesign/RedesignShell";
import { NapostaFeatureImage } from "@/components/redesign/naposta/NapostaFeatureImage";
import { NapostaGallery } from "@/components/redesign/naposta/NapostaGallery";
import { NapostaHero } from "@/components/redesign/naposta/NapostaHero";
import { NapostaIntroStats } from "@/components/redesign/naposta/NapostaIntroStats";
import { NapostaPilares } from "@/components/redesign/naposta/NapostaPilares";
import {
  NAPOSTA_ENCUESTA_TEXTO,
  NAPOSTA_ENCUESTA_TITULO,
  TITULO_PROYECTO_NAPOSTA,
} from "@/lib/naposta-redesign-contenido";

export const metadata: Metadata = {
  title: `${TITULO_PROYECTO_NAPOSTA} | Jardinería GV`,
  description:
    "Ingeniería ecológica, sustentabilidad y paisajismo autóctono para encauzar el Canal Maldonado, vía de alivio del Río Napostá.",
};

export default function ProyectoCanalMaldonadoPage() {
  return (
    <RedesignShell page="biodiversidad_proyecto">
      <NapostaHero />
      <NapostaIntroStats />
      <NapostaFeatureImage />
      <NapostaPilares />
      <NapostaGallery />

      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-8 md:px-6 md:pb-12">
        <RedesignCtaBanner />

        <section
          className="rounded-3xl border border-dashed border-[#c8d9b8] bg-[#f0f5ea]/60 p-6 text-center"
          aria-label="Encuesta próximamente"
        >
          <p className="text-sm font-semibold text-[#2d4a22]">{NAPOSTA_ENCUESTA_TITULO}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{NAPOSTA_ENCUESTA_TEXTO}</p>
        </section>
      </div>
    </RedesignShell>
  );
}
