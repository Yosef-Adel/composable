import type { Theme, Components } from '@mui/material/styles';

export const dialog: Components<Theme> = {
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius * 2.5,
        boxShadow: theme.customShadows.dialog,
        backgroundColor: theme.palette.background.paper,
        border: theme.palette.mode === 'dark'
          ? `1px solid ${theme.palette.grey[800]}`
          : 'none',
      }),
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
        fontSize: '1.25rem',
        fontWeight: 600,
      }),
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(3),
      }),
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2, 3, 3),
        gap: theme.spacing(1),
      }),
    },
  },
};
