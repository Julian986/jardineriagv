import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jardinería GV — Diseño y mantenimiento de jardines en Bahía Blanca",
  description:
    "Jardinería profesional en Bahía Blanca. Diseño de jardines desde cero, mantenimiento, riego automático y asesoramiento. Agendá una visita sin cargo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollToTopOnNavigate />
        {children}
      </body>
    </html>
  );
}
