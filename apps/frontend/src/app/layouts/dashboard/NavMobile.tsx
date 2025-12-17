import { useEffect } from 'react';
import { Drawer, Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Iconify } from '@composable/ui-kit';
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
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
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

      <NavSection data={data} />
    </Drawer>
  );
}
