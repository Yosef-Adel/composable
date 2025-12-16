import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';

const meta = {
  title: 'Components/Button/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <DeleteIcon />,
  },
};

export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <IconButton color="primary">
        <FavoriteIcon />
      </IconButton>
      <IconButton color="secondary">
        <DeleteIcon />
      </IconButton>
      <IconButton color="error">
        <DeleteIcon />
      </IconButton>
      <IconButton color="success">
        <EditIcon />
      </IconButton>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <IconButton size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
      <IconButton size="medium">
        <DeleteIcon />
      </IconButton>
      <IconButton size="large">
        <DeleteIcon fontSize="large" />
      </IconButton>
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    children: <DeleteIcon />,
    disabled: true,
  },
};
