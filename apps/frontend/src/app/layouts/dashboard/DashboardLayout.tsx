import { useState } from 'react';
import { Box } from '@mui/material';
import { NavVertical } from './NavVertical';
import { NavMobile } from './NavMobile';
import { Header } from './Header';
import { Main } from './Main';
import type { NavSectionData } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navData: NavSectionData[];
}

export function DashboardLayout({ children, navData }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Navigation */}
      <NavMobile data={navData} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Desktop Navigation */}
      <NavVertical data={navData} />

      {/* Main Content */}
      <Main>
        <Header onOpenNav={handleMobileToggle} />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Main>
    </Box>
  );
}
