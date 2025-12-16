import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Stack } from '@mui/material';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'contained',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'contained',
    color: 'secondary',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined Button',
    variant: 'outlined',
    color: 'primary',
  },
};

export const Text: Story = {
  args: {
    label: 'Text Button',
    variant: 'text',
    color: 'primary',
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button label="Small" size="small" variant="contained" />
      <Button label="Medium" size="medium" variant="contained" />
      <Button label="Large" size="large" variant="contained" />
    </Stack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      <Button label="Primary" color="primary" variant="contained" />
      <Button label="Secondary" color="secondary" variant="contained" />
      <Button label="Success" color="success" variant="contained" />
      <Button label="Error" color="error" variant="contained" />
      <Button label="Info" color="info" variant="contained" />
      <Button label="Warning" color="warning" variant="contained" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'contained',
    disabled: true,
  },
};

export const WithStartIcon: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button
        label="Download"
        variant="contained"
        startIcon={<span>⬇</span>}
      />
      <Button
        label="Upload"
        variant="outlined"
        startIcon={<span>⬆</span>}
      />
    </Stack>
  ),
};
