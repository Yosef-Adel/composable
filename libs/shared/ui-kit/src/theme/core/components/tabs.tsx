import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiTabs: Components<Theme>["MuiTabs"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderBottom: `1px solid ${theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.divider}`,
    }),
    indicator: ({ theme }) => ({
      height: 3,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.primary.main,
    }),
  },
};

// ----------------------------------------------------------------------

const MuiTab: Components<Theme>["MuiTab"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9375rem',
      minHeight: 48,
      padding: theme.spacing(1.5, 2),
      color: theme.palette.text.secondary,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[100],
      },
      '&.Mui-selected': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const tabs = { MuiTabs, MuiTab };
