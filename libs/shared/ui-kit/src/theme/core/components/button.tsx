import type { Theme, Components } from '@mui/material/styles';

export const button: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: false,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: Number(theme.shape.borderRadius) * 1.5,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        padding: '12px 24px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-1px)',
        },
      }),
      contained: ({ theme }) => ({
        boxShadow: theme.shadows[0],
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }),
      containedPrimary: ({ theme }) => ({
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
        '&:hover': {
          background: theme.palette.primary.dark,
          boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
        },
      }),
      outlined: ({ theme }) => ({
        borderWidth: '1.5px',
        borderColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[700]
          : theme.palette.grey[300],
        color: theme.palette.mode === 'dark'
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
        '&:hover': {
          borderWidth: '1.5px',
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.mode === 'dark'
            ? `${theme.palette.primary.main}10`
            : `${theme.palette.primary.main}08`,
        },
      }),
      sizeLarge: {
        height: 52,
        fontSize: '1.0625rem',
        padding: '14px 32px',
      },
      sizeMedium: {
        height: 44,
        fontSize: '0.9375rem',
        padding: '12px 24px',
      },
      sizeSmall: {
        height: 36,
        fontSize: '0.875rem',
        padding: '8px 16px',
      },
    },
  },
};
