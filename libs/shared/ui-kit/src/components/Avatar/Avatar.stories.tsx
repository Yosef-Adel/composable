import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';
import { Stack } from '@mui/material';

const meta = {
  title: 'Components/Display/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: 'John Doe',
    children: 'JD',
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar sx={{ width: 32, height: 32 }}>S</Avatar>
      <Avatar sx={{ width: 40, height: 40 }}>M</Avatar>
      <Avatar sx={{ width: 56, height: 56 }}>L</Avatar>
    </Stack>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={4}>
      <Avatar alt="User 1">U1</Avatar>
      <Avatar alt="User 2">U2</Avatar>
      <Avatar alt="User 3">U3</Avatar>
      <Avatar alt="User 4">U4</Avatar>
      <Avatar alt="User 5">U5</Avatar>
    </AvatarGroup>
  ),
};
