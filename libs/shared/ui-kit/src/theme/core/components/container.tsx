import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiContainer: Components<Theme>["MuiContainer"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    maxWidth: "lg",
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
      [theme.breakpoints.up('lg')]: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const container = { MuiContainer };
