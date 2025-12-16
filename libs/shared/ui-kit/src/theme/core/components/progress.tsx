import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiLinearProgress: Components<Theme>["MuiLinearProgress"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
      height: 8,
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[200],
    }),
    bar: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCircularProgress: Components<Theme>["MuiCircularProgress"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: {
      // Add any custom styles for circular progress
    },
  },
};

// ----------------------------------------------------------------------

export const progress = { MuiLinearProgress, MuiCircularProgress };
