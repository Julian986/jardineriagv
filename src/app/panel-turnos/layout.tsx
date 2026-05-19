import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de turnos | Jardinería GV",
  robots: { index: false, follow: false },
};

export default function PanelTurnosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
