import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiLink: Components<Theme>["MuiLink"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    underline: "hover",
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.primary.main,
      fontWeight: 500,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        color: theme.palette.primary.dark,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const link = { MuiLink };
