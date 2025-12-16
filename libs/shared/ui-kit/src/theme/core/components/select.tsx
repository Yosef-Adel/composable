import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiSelect: Components<Theme>["MuiSelect"] = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    variant: "outlined",
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius * 1.5,
    }),
  },
};

// ----------------------------------------------------------------------

export const select = { MuiSelect };
