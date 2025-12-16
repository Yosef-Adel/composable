import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { NavVertical } from './dashboard/NavVertical';
import { NavMobile } from './dashboard/NavMobile';
import { Header } from './dashboard/Header';
import { navConfig } from '../config-nav';

export function RootLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Navigation */}
      <NavMobile 
        data={navConfig} 
        open={mobileOpen} 
        onClose={() => setMobileOpen(false)} 
      />

      {/* Desktop Navigation */}
      <NavVertical data={navConfig} />

      {/* Main Content */}
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
        <Header onOpenNav={handleMobileToggle} />
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
