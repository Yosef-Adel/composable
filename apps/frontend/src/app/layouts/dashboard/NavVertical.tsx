import { Box, Typography } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { NavSection } from './NavSection';
import type { NavSectionProps } from '../types';

export function NavVertical({ data }: NavSectionProps) {
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        height: '100vh',
        position: 'fixed',
        bgcolor: 'background.default',
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'auto',
        display: { xs: 'none', lg: 'block' },
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
    </Box>
  );
}
