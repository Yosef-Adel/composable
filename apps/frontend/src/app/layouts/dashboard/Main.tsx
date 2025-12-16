import { Box } from '@mui/material';

interface MainProps {
  children: React.ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        ml: { lg: '280px' }, // Width of NavVertical
      }}
    >
      {children}
    </Box>
  );
}
