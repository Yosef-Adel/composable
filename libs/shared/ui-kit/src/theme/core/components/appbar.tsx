import type { Theme, Components } from '@mui/material/styles';

export const appbar: Components<Theme> = {
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
};
