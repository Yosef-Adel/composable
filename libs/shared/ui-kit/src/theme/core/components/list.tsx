import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiList: Components<Theme>["MuiList"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: {
      padding: 0,
    },
  },
};

// ----------------------------------------------------------------------

const MuiListItem: Components<Theme>["MuiListItem"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(1, 2),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiListItemButton: Components<Theme>["MuiListItemButton"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(0.5, 1),
      padding: theme.spacing(1.5, 2),
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

const MuiListItemText: Components<Theme>["MuiListItemText"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    primary: () => ({
    }),
    secondary: ({ theme }) => ({
      color: theme.palette.text.secondary,
    }),
  },
};

// ----------------------------------------------------------------------

export const list = { MuiList, MuiListItem, MuiListItemButton, MuiListItemText };
