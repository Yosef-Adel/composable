import type { Theme, Components } from '@mui/material/styles';

export const dialog: Components<Theme> = {
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: theme.customShadows.dialog,
      }),
    },
  },
};
