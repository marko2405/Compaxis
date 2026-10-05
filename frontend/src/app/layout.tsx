import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { AppShell } from "@/components/layout/app-shell";
import { resolveSeasonCode } from "@/lib/season-selection";
import { getSeasons } from "@/services/season-service";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Compaxis",
    template: "%s | Compaxis",
  },
  description: "EuroLeague scouting and analytics intelligence.",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const seasons = await getSeasons().catch(() => []);
  const initialSeasonCode = await resolveSeasonCode(seasons);
  return (
    <html lang="en" suppressHydrationWarning>
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
