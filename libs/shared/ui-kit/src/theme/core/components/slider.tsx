import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiSlider: Components<Theme>["MuiSlider"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      height: 6,
      padding: '15px 0',
    }),
    rail: ({ theme }) => ({
      height: 6,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
      opacity: 1,
    }),
    track: ({ theme }) => ({
      height: 6,
      borderRadius: theme.shape.borderRadius,
      border: 'none',
    }),
    thumb: ({ theme }) => ({
      width: 18,
      height: 18,
      backgroundColor: theme.palette.common.white,
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
      '&:hover, &.Mui-focusVisible': {
        boxShadow: `0 0 0 8px ${theme.palette.mode === 'dark'
          ? `${theme.palette.primary.main}20`
          : `${theme.palette.primary.main}10`}`,
      },
      '&.Mui-active': {
        boxShadow: `0 0 0 12px ${theme.palette.mode === 'dark'
          ? `${theme.palette.primary.main}30`
          : `${theme.palette.primary.main}20`}`,
      },
    }),
    valueLabel: ({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[900],
      borderRadius: theme.shape.borderRadius,
      fontSize: '0.75rem',
      fontWeight: 600,
    }),
  },
};

// ----------------------------------------------------------------------

export const slider = { MuiSlider };
