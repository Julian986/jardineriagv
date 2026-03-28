"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "No se pudo iniciar sesión");
        return;
      }

      router.replace("/panel-turnos");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-white/70 bg-white p-6 shadow-[0_18px_46px_rgba(31,41,55,0.07)]">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[#101828]">
          Panel de turnos
        </h1>
        <p className="mt-2 text-sm text-[#4b5563]">
          Ingresá la contraseña para administrar reservas.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Contraseña
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-[14px] outline-none ring-[#1f5d38]/20 focus:ring-4"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b91c1c]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#1f5d38] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#18492c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}

