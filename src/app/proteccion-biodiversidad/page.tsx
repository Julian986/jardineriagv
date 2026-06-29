import { permanentRedirect } from "next/navigation";
import { RUTA_PROYECTO } from "@/lib/biodiversidad-rutas";

/** URL legada: redirige al detalle del proyecto Canal Maldonado. */
export default function ProteccionBiodiversidadPage() {
  permanentRedirect(RUTA_PROYECTO);
}
