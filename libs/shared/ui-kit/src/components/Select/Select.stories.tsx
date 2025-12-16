import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { Box } from '@mui/material';

const meta = {
  title: 'Components/Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ minWidth: 300 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
    ],
    defaultValue: 'us',
  },
};

export const WithDisabled: Story = {
  args: {
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom', disabled: true },
      { value: 'ca', label: 'Canada' },
    ],
  },
};

export const Multiple: Story = {
  args: {
    label: 'Countries',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
    ],
    multiple: true,
    defaultValue: ['us', 'ca'],
  },
};
