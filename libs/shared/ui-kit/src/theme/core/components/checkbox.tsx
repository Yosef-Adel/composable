import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiCheckbox: Components<Theme>["MuiCheckbox"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(1),
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
          ? `${theme.palette.primary.main}10`
          : `${theme.palette.primary.main}08`,
      },
      '&.Mui-checked': {
        color: theme.palette.primary.main,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const checkbox = { MuiCheckbox };
