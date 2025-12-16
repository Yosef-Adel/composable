import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { LoadingScreen, SplashScreen, LogoAnimation } from './index';

const meta = {
  title: 'Components/Feedback/LoadingScreen',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Loading Screen
export const BasicLoadingScreen: Story = {
  render: () => (
    <Box sx={{ height: '400px', display: 'flex' }}>
      <LoadingScreen />
    </Box>
  ),
};

// Loading Screen with Portal
export const WithPortal: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 3000);
    };

    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">
            Click the button to show loading screen for 3 seconds
          </Typography>
          <Button variant="contained" onClick={handleClick}>
            Show Loading Screen
          </Button>
        </Stack>

        {loading && <LoadingScreen portal />}
      </Box>
    );
  },
};

// Basic Splash Screen
export const BasicSplashScreen: Story = {
  render: () => (
    <SplashScreen portal={false} />
  ),
};

// Splash Screen with Portal (Interactive)
export const SplashWithPortal: Story = {
  render: () => {
    const [showing, setShowing] = useState(false);

    const handleClick = () => {
      setShowing(true);
      setTimeout(() => setShowing(false), 3000);
    };

    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">
            Click the button to show splash screen for 3 seconds
          </Typography>
          <Button variant="contained" onClick={handleClick}>
            Show Splash Screen
          </Button>
        </Stack>

        {showing && <SplashScreen portal />}
      </Box>
    );
  },
};

// Custom Logo in Splash Screen
export const CustomLogo: Story = {
  render: () => {
    const customLogo = (
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: 2,
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.contrastText',
          fontSize: 48,
          fontWeight: 'bold',
        }}
      >
        MY
      </Box>
    );

    return <SplashScreen portal={false} logo={customLogo} />;
  },
};

// Logo Animation Only
export const LogoAnimationOnly: Story = {
  render: () => (
    <Box
      sx={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <LogoAnimation />
    </Box>
  ),
};

// Different Colors
export const DifferentColors: Story = {
  render: () => (
    <Stack spacing={2}>
      <Box sx={{ height: '150px', display: 'flex' }}>
        <LoadingScreen sx={{ '& .MuiLinearProgress-root': { color: 'primary.main' } }} />
      </Box>
      <Box sx={{ height: '150px', display: 'flex' }}>
        <LoadingScreen sx={{ '& .MuiLinearProgress-root': { color: 'secondary.main' } }} />
      </Box>
      <Box sx={{ height: '150px', display: 'flex' }}>
        <LoadingScreen sx={{ '& .MuiLinearProgress-root': { color: 'success.main' } }} />
      </Box>
    </Stack>
  ),
};

// Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <Box sx={{ height: '400px', display: 'flex' }}>
      <LoadingScreen
        sx={{
          bgcolor: 'grey.900',
          color: 'primary.main',
          '& .MuiLinearProgress-root': {
            height: 6,
            borderRadius: 3,
            bgcolor: 'grey.800',
          },
        }}
      />
    </Box>
  ),
};

// In Container
export const InContainer: Story = {
  render: () => (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        height: 300,
        position: 'relative',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Content Area
      </Typography>
      <LoadingScreen />
    </Box>
  ),
};

// Simulated Page Load
export const SimulatedPageLoad: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    const handleReload = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <Box sx={{ height: '100vh', position: 'relative' }}>
        {loading ? (
          <SplashScreen portal={false} />
        ) : (
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h4">Page Loaded!</Typography>
              <Typography variant="body1" color="text.secondary">
                Content is now visible after the splash screen.
              </Typography>
              <Button variant="contained" onClick={handleReload}>
                Reload Page
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    );
  },
};
