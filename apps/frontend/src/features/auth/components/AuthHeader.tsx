import { Box, Typography } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

export function AuthHeader() {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
          borderRadius: 2,
          mb: 2,
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
        }}
      >
        <Iconify icon="solar:box-bold" width={32} sx={{ color: 'white' }} />
      </Box>
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          background: 'linear-gradient(90deg, #60a5fa 0%, #06b6d4 50%, #60a5fa 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Composable
      </Typography>
      <Typography variant="body2" sx={{ color: 'grey.400' }}>
        Build Docker stacks visually
      </Typography>
    </Box>
  );
}
