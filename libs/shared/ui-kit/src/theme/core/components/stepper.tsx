import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiStepper: Components<Theme>["MuiStepper"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      // Add any custom styles for stepper root
    }),
  },
};

// ----------------------------------------------------------------------

const MuiStepLabel: Components<Theme>["MuiStepLabel"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    label: ({ theme }) => ({
      fontSize: '0.9375rem',
      fontWeight: 500,
      '&.Mui-active': {
        fontWeight: 600,
        color: theme.palette.primary.main,
      },
      '&.Mui-completed': {
        fontWeight: 500,
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiStepIcon: Components<Theme>["MuiStepIcon"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
      '&.Mui-active': {
        color: theme.palette.primary.main,
      },
      '&.Mui-completed': {
        color: theme.palette.primary.main,
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiStepConnector: Components<Theme>["MuiStepConnector"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    line: ({ theme }) => ({
      borderColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    }),
  },
};

// ----------------------------------------------------------------------

export const stepper = { MuiStepper, MuiStepLabel, MuiStepIcon, MuiStepConnector };
