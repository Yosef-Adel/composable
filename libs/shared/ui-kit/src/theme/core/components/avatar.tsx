import type { Theme, Components } from "@mui/material/styles";

// ----------------------------------------------------------------------

const MuiAvatar: Components<Theme>["MuiAvatar"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[400],
      color: theme.palette.mode === 'dark'
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
      fontWeight: 600,
    }),
    colorDefault: ({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[400],
    }),
  },
};

// ----------------------------------------------------------------------

const MuiAvatarGroup: Components<Theme>["MuiAvatarGroup"] = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    avatar: ({ theme }) => ({
      fontSize: '0.875rem',
      fontWeight: 600,
      border: `2px solid ${theme.palette.background.paper}`,
    }),
  },
};

// ----------------------------------------------------------------------

export const avatar = { MuiAvatar, MuiAvatarGroup };
