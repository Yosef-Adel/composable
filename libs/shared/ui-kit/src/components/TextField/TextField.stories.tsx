import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
};

export const Filled: Story = {
  args: {
    label: 'Email',
    variant: 'filled',
    placeholder: 'Enter your email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    helperText: 'We will never share your email',
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: true,
    helperText: 'Invalid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    disabled: true,
  },
};

export const Multiline: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description',
    multiline: true,
    rows: 4,
  },
};
