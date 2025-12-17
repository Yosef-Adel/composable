import { Box, Container, Typography, Button, Grid, Card, CardContent, AppBar, Toolbar, Chip } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

interface LandingPageProps {
  onGetStarted: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export function LandingPage({ onGetStarted, isLoggedIn, userName }: LandingPageProps) {
  const features = [
    {
      icon: 'solar:star-bold-duotone',
      title: 'Template Library',
      description: 'Start quickly with pre-built templates for common stacks. From NGINX to Kubernetes, we have you covered.',
      color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
    },
    {
      icon: 'solar:magnifier-bold-duotone',
      title: 'Smart Validation',
      description: 'Real-time validation with best practices and automatic warnings. Never miss critical configurations.',
      color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
    },
    {
      icon: 'solar:rocket-bold',
      title: 'Deployment Tools',
      description: 'Deploy to Docker Compose, Swarm, or Kubernetes with built-in commands and full documentation.',
      color: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
    },
    {
      icon: 'solar:lock-keyhole-bold',
      title: 'Secrets Management',
      description: 'Manage environment variables and secrets securely with built-in interface and .env export.',
      color: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
    },
    {
      icon: 'solar:fork-bold',
      title: 'Self-Hostable',
      description: 'Zero external dependencies. Self-host and maintain full control of your data.',
      color: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)'
    },
    {
      icon: 'solar:bolt-bold',
      title: 'Visual Builder',
      description: 'Drag-and-drop interface for building Docker Compose stacks without memorizing YAML syntax.',
      color: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
    }
  ];

  const workflows = [
    {
      step: '1',
      title: 'Choose Your Services',
      description: 'Click services from the palette or start with a template',
      icon: 'solar:server-bold'
    },
    {
      step: '2',
      title: 'Connect Dependencies',
      description: 'Drag to connect services and create dependencies visually',
      icon: 'solar:network-bold'
    },
    {
      step: '3',
      title: 'Configure Properties',
      description: 'Set ports, environment, volumes, and resources',
      icon: 'solar:code-bold'
    },
    {
      step: '4',
      title: 'Deploy',
      description: 'Download YAML and get commands to deploy',
      icon: 'solar:rocket-bold'
    }
  ];

  const benefits = [
    'Intuitive visual interface - no need to memorize YAML syntax',
    'Real-time configuration generation',
    'Built-in best practices validation',
    'Secret management without committing to version control',
    'Multi-platform deployment support',
    'Production-ready templates',
    'Fully self-hostable - your data stays yours',
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navigation */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'rgba(10, 14, 30, 0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: 1,
          borderColor: 'grey.800'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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

          <Button
            onClick={onGetStarted}
            variant="contained"
            endIcon={<Iconify icon="solar:arrow-right-bold" width={16} />}
            sx={{
              px: 3,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            {isLoggedIn ? userName : 'Get Started'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
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
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                borderColor: 'grey.800',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'grey.700',
                  bgcolor: 'grey.900'
                }
              }}
            >
              View Demo
            </Button>
          </Box>

          {/* Preview Image Placeholder */}
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

      {/* Features Grid */}
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
            {features.map((feature, index) => (
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

      {/* How It Works */}
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
            {workflows.map((workflow, index) => (
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
                  {index < workflows.length - 1 && (
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

      {/* Benefits Section */}
      <Box sx={{ py: 10, bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, lg: 6 }}>
              <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                Why Composable?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {benefits.map((benefit, index) => (
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

      {/* CTA Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Card
            sx={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)',
              border: 1,
              borderColor: 'rgba(59, 130, 246, 0.2)',
              p: 6,
              textAlign: 'center'
            }}
          >
            <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, fontWeight: 400 }}>
              Start building your container infrastructure visually today
            </Typography>
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
              Open Dashboard
            </Button>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: 1, borderColor: 'grey.800', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'grey.500' }}>
              © 2024 Composable. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.500', mt: 1 }}>
              Open-source, self-hostable Docker Compose builder
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
