import { Box, Container, Typography, Button, Chip, Card, Grid } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <Container maxWidth="lg" sx={{ pt: 20, pb: 10 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Chip
          icon={<Iconify icon="solar:bolt-bold" width={16} />}
          label="Visual Docker Compose Builder"
          sx={{
            mb: 4,
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: 'rgb(96, 165, 250)',
            '& .MuiChip-icon': { color: 'rgb(96, 165, 250)' }
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
            mb: 3,
            background: 'linear-gradient(90deg, #60a5fa 0%, #06b6d4 50%, #60a5fa 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}
        >
          Build Infrastructure Visually
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 6,
            maxWidth: 800,
            mx: 'auto',
            color: 'text.secondary',
            lineHeight: 1.7,
            fontWeight: 400
          }}
        >
          Composable is a modern Docker Compose builder designed for developers who want simplicity without sacrificing power. Create production-ready stacks using templates, validate configurations in real-time, manage secrets securely, and deploy with confidence - all through an intuitive web interface.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            onClick={onGetStarted}
            variant="contained"
            size="large"
            endIcon={<Iconify icon="solar:arrow-right-bold" width={20} />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.125rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
              '&:hover': {
                boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)'
              }
            }}
          >
            Start Building
          </Button>
        </Box>

        <Box sx={{ mt: 8, position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #0A0E1E 0%, transparent 50%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />
          <Card sx={{ bgcolor: 'grey.900', border: 1, borderColor: 'grey.800', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'grey.800', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'grey.700' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#eab308' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#22c55e' }} />
              <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                composable.app/dashboard
              </Typography>
            </Box>
            <Box sx={{ p: 4, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)' }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)', border: 1, borderColor: 'rgba(59, 130, 246, 0.3)', borderRadius: 1.5, height: 128 }} />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)', border: 1, borderColor: 'rgba(34, 197, 94, 0.3)', borderRadius: 1.5, height: 128 }} />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)', border: 1, borderColor: 'rgba(249, 115, 22, 0.3)', borderRadius: 1.5, height: 128 }} />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', border: 1, borderColor: 'grey.700', borderRadius: 1.5, height: 192 }} />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', border: 1, borderColor: 'grey.700', borderRadius: 1.5, height: 192 }} />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
