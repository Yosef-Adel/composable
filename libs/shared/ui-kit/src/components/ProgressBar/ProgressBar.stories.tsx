import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Box, Button, Stack, Typography, TextField } from '@mui/material';
import { ProgressBar, progressBar } from './ProgressBar';

const meta = {
  title: 'Components/Feedback/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Usage
export const Basic: Story = {
  render: () => {
    return (
      <Box sx={{ p: 3 }}>
        <ProgressBar />
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="h6">Manual Control</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => progressBar.start()}>
              Start
            </Button>
            <Button variant="contained" onClick={() => progressBar.done()}>
              Done
            </Button>
            <Button variant="outlined" onClick={() => progressBar.inc()}>
              Increment
            </Button>
            <Button variant="outlined" onClick={() => progressBar.set(0.5)}>
              Set 50%
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  },
};

// Custom Colors
export const CustomColors: Story = {
  render: () => {
    const [color, setColor] = useState('#00AB55');

    return (
      <Box sx={{ p: 3 }}>
        <ProgressBar color={color} />
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="h6">Custom Color Progress Bar</Typography>
          <TextField
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#00AB55"
            size="small"
            sx={{ maxWidth: 200 }}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => progressBar.start()}>
              Start
            </Button>
            <Button variant="contained" onClick={() => progressBar.done()}>
              Done
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={() => setColor('#00AB55')}>
              Green
            </Button>
            <Button size="small" onClick={() => setColor('#FF5630')}>
              Red
            </Button>
            <Button size="small" onClick={() => setColor('#00B8D9')}>
              Blue
            </Button>
            <Button size="small" onClick={() => setColor('#FFAB00')}>
              Orange
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  },
};

// Custom Height
export const CustomHeight: Story = {
  render: () => {
    const [height, setHeight] = useState(2.5);

    return (
      <Box sx={{ p: 3 }}>
        <ProgressBar height={height} />
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="h6">Custom Height: {height}px</Typography>
          <TextField
            type="number"
            label="Height (px)"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            size="small"
            sx={{ maxWidth: 200 }}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => progressBar.start()}>
              Start
            </Button>
            <Button variant="contained" onClick={() => progressBar.done()}>
              Done
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={() => setHeight(1)}>
              1px
            </Button>
            <Button size="small" onClick={() => setHeight(2.5)}>
              2.5px
            </Button>
            <Button size="small" onClick={() => setHeight(4)}>
              4px
            </Button>
            <Button size="small" onClick={() => setHeight(6)}>
              6px
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  },
};

// Simulated Loading
export const SimulatedLoading: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    const simulateLoad = () => {
      setLoading(true);
      progressBar.start();

      // Simulate progress
      setTimeout(() => progressBar.set(0.4), 500);
      setTimeout(() => progressBar.set(0.7), 1000);
      setTimeout(() => {
        progressBar.done();
        setLoading(false);
      }, 1500);
    };

    return (
      <Box sx={{ p: 3 }}>
        <ProgressBar />
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h6">Simulated Loading Process</Typography>
          <Button
            variant="contained"
            onClick={simulateLoad}
            disabled={loading}
            sx={{ maxWidth: 200 }}
          >
            {loading ? 'Loading...' : 'Start Loading'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            This simulates a typical async operation with progress updates
          </Typography>
        </Stack>
      </Box>
    );
  },
};

// Simulated Route Changes
export const SimulatedRouteChanges: Story = {
  render: () => {
    const [page, setPage] = useState('home');

    useEffect(() => {
      progressBar.start();
      const timer = setTimeout(() => progressBar.done(), 500);
      return () => {
        clearTimeout(timer);
        progressBar.done();
      };
    }, [page]);

    const routes = ['home', 'about', 'products', 'contact'];

    return (
      <Box sx={{ p: 3 }}>
        <ProgressBar />
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h6">Simulated Route Changes</Typography>
          <Typography variant="body2" color="text.secondary">
            Current Page: <strong>/{page}</strong>
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {routes.map((route) => (
              <Button
                key={route}
                variant={page === route ? 'contained' : 'outlined'}
                onClick={() => setPage(route)}
              >
                {route}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Box>
    );
  },
};

// With Options
export const WithOptions: Story = {
  render: () => {
    return (
      <Box sx={{ p: 3 }}>
        <ProgressBar
          options={{
            minimum: 0.3,
            easing: 'ease',
            speed: 500,
            trickle: true,
            trickleSpeed: 200,
          }}
        />
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="h6">With Custom Options</Typography>
          <Typography variant="body2" color="text.secondary">
            minimum: 0.3, speed: 500ms, trickle: enabled
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => progressBar.start()}>
              Start
            </Button>
            <Button variant="contained" onClick={() => progressBar.done()}>
              Done
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  },
};

// Multiple Actions
export const MultipleActions: Story = {
  render: () => {
    const [actions, setActions] = useState<string[]>([]);

    const addAction = (action: string) => {
      setActions((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${action}`]);
    };

    const handleStart = () => {
      progressBar.start();
      addAction('Started progress');
    };

    const handleDone = () => {
      progressBar.done();
      addAction('Completed progress');
    };

    const handleSet = (value: number) => {
      progressBar.set(value);
      addAction(`Set to ${value * 100}%`);
    };

    return (
      <Box sx={{ p: 3 }}>
        <ProgressBar color="#00B8D9" height={4} />
        <Stack spacing={3} sx={{ mt: 4 }}>
          <Typography variant="h6">Progress Actions Log</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button variant="contained" size="small" onClick={handleStart}>
              Start
            </Button>
            <Button variant="outlined" size="small" onClick={() => handleSet(0.2)}>
              20%
            </Button>
            <Button variant="outlined" size="small" onClick={() => handleSet(0.5)}>
              50%
            </Button>
            <Button variant="outlined" size="small" onClick={() => handleSet(0.8)}>
              80%
            </Button>
            <Button variant="contained" size="small" onClick={handleDone}>
              Done
            </Button>
          </Stack>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {actions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No actions yet...
              </Typography>
            ) : (
              actions.map((action, index) => (
                <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {action}
                </Typography>
              ))
            )}
          </Box>
        </Stack>
      </Box>
    );
  },
};
