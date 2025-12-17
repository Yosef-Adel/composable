import { Box, Container, Typography, Grid, Card } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { BENEFITS } from '../constants/landing-content';

export function BenefitsSection() {
  return (
    <Box sx={{ py: 10, bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Why Composable?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {BENEFITS.map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Iconify icon="solar:check-circle-bold" width={20} sx={{ color: 'success.main', mt: 0.25, flexShrink: 0 }} />
                  <Typography sx={{ color: 'grey.300' }}>{benefit}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ bgcolor: 'grey.800', border: 1, borderColor: 'grey.700', p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: 1.5, border: 1, borderColor: 'grey.700' }}>
                  <Iconify icon="solar:database-bold" width={32} sx={{ color: 'rgb(96, 165, 250)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>PostgreSQL</Typography>
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>postgres:15-alpine</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 2, height: 32, background: 'linear-gradient(180deg, #3b82f6 0%, #22c55e 100%)' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: 1.5, border: 1, borderColor: 'grey.700' }}>
                  <Iconify icon="solar:server-bold" width={32} sx={{ color: 'rgb(74, 222, 128)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Node.js API</Typography>
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>node:18-alpine</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: 2, height: 32, background: 'linear-gradient(180deg, #22c55e 0%, #f97316 100%)' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(15, 23, 42, 0.5)', borderRadius: 1.5, border: 1, borderColor: 'grey.700' }}>
                  <Iconify icon="solar:network-bold" width={32} sx={{ color: 'rgb(251, 146, 60)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>NGINX</Typography>
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>nginx:alpine</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
