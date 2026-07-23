"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useTiendaCart } from "@/components/tienda/TiendaCartContext";
import { extractPaymentIdFromReturnUrl } from "@/lib/mercadopago/return-url";
import { RUTA_CHECKOUT, RUTA_TIENDA } from "@/lib/tienda-routes";

type Status = "loading" | "confirmed" | "pending" | "failed" | "unknown";

export function TiendaGraciasClient() {
  const { clearCart } = useTiendaCart();
  const [status, setStatus] = useState<Status>("loading");
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mp = params.get("mp");
    const id = params.get("pedido_id");
    setPedidoId(id);

    if (mp === "failure") {
      setStatus("failed");
      return;
    }

    // Si volvió de MP (success/pending), vaciamos el carrito local
    if (mp === "success" || mp === "pending") {
      clearCart();
    }

    const paymentId = extractPaymentIdFromReturnUrl(params);
    if (mp === "success" && paymentId) {
      fetch("/api/tienda/pedidos/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })
        .then((r) => r.json())
        .then((data: { ok?: boolean }) => {
          setStatus(data.ok ? "confirmed" : "pending");
        })
        .catch(() => setStatus("pending"));
      return;
    }

    if (mp === "pending") {
      setStatus("pending");
      return;
    }

    if (mp === "success") {
      setStatus("pending");
      return;
    }

    setStatus("unknown");
  }, [clearCart]);
  const copy = {
    loading: {
      icon: Clock3,
      title: "Confirmando tu pago…",
      text: "Estamos verificando el pago con Mercado Pago.",
      tone: "text-[#41613a]",
      box: "border-[#d7e3d2] bg-[#f3f7f1]",
    },
    confirmed: {
      icon: CheckCircle2,
      title: "¡Pago recibido!",
      text: "Guillermo se va a comunicar por WhatsApp para coordinar la entrega o el retiro.",
      tone: "text-[#2d4a22]",
      box: "border-[#c8d9b8] bg-[#f0f5ea]",
    },
    pending: {
      icon: Clock3,
      title: "Pago en proceso",
      text: "Cuando se acredite, te contactamos para coordinar. Si ya pagaste, no hace falta repetir la compra.",
      tone: "text-[#7a5a12]",
      box: "border-[#e8d5a8] bg-[#fff8eb]",
    },
    failed: {
      icon: XCircle,
      title: "No se completó el pago",
      text: "Podés volver al checkout e intentarlo de nuevo cuando quieras.",
      tone: "text-[#a53c3c]",
      box: "border-[#f0caca] bg-[#fff5f5]",
    },
    unknown: {
      icon: CheckCircle2,
      title: "Gracias por tu compra",
      text: "Si pagaste con Mercado Pago, te vamos a contactar para coordinar la entrega.",
      tone: "text-[#2d4a22]",
      box: "border-[#d7e3d2] bg-[#f3f7f1]",
    },
  }[status];

  const Icon = copy.icon;

  return (
    <div className={`rounded-2xl border px-6 py-10 text-center shadow-sm sm:px-10 ${copy.box}`}>
      <Icon className={`mx-auto h-12 w-12 ${copy.tone}`} />
      <h1 className={`mt-4 font-display text-3xl font-bold ${copy.tone}`}>{copy.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#555]">{copy.text}</p>
      {pedidoId ? (
        <p className="mt-3 text-xs text-[#888]">Referencia de pedido: {pedidoId}</p>
      ) : null}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {status === "failed" ? (
          <Link
            href={RUTA_CHECKOUT}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#2d4a22] px-6 text-sm font-bold text-white"
          >
            Volver al checkout
          </Link>
        ) : null}
        <Link
          href={RUTA_TIENDA}
          className="inline-flex h-11 items-center justify-center rounded-full border border-[#2d4a22] px-6 text-sm font-bold text-[#2d4a22]"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
