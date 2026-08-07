"use client";

import Box from "@mui/material/Box";
import { useState } from "react";

import { AppHeader } from "./app-header";
import { Sidebar } from "./sidebar";

type AppShellProps = Readonly<{ children: React.ReactNode }>;

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minWidth: 0 }}>
        <AppHeader onMenuOpen={() => setMobileOpen(true)} />
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, lg: 4 },
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
