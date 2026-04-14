import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiBreadcrumbs: Components<Theme>["MuiBreadcrumbs"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: () => ({
    }),
    separator: ({ theme }) => ({
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
      color: theme.palette.text.disabled,
    }),
    li: ({ theme }) => ({
      '& a': {
        color: theme.palette.text.secondary,
        textDecoration: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          color: theme.palette.primary.main,
          textDecoration: 'underline',
        },
      },
      '&:last-child': {
        color: theme.palette.text.primary,
        fontWeight: 500,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const breadcrumbs = { MuiBreadcrumbs };
