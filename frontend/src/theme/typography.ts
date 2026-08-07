import type { TypographyVariantsOptions } from "@mui/material/styles";

export const typography: TypographyVariantsOptions = {
  fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  h1: {
    fontSize: "2rem",
    fontWeight: 700,
    letterSpacing: "-0.035em",
    lineHeight: 1.15,
  },
  h2: {
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
  },
  h3: { fontSize: "1.125rem", fontWeight: 650, lineHeight: 1.3 },
  subtitle1: {
    fontSize: "0.9375rem",
    fontWeight: 650,
    lineHeight: 1.4,
  },
  body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
  body2: { fontSize: "0.875rem", lineHeight: 1.55 },
  button: {
    fontSize: "0.875rem",
    fontWeight: 650,
    letterSpacing: "0.005em",
    textTransform: "none",
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.015em",
    lineHeight: 1.45,
  },
  overline: {
    fontSize: "0.6875rem",
    fontWeight: 700,
    letterSpacing: "0.09em",
    lineHeight: 1.6,
  },
};
