import { HistoryBackLink } from "@/components/HistoryBackLink";
import { WhatsAppLink } from "@/components/WhatsAppLink";

export function BiodiversidadPageFooter() {
  return (
    <div className="flex flex-col gap-3 border-t border-[#e4ead8] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <HistoryBackLink
        aria-label="Volver al inicio"
        className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-left"
      >
        ← Volver al inicio
      </HistoryBackLink>
      <WhatsAppLink
        location="footer"
        page="biodiversidad"
        className="text-center text-sm font-medium text-[#2d5016] underline underline-offset-2 hover:opacity-80 sm:text-right"
      >
        Consultar por WhatsApp →
      </WhatsAppLink>
    </div>
  );
}
