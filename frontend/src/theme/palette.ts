import type { PaletteOptions } from "@mui/material/styles";

export const brandColors = {
  deepTeal: "#042F34",
  charcoalTeal: "#16232B",
  mintGreen: "#B5F2DB",
  paleBlueGray: "#E4EEF0",
  warmYellow: "#FFC933",
} as const;

export const lightPalette: PaletteOptions = {
  mode: "light",
  background: { default: "#F2F6F6", paper: "#FFFFFF" },
  primary: {
    light: "#23777B",
    main: "#075E63",
    dark: brandColors.deepTeal,
    contrastText: "#FFFFFF",
  },
  secondary: {
    light: "#678E96",
    main: "#3F6F78",
    dark: "#294F57",
    contrastText: "#FFFFFF",
  },
  ai: {
    light: "#DDF8EC",
    main: brandColors.mintGreen,
    dark: "#237A67",
    contrastText: brandColors.deepTeal,
  },
  success: { main: "#237A57", contrastText: "#FFFFFF" },
  warning: {
    main: brandColors.warmYellow,
    contrastText: brandColors.charcoalTeal,
  },
  error: { main: "#B64B4B", contrastText: "#FFFFFF" },
  text: { primary: brandColors.charcoalTeal, secondary: "#587078" },
  divider: "#D5E3E6",
  action: { hover: "#EDF4F4", selected: "#DDF5EC" },
  positiveMetric: "#237A57",
  negativeMetric: "#B64B4B",
  neutralMetric: "#6B7F86",
  selectedRow: "#DDF5EC",
  topPerformer: brandColors.warmYellow,
  chart: {
    playerA: brandColors.mintGreen,
    playerB: "#4F7EA8",
    seriesThree: brandColors.warmYellow,
    seriesFour: "#5E8490",
    positive: "#237A57",
    negative: "#C75B55",
    neutral: "#82969C",
  },
};

export const darkPalette: PaletteOptions = {
  mode: "dark",
  background: { default: "#101A20", paper: brandColors.charcoalTeal },
  primary: {
    light: "#D8F8EB",
    main: brandColors.mintGreen,
    dark: "#72C9A8",
    contrastText: brandColors.deepTeal,
  },
  secondary: {
    light: "#A9C7CD",
    main: "#87AEB6",
    dark: "#5F848C",
    contrastText: "#101A20",
  },
  ai: {
    light: "#D8F8EB",
    main: brandColors.mintGreen,
    dark: "#72C9A8",
    contrastText: brandColors.deepTeal,
  },
  success: { main: "#72D6A7", contrastText: "#0D261D" },
  warning: {
    main: brandColors.warmYellow,
    contrastText: brandColors.charcoalTeal,
  },
  error: { main: "#F08B83", contrastText: "#2A1110" },
  text: { primary: "#F4F8F8", secondary: "#A9BEC3" },
  divider: "#2D414A",
  action: { hover: "#1D3038", selected: "#203F3C" },
  positiveMetric: "#72D6A7",
  negativeMetric: "#F08B83",
  neutralMetric: "#87A0A7",
  selectedRow: "#203F3C",
  topPerformer: brandColors.warmYellow,
  chart: {
    playerA: brandColors.mintGreen,
    playerB: "#78A9D1",
    seriesThree: brandColors.warmYellow,
    seriesFour: "#91A9C0",
    positive: "#72D6A7",
    negative: "#F08B83",
    neutral: "#87A0A7",
  },
};
