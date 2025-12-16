import { useEffect } from 'react';
import { Drawer, Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { NavSection } from './NavSection';
import type { NavSectionProps } from '../types';

interface NavMobileProps extends NavSectionProps {
  open: boolean;
  onClose: () => void;
}

export function NavMobile({ data, open, onClose }: NavMobileProps) {
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: 'background.default',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Inventory System</Typography>
      </Box>

      <NavSection data={data} />
    </Drawer>
  );
}
