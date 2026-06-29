import { permanentRedirect } from "next/navigation";
import { RUTA_PROYECTO } from "@/lib/biodiversidad-rutas";

/** URL legada: redirige al detalle del Canal Maldonado. */
export default function ProyectoRioNapostaLegacyPage() {
  permanentRedirect(RUTA_PROYECTO);
}
