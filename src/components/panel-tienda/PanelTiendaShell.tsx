"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, ExternalLink, LogOut, Package, Plus, Tags } from "lucide-react";

const NAV = [
  { href: "/panel-tienda", label: "Productos", exact: true, icon: Package },
  { href: "/panel-tienda/productos/nuevo", label: "Agregar", icon: Plus },
  { href: "/panel-tienda/categorias", label: "Categorías", icon: Tags },
  { href: "/panel-tienda/estadisticas", label: "Estadísticas", icon: BarChart3 },
];
export function PanelTiendaShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/panel/logout", { method: "POST" });
    router.replace("/panel-tienda/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5] pb-20 text-[#20231f] sm:pb-0">
      <header className="sticky top-0 z-30 border-b border-[#e3e6e0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef4eb] text-[#41613a]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-[#7a8177]">Tienda online</p>
              <h1 className="text-base font-bold leading-tight text-[#20231f]">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/tienda"
              target="_blank"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-[#41613a] hover:bg-[#f1f4ef]"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Ver tienda</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#6f756c] hover:bg-[#f1f2f0] hover:text-[#20231f]"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-5xl gap-1 px-4 pb-3 sm:flex">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#eef4eb] text-[#35532f]"
                    : "text-[#62685f] hover:bg-[#f5f6f4] hover:text-[#20231f]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-5 sm:py-7">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[68px] grid-cols-4 border-t border-[#dfe3dc] bg-white px-1 pb-[env(safe-area-inset-bottom)] sm:hidden">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold ${
                active ? "text-[#35532f]" : "text-[#777d74]"
              }`}
            >
              <Icon className={`h-5 w-5 ${item.label === "Agregar" ? "rounded-full bg-[#41613a] p-0.5 text-white" : ""}`} />
              <span className="truncate px-0.5">{item.label === "Estadísticas" ? "Stats" : item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
