import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import { Box, Stack, Chip } from '@mui/material';

const meta = {
  title: 'Components/Layout/Divider',
  component: Divider,
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
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithText: Story = {
  render: () => (
    <Stack spacing={2}>
      <Divider>CENTER</Divider>
      <Divider textAlign="left">LEFT</Divider>
      <Divider textAlign="right">RIGHT</Divider>
    </Stack>
  ),
};

export const WithChip: Story = {
  render: () => (
    <Divider>
      <Chip label="OR" size="small" />
    </Divider>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', height: 100 }}>
      <span>Item 1</span>
      <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
      <span>Item 2</span>
      <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
      <span>Item 3</span>
    </Box>
  ),
};
