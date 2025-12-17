import { Box, Container, Typography } from '@mui/material';

export function LandingFooter() {
  return (
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
  );
}
