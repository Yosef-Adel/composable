import { Box, Container, Typography, Button, Card } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
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
  );
}
