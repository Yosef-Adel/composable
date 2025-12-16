import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
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

        <Typography variant="h6" sx={{ display: { xs: 'none', lg: 'block' } }}>
          Dashboard
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}
