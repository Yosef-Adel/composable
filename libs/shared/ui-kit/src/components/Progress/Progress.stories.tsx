import type { Meta, StoryObj } from '@storybook/react';
import { LinearProgress, CircularProgress } from './Progress';
import { Box, Stack, Typography } from '@mui/material';

const linearMeta = {
  title: 'Components/Feedback/LinearProgress',
  component: LinearProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ width: 400 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof LinearProgress>;

export default linearMeta;
type LinearStory = StoryObj<typeof linearMeta>;

export const Indeterminate: LinearStory = {
  args: {
    color: 'primary',
  },
};

export const Determinate: LinearStory = {
  args: {
    variant: 'determinate',
    value: 75,
    color: 'primary',
  },
};

export const CircularDefault: StoryObj<Meta<typeof CircularProgress>> = {
  render: () => (
    <Stack spacing={2} alignItems="center">
      <CircularProgress />
      <CircularProgress size={60} />
      <CircularProgress color="secondary" />
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Circular progress indicators',
      },
    },
  },
};
