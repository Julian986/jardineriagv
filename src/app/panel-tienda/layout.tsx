import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel tienda | Jardinería GV",
  robots: { index: false, follow: false },
};

export default function PanelTiendaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
