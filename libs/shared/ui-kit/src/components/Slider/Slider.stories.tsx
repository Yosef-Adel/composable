import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';
import { Box, Stack } from '@mui/material';

const meta = {
  title: 'Components/Input/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ width: 300, p: 2 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 30,
  },
};

export const WithMarks: Story = {
  args: {
    defaultValue: 30,
    marks: true,
    step: 10,
    min: 0,
    max: 100,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 40],
    valueLabelDisplay: 'auto',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 30,
    disabled: true,
  },
};
