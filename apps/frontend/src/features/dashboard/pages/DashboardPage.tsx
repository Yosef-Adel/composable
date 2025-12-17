import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

export function DashboardPage() {
  const features = [
    {
      title: 'Stacks',
      description: 'Create and manage Docker Compose stacks',
      icon: 'solar:layers-bold-duotone',
      color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      path: '/stacks',
    },
    {
      title: 'Services',
      description: 'Browse available Docker services',
      icon: 'solar:server-bold-duotone',
      color: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
      path: '/services',
    },
    {
      title: 'Templates',
      description: 'Start with pre-built templates',
      icon: 'solar:document-bold-duotone',
      color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      path: '/templates',
    },
    {
      title: 'Deployments',
      description: 'Manage your deployments',
      icon: 'solar:rocket-bold-duotone',
      color: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      path: '/deployments',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Welcome to Composable
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Build and manage your Docker Compose infrastructure visually
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  '& .gradient-overlay': {
                    opacity: 0.1,
                  },
                },
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
                  pointerEvents: 'none',
                }}
              />
              <CardContent sx={{ position: 'relative', p: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    background: feature.color,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Iconify icon={feature.icon} width={32} sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Stats
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'primary.main',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="solar:layers-bold" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4">0</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stacks
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'success.main',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="solar:server-bold" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4">0</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Services
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'warning.main',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="solar:rocket-bold" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4">0</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deployments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'info.main',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon="solar:document-bold" width={24} sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4">0</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Templates
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
