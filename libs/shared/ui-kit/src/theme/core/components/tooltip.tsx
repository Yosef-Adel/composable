import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiTooltip: Components<Theme>["MuiTooltip"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    tooltip: ({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[900],
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1, 1.5),
      fontSize: '0.8125rem',
      fontWeight: 500,
      boxShadow: theme.shadows[8],
    }),
    arrow: ({ theme }) => ({
      color: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[900],
    }),
  },
};

// ----------------------------------------------------------------------

export const tooltip = { MuiTooltip };
