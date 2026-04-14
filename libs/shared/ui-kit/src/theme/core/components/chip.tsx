import type { Theme, Components } from '@mui/material/styles';

export const chip: Components<Theme> = {
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontWeight: 500,
        borderRadius: Number(theme.shape.borderRadius) * 1.5,
        fontSize: '0.8125rem',
        height: '28px',
      }),
      filled: ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.grey[200],
      }),
      filledPrimary: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[700]
          : theme.palette.grey[300],
        borderWidth: '1.5px',
      }),
    },
  },
};
