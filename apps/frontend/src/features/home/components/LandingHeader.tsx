import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

interface LandingHeaderProps {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export function LandingHeader({ onGetStarted, isLoggedIn, userName }: LandingHeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'rgba(10, 14, 30, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: 1,
        borderColor: 'grey.800'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Iconify icon="solar:box-bold" width={24} sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ letterSpacing: '-0.02em' }}>
            Composable
          </Typography>
        </Box>

        <Button
          onClick={onGetStarted}
          variant="contained"
          endIcon={<Iconify icon="solar:arrow-right-bold" width={16} />}
          sx={{
            px: 3,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          {isLoggedIn ? userName : 'Get Started'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
