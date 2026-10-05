import type { Metadata } from "next";
import { Suspense } from "react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Geist } from "next/font/google";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { resolveSeasonCode } from "@/lib/season-selection";
import { getSeasons } from "@/services/season-service";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EuroScoutAI",
  description: "EuroLeague scouting and analytics intelligence.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const seasons = await getSeasons().catch(() => []);
  const initialSeasonCode = await resolveSeasonCode(seasons);
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <ThemeProvider>
          <Suspense fallback={null}>
            <AppShell initialSeasonCode={initialSeasonCode} seasons={seasons}>{children}</AppShell>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
