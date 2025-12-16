import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { Typography } from '@mui/material';

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { label: 'Tab 1', value: 'tab1' },
      { label: 'Tab 2', value: 'tab2' },
      { label: 'Tab 3', value: 'tab3' },
    ],
    panels: [
      { value: 'tab1', content: <Typography>Content for Tab 1</Typography> },
      { value: 'tab2', content: <Typography>Content for Tab 2</Typography> },
      { value: 'tab3', content: <Typography>Content for Tab 3</Typography> },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    tabs: [
      { label: 'Tab 1', value: 'tab1' },
      { label: 'Tab 2 (Disabled)', value: 'tab2', disabled: true },
      { label: 'Tab 3', value: 'tab3' },
    ],
  },
};
