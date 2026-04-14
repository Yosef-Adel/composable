import type { Theme, Components } from "@mui/material/styles";

import { accordionClasses } from "@mui/material/Accordion";
import { typographyClasses } from "@mui/material/Typography";
import { accordionSummaryClasses } from "@mui/material/AccordionSummary";

// ----------------------------------------------------------------------

const MuiAccordion: Components<Theme>["MuiAccordion"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: "transparent",
      borderRadius: Number(theme.shape.borderRadius) * 1.5,
      border: theme.palette.mode === 'dark'
        ? `1px solid ${theme.palette.grey[800]}`
        : `1px solid ${theme.palette.grey[300]}`,
      marginBottom: theme.spacing(1),
      '&:before': {
        display: 'none',
      },
      [`&.${accordionClasses.expanded}`]: {
        boxShadow: theme.customShadows.z8,
        backgroundColor: theme.palette.background.paper,
        margin: theme.spacing(1, 0),
      },
      [`&.${accordionClasses.disabled}`]: {
        backgroundColor: "transparent",
        opacity: 0.5,
      },
    }),
  },
};

// ----------------------------------------------------------------------

const MuiAccordionSummary: Components<Theme>["MuiAccordionSummary"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      [`&.${accordionSummaryClasses.disabled}`]: {
        opacity: 1,
        color: theme.palette.action.disabled,
        [`& .${typographyClasses.root}`]: { color: "inherit" },
      },
    }),
    expandIconWrapper: { color: "inherit" },
  },
};

// ----------------------------------------------------------------------

export const accordion = { MuiAccordion, MuiAccordionSummary };
