import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiIconButton: Components<Theme>["MuiIconButton"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[100],
      },
    }),
    colorPrimary: ({ theme }) => ({
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
          ? `${theme.palette.primary.main}20`
          : `${theme.palette.primary.main}10`,
      },
    }),
    sizeLarge: {
      padding: 12,
      fontSize: '1.5rem',
    },
    sizeMedium: {
      padding: 8,
      fontSize: '1.25rem',
    },
    sizeSmall: {
      padding: 4,
      fontSize: '1rem',
    },
  },
};

// ----------------------------------------------------------------------

export const iconbutton = { MuiIconButton };
