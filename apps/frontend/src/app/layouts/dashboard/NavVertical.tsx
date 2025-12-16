import { Box } from '@mui/material';
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
      <Box sx={{ p: 3 }}>
        <Box component="h6" sx={{ m: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          Inventory System
        </Box>
      </Box>

      <NavSection data={data} />
    </Box>
  );
}
