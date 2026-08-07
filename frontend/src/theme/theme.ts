import { createTheme } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";

import { components } from "./components";
import { darkPalette, lightPalette } from "./palette";
import { typography } from "./typography";

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data",
    cssVarPrefix: "euroscout",
  },
  colorSchemes: {
    light: { palette: lightPalette },
    dark: { palette: darkPalette },
  },
  typography,
  shape: { borderRadius: 10 },
  components,
});
