import type { Theme, Components } from '@mui/material/styles';

export const chip: Components<Theme> = {
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontWeight: 500,
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
};
