import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
        Go Home
      </Button>
    </Box>
  );
}
