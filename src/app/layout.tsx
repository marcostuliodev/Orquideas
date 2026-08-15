import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "Orquídeas — Cultivo Inteligente",
  description:
    "Micro SaaS para cultivo de orquídeas: acervo de cultivo, calendário sazonal, clima e controle de mudas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#2f6850" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body>
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
