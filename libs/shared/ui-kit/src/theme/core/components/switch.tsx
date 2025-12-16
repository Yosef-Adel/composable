import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiSwitch: Components<Theme>["MuiSwitch"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: {
      width: 48,
      height: 28,
      padding: 0,
      display: 'flex',
    },
    switchBase: ({ theme }) => ({
      padding: 2,
      color: theme.palette.common.white,
      '&.Mui-checked': {
        transform: 'translateX(20px)',
        color: theme.palette.common.white,
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.primary.main,
          opacity: 1,
          border: 'none',
        },
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.3,
      },
    }),
    thumb: {
      boxShadow: '0 2px 4px 0 rgb(0 0 0 / 20%)',
      width: 24,
      height: 24,
      borderRadius: 12,
    },
    track: ({ theme }) => ({
      borderRadius: 14,
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[400],
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 300,
      }),
    }),
  },
};

// ----------------------------------------------------------------------

export const switchComponent = { MuiSwitch };
