import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Form/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
};

export const Checked: Story = {
  args: {
    label: 'Enable notifications',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Enable notifications',
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    defaultChecked: true,
  },
};
