import type { Theme, Components } from "@mui/material/styles";

import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiDivider: Components<Theme>["MuiDivider"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderColor: theme.palette.mode === 'dark'
        ? varAlpha(theme.palette.grey["500Channel"], 0.12)
        : varAlpha(theme.palette.grey["500Channel"], 0.2),
    }),
    light: ({ theme }) => ({
      borderColor: theme.palette.mode === 'dark'
        ? varAlpha(theme.palette.grey["500Channel"], 0.08)
        : varAlpha(theme.palette.grey["500Channel"], 0.16),
    }),
  },
};

// ----------------------------------------------------------------------

export const divider = { MuiDivider };
