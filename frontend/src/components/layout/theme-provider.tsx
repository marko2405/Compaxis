"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { theme } from "@/theme/theme";

type ThemeProviderProps = Readonly<{ children: React.ReactNode }>;

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <MuiThemeProvider
        theme={theme}
        defaultMode="system"
        disableTransitionOnChange
      >
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
