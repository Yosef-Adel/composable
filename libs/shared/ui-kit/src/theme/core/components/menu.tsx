import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiMenu: Components<Theme>["MuiMenu"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    paper: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
      boxShadow: theme.customShadows.dropdown,
      border: theme.palette.mode === 'dark'
        ? `1px solid ${theme.palette.grey[800]}`
        : 'none',
      marginTop: theme.spacing(1),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiMenuItem: Components<Theme>["MuiMenuItem"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(1.5, 2),
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(0.5, 1),
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[100],
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.mode === 'dark'
          ? `${theme.palette.primary.main}20`
          : `${theme.palette.primary.main}10`,
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? `${theme.palette.primary.main}30`
            : `${theme.palette.primary.main}20`,
        },
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const menu = { MuiMenu, MuiMenuItem };
