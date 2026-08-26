import type { Components, Theme } from "@mui/material/styles";

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: { fontVariantNumeric: "tabular-nums" },
      "::selection": {
        backgroundColor: "var(--euroscout-palette-ai-main)",
        color: "var(--euroscout-palette-ai-contrastText)",
      },
    },
  },
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        border: `1px solid ${theme.vars.palette.divider}`,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 14,
        boxShadow: "0 8px 24px rgba(16, 35, 43, 0.06)",
        ...theme.applyStyles("dark", { boxShadow: "none" }),
      }),
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true, size: "small" },
    styleOverrides: {
      root: { minHeight: 40, borderRadius: 10, padding: "8px 20px" },
      outlined: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
    },
  },
  MuiChip: {
    defaultProps: { size: "small" },
    styleOverrides: { root: { borderRadius: 8, fontWeight: 650 } },
    variants: [
      {
        props: { color: "ai" },
        style: ({ theme }) => ({
          backgroundColor: theme.vars.palette.ai.main,
          color: theme.vars.palette.ai.contrastText,
        }),
      },
    ],
  },
  MuiTable: { defaultProps: { size: "small", stickyHeader: true } },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.vars.palette.divider,
        padding: "10px 12px",
      }),
      head: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.paper,
        color: theme.vars.palette.text.secondary,
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase", 
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:hover": { backgroundColor: theme.vars.palette.action.hover },
        "&.Mui-selected, &.Mui-selected:hover": {
          backgroundColor: theme.vars.palette.selectedRow,
        },
      }),
    },
  },
  MuiAlert: { styleOverrides: { root: { borderRadius: 10 } } },
  MuiTooltip: {
    styleOverrides: { tooltip: { borderRadius: 8, fontSize: "0.75rem" } },
  },
};
