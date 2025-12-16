import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Stack } from '@mui/material';

const meta = {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Accept terms and conditions',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Accept terms and conditions',
    disabled: true,
  },
};

export const Multiple: Story = {
  render: () => (
    <Stack spacing={1}>
      <Checkbox label="Option 1" defaultChecked />
      <Checkbox label="Option 2" />
      <Checkbox label="Option 3" />
    </Stack>
  ),
};
