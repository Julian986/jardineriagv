"use client";

import { Leaf } from "lucide-react";
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0f1a12] px-4 py-10 text-[#e8f0e9]">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2d5016] to-[#c4933f] shadow-[0_10px_30px_rgba(45,80,22,0.35)]">
          <Leaf className="h-7 w-7 text-white" strokeWidth={2} />
        </div>
        <h1 className="text-[26px] font-bold text-[#c4933f]">Jardinería GV</h1>
        <p className="max-w-xs text-[14px] text-[#a8c4a8]/78">
          Ingresá la contraseña para ver la agenda de visitas.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#1a2e1a] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
      >
        <label htmlFor="panel-password" className="text-[11px] tracking-[0.12em] text-[#a8c4a8]/55">
          Contraseña
        </label>
        <input
          id="panel-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-[#141f14] px-3 py-3 text-[15px] text-[#e8f0e9] outline-none focus:border-[#c4933f]/55"
        />
        {error ? (
          <p role="alert" className="mt-3 text-center text-[13px] text-red-300/95">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isLoading || !password}
          className="mt-5 h-[52px] w-full cursor-pointer rounded-full bg-gradient-to-r from-[#1f5d38] to-[#2d5016] text-[16px] font-semibold text-white shadow-[0_0_24px_rgba(31,93,56,0.28)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isLoading ? "Ingresando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
