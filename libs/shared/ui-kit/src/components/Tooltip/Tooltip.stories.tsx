import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '@mui/material';

const meta = {
  title: 'Components/Feedback/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'This is a tooltip',
    children: <Button variant="contained">Hover me</Button>,
  },
};

export const Arrow: Story = {
  args: {
    title: 'Tooltip with arrow',
    arrow: true,
    children: <Button variant="contained">Hover me</Button>,
  },
};

export const Placement: Story = {
  args: {
    title: 'Top tooltip',
    placement: 'top',
    children: <Button variant="contained">Top</Button>,
  },
};
