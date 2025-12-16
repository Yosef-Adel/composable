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
        borderRadius: theme.shape.borderRadius,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.text.primary,
        },
      }),
    },
  },
};
