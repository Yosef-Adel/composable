import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { FEATURES } from '../constants/landing-content';

export function FeaturesGrid() {
  return (
    <Box sx={{ py: 10, bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Everything You Need to Succeed
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            Powerful tools for building and deploying container infrastructure
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {FEATURES.map((feature, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  bgcolor: 'rgba(30, 41, 59, 0.5)',
                  border: 1,
                  borderColor: 'grey.700',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'grey.600',
                    '& .gradient-overlay': {
                      opacity: 0.05
                    }
                  }
                }}
              >
                <Box
                  className="gradient-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: feature.color,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    borderRadius: 'inherit',
                    pointerEvents: 'none'
                  }}
                />
                <CardContent sx={{ position: 'relative', p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      background: feature.color,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Iconify icon={feature.icon} width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
