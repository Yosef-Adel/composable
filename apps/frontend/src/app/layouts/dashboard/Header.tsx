import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Iconify } from '@composable/ui-kit';
import { ThemeToggle } from '@shared/components/ThemeToggle';

interface HeaderProps {
  onOpenNav: () => void;
}

export function Header({ onOpenNav }: HeaderProps) {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            display: { lg: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Iconify icon="solar:box-bold" width={20} sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ letterSpacing: '-0.02em' }}>
            Composable
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
