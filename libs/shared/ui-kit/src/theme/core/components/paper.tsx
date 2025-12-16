import type { Theme, Components } from "@mui/material/styles";

import { varAlpha } from "../../styles";

// ----------------------------------------------------------------------

const MuiPaper: Components<Theme>["MuiPaper"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { elevation: 0 },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundImage: "none",
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.background.paper,
    }),
    outlined: ({ theme }) => ({
      borderColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : varAlpha(theme.palette.grey["500Channel"], 0.16),
    }),
    elevation1: ({ theme }) => ({
      boxShadow: theme.palette.mode === 'dark'
        ? `0 1px 3px ${varAlpha(theme.palette.common.black, 0.3)}`
        : theme.shadows[1],
    }),
  },
};

// ----------------------------------------------------------------------

export const paper = { MuiPaper };
