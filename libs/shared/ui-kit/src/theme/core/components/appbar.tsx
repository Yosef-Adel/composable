import type { Theme, Components } from '@mui/material/styles';
import { varAlpha } from '../../styles';

export const appbar: Components<Theme> = {
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? varAlpha(theme.palette.background.paper, 0.8)
          : theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.divider}`,
      }),
      colorPrimary: ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.background.default
          : theme.palette.primary.main,
      }),
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: '64px',
        '@media (min-width: 600px)': {
          minHeight: '72px',
        },
      },
    },
  },
};
