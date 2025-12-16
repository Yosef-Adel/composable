import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { IconButton, Stack } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

const meta = {
  title: 'Components/Display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badgeContent: 4,
    color: 'primary',
    children: <MailIcon />,
  },
};

export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Badge badgeContent={4} color="primary">
        <MailIcon />
      </Badge>
      <Badge badgeContent={4} color="secondary">
        <MailIcon />
      </Badge>
      <Badge badgeContent={4} color="error">
        <MailIcon />
      </Badge>
      <Badge badgeContent={4} color="success">
        <MailIcon />
      </Badge>
    </Stack>
  ),
};

export const Dot: Story = {
  args: {
    color: 'error',
    variant: 'dot',
    children: <MailIcon />,
  },
};

export const Max: Story = {
  args: {
    badgeContent: 999,
    max: 99,
    color: 'primary',
    children: <MailIcon />,
  },
};
