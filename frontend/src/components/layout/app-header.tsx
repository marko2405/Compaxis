"use client";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/ui/mode-toggle";

import { getPageTitle } from "./navigation";
import { PlayerSearch } from "./player-search";

type AppHeaderProps = {
  onMenuOpen: () => void;
};

export function AppHeader({ onMenuOpen }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <AppBar
      color="transparent"
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
      }}
    >
      <Toolbar sx={{ gap: 1.5, minHeight: { xs: 60, sm: 64 } }}>
        <IconButton
          aria-label="Open navigation"
          edge="start"
          onClick={onMenuOpen}
          sx={{ display: { md: "none" } }}
        >
          <MenuOutlinedIcon />
        </IconButton>
        <Typography component="div" sx={{ display: { xs: "none", sm: "block" }, flexGrow: 1 }} variant="subtitle1">
          {getPageTitle(pathname)}
        </Typography>
        <Box sx={{ flexGrow: { xs: 1, sm: 0 } }}>
          <PlayerSearch />
        </Box>
        <ModeToggle />
      </Toolbar>
    </AppBar>
  );
}
