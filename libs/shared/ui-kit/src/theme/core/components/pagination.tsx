import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiPagination: Components<Theme>["MuiPagination"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: {
      // Add any custom styles for pagination root
    },
  },
};

// ----------------------------------------------------------------------

const MuiPaginationItem: Components<Theme>["MuiPaginationItem"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
      fontWeight: 500,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[100],
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 600,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    }),
    outlined: ({ theme }) => ({
      border: `1px solid ${theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300]}`,
    }),
  },
};

// ----------------------------------------------------------------------

export const pagination = { MuiPagination, MuiPaginationItem };
