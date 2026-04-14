import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiCard: Components<Theme>["MuiCard"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      position: "relative",
      boxShadow: theme.customShadows.card,
      borderRadius: Number(theme.shape.borderRadius) * 2.5,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
      border: theme.palette.mode === 'dark'
        ? `1px solid ${theme.palette.grey[800]}`
        : 'none',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.palette.mode === 'dark'
          ? `0 8px 24px ${theme.palette.primary.main}20`
          : theme.customShadows.card,
      },
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.background.paper,
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCardHeader: Components<Theme>["MuiCardHeader"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    titleTypographyProps: { variant: "h6" },
    subheaderTypographyProps: {
      variant: "body2",
      marginTop: "4px",
      sx: { opacity: 0.7 }
    },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCardContent: Components<Theme>["MuiCardContent"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
      '&:last-child': {
        paddingBottom: theme.spacing(3),
      }
    })
  },
};

// ----------------------------------------------------------------------

export const card = { MuiCard, MuiCardHeader, MuiCardContent };
