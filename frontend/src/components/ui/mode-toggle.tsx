"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";

export function ModeToggle() {
  const { mode, setMode, systemMode } = useColorScheme();
  const activeMode = mode === "system" ? systemMode : mode;
  const isDark = activeMode === "dark";

  return (
    <Tooltip title={isDark ? "Use light mode" : "Use dark mode"}>
      <IconButton
        aria-label={isDark ? "Use light mode" : "Use dark mode"}
        color="inherit"
        onClick={() => setMode(isDark ? "light" : "dark")}
      >
        {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}
