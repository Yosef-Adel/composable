import { Box, Container, Typography, Grid } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { WORKFLOW_STEPS } from '../constants/landing-content';

export function HowItWorksSection() {
  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            How It Works
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            From idea to deployment in 4 simple steps
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {WORKFLOW_STEPS.map((workflow, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  {workflow.step}
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'grey.800',
                    border: 1,
                    borderColor: 'grey.700',
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Iconify icon={workflow.icon} width={24} sx={{ color: 'rgb(96, 165, 250)' }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontSize: '1.125rem' }}>
                  {workflow.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {workflow.description}
                </Typography>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', lg: 'block' },
                      position: 'absolute',
                      top: 32,
                      left: 'calc(50% + 2rem)',
                      width: 'calc(100% - 4rem)',
                      height: 2,
                      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.5) 0%, transparent 100%)'
                    }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
