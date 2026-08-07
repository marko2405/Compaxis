import type { PaletteColor, PaletteColorOptions } from "@mui/material/styles";

type ChartPalette = {
  playerA: string;
  playerB: string;
  seriesThree: string;
  seriesFour: string;
  positive: string;
  negative: string;
  neutral: string;
};

declare module "@mui/material/styles" {
  interface Palette {
    ai: PaletteColor;
    positiveMetric: string;
    negativeMetric: string;
    neutralMetric: string;
    selectedRow: string;
    topPerformer: string;
    chart: ChartPalette;
  }

  interface PaletteOptions {
    ai?: PaletteColorOptions;
    positiveMetric?: string;
    negativeMetric?: string;
    neutralMetric?: string;
    selectedRow?: string;
    topPerformer?: string;
    chart?: ChartPalette;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    ai: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    ai: true;
  }
}
