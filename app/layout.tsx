import type { Metadata } from "next";

import "./globals.css";
import { Header } from "@/components/Header";
import { fontDisplay, fontMono, fontSans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Axialent · Impact Record",
  description: "Historic survey impact analytics for Axialent leadership",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = `${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`;
  return (
    <html lang="en" className={fontVars}>
      <body className="min-h-screen bg-paper">
        <Header />
        <main className="mx-auto max-w-7xl px-8 py-10">{children}</main>
        <footer className="mx-auto max-w-7xl border-t border-ink-100 px-8 py-6">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-eyebrow text-ink-400">
            <span>Source · normalized survey data · 205 records</span>
            <span>Axialent · Impact Record · 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
