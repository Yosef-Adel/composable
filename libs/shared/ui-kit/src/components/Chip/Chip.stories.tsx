import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import { Stack } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';

const meta = {
  title: 'Components/Display/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Chip',
  },
};

export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <Chip label="Primary" color="primary" />
      <Chip label="Secondary" color="secondary" />
      <Chip label="Success" color="success" />
      <Chip label="Error" color="error" />
    </Stack>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <Chip label="Filled" variant="filled" color="primary" />
      <Chip label="Outlined" variant="outlined" color="primary" />
    </Stack>
  ),
};

export const WithIcon: Story = {
  args: {
    label: 'With Icon',
    icon: <FaceIcon />,
    color: 'primary',
  },
};

export const Deletable: Story = {
  args: {
    label: 'Deletable',
    onDelete: () => console.log('Delete clicked'),
    color: 'primary',
  },
};

export const Clickable: Story = {
  args: {
    label: 'Clickable',
    onClick: () => console.log('Chip clicked'),
    color: 'primary',
  },
};
