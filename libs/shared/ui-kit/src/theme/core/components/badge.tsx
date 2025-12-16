import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiBadge: Components<Theme>["MuiBadge"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    badge: ({ theme }) => ({
      fontWeight: 600,
      fontSize: '0.6875rem',
      height: 20,
      minWidth: 20,
      padding: theme.spacing(0, 0.75),
    }),
    dot: {
      height: 8,
      minWidth: 8,
      borderRadius: '50%',
    },
    standard: ({ theme }) => ({
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }),
  },
};

// ----------------------------------------------------------------------

export const badge = { MuiBadge };
