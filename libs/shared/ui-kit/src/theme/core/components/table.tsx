import type { Theme, Components } from '@mui/material/styles';

export const table: Components<Theme> = {
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
      head: ({ theme }) => ({
        fontWeight: 600,
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
};
