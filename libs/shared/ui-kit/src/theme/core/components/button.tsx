import type { Theme, Components } from '@mui/material/styles';

export const button: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        textTransform: 'none',
        fontWeight: 600,
      }),
      sizeLarge: {
        height: 48,
        fontSize: '0.9375rem',
      },
      sizeMedium: {
        height: 40,
      },
      sizeSmall: {
        height: 32,
      },
    },
  },
};
