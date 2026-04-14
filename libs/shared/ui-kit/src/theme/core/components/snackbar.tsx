import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiSnackbar: Components<Theme>["MuiSnackbar"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiSnackbarContent-root': {
        borderRadius: Number(theme.shape.borderRadius) * 1.5,
        fontSize: '0.9375rem',
        fontWeight: 500,
        padding: theme.spacing(1.5, 2),
        boxShadow: theme.shadows[8],
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiSnackbarContent: Components<Theme>["MuiSnackbarContent"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[900],
      padding: theme.spacing(1.5, 2),
    }),
    message: {
      padding: 0,
    },
    action: {
      marginRight: 0,
      paddingLeft: '16px',
    },
  },
};

// ----------------------------------------------------------------------

export const snackbar = { MuiSnackbar, MuiSnackbarContent };
