import type { Theme, Components } from '@mui/material/styles';
import { varAlpha } from '../../styles';

export const table: Components<Theme> = {
  MuiTable: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderCollapse: 'separate',
        borderSpacing: 0,
      }),
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius * 1.5,
        border: theme.palette.mode === 'dark'
          ? `1px solid ${theme.palette.grey[800]}`
          : `1px solid ${theme.palette.grey[300]}`,
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? varAlpha(theme.palette.grey['900'], 0.5)
          : theme.palette.grey[50],
      }),
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiTableRow-root:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? varAlpha(theme.palette.primary.main, 0.08)
            : varAlpha(theme.palette.primary.main, 0.04),
        },
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        transition: 'background-color 0.2s ease-in-out',
        '&:last-child .MuiTableCell-root': {
          borderBottom: 'none',
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.mode === 'dark'
          ? theme.palette.grey[800]
          : theme.palette.divider}`,
        padding: theme.spacing(2),
      }),
      head: ({ theme }) => ({
        fontWeight: 600,
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
        backgroundColor: 'transparent',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }),
    },
  },
};
