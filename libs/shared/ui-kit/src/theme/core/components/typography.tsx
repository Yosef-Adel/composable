import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiTypography: Components<Theme>["MuiTypography"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    gutterBottom: {
      marginBottom: '0.75em',
    },
    h1: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontWeight: 700,
    }),
    h2: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontWeight: 700,
    }),
    h3: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontWeight: 700,
    }),
    h4: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontWeight: 700,
    }),
    h5: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontWeight: 600,
    }),
    h6: ({ theme }) => ({
      color: theme.palette.text.primary,
      fontWeight: 600,
    }),
    subtitle1: ({ theme }) => ({
      color: theme.palette.text.secondary,
    }),
    subtitle2: ({ theme }) => ({
      color: theme.palette.text.secondary,
    }),
    body1: ({ theme }) => ({
      color: theme.palette.text.primary,
    }),
    body2: ({ theme }) => ({
      color: theme.palette.text.secondary,
    }),
    caption: ({ theme }) => ({
      color: theme.palette.text.secondary,
    }),
  },
};

// ----------------------------------------------------------------------

export const typography = { MuiTypography };
