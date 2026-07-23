"use client";

import { LockKeyhole, Package } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelTiendaLoginPage() {
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

      router.replace("/panel-tienda");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f7f5] px-4 py-10 text-[#20231f]">
      <div className="mb-7 flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4eb] text-[#41613a]">
          <Package className="h-7 w-7" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#5f7759]">Jardinería GV</p>
          <h1 className="mt-1 text-2xl font-bold">Administrar tienda</h1>
        </div>
        <p className="max-w-xs text-sm text-[#747a71]">
          Ingresá para controlar productos, precios y categorías.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full max-w-sm rounded-2xl border border-[#e0e4dd] bg-white p-5 shadow-sm sm:p-6"
      >
        <label htmlFor="panel-tienda-password" className="text-sm font-semibold text-[#343833]">
          Contraseña
        </label>
        <div className="relative mt-2">
          <LockKeyhole className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-[#858b82]" />
          <input
            id="panel-tienda-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-xl border border-[#dce1da] bg-white pr-3 pl-10 text-base outline-none focus:border-[#6f8b68] focus:ring-2 focus:ring-[#dce8d8]"
            placeholder="Ingresá tu contraseña"
          />
        </div>
        {error ? (
          <p role="alert" className="mt-3 rounded-lg bg-[#fff3f3] px-3 py-2 text-center text-sm text-[#a53c3c]">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isLoading || !password}
          className="mt-5 h-12 w-full cursor-pointer rounded-xl bg-[#41613a] text-base font-bold text-white shadow-sm hover:bg-[#35532f] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isLoading ? "Ingresando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
