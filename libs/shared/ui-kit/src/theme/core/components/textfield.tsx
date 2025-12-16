import type { Theme, Components } from '@mui/material/styles';

export const textfield: Components<Theme> = {
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius * 1.5,
        backgroundColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[900]
          : theme.palette.background.paper,
        transition: 'all 0.2s ease-in-out',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused': {
          backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.background.paper,
        },
      }),
      notchedOutline: ({ theme }) => ({
        borderColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[700]
          : theme.palette.grey[300],
        borderWidth: '1.5px',
      }),
      input: ({ theme }) => ({
        padding: '12px 16px',
        fontSize: '0.9375rem',
        '&::placeholder': {
          color: theme.palette.text.disabled,
          opacity: 1,
        },
      }),
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.secondary,
        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },
      }),
    },
  },
};
