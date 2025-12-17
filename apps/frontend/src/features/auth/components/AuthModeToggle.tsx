import { Box, Button } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import type { AuthMode } from '../types';

interface AuthModeToggleProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthModeToggle({ mode, onModeChange }: AuthModeToggleProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 0.5,
        bgcolor: 'rgba(15, 23, 42, 0.5)',
        borderRadius: 1.5,
        mb: 3,
      }}
    >
      <Button
        onClick={() => onModeChange('login')}
        sx={{
          flex: 1,
          py: 1,
          borderRadius: 1,
          transition: 'all 0.2s',
          bgcolor: mode === 'login' ? 'primary.main' : 'transparent',
          color: mode === 'login' ? 'white' : 'grey.400',
          '&:hover': {
            bgcolor: mode === 'login' ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
            color: mode === 'login' ? 'white' : 'white',
          },
        }}
      >
        <Iconify icon="solar:login-3-bold" width={16} sx={{ mr: 1 }} />
        Login
      </Button>
      <Button
        onClick={() => onModeChange('signup')}
        sx={{
          flex: 1,
          py: 1,
          borderRadius: 1,
          transition: 'all 0.2s',
          bgcolor: mode === 'signup' ? 'primary.main' : 'transparent',
          color: mode === 'signup' ? 'white' : 'grey.400',
          '&:hover': {
            bgcolor: mode === 'signup' ? 'primary.dark' : 'rgba(255, 255, 255, 0.05)',
            color: mode === 'signup' ? 'white' : 'white',
          },
        }}
      >
        <Iconify icon="solar:user-plus-bold" width={16} sx={{ mr: 1 }} />
        Sign Up
      </Button>
    </Box>
  );
}
