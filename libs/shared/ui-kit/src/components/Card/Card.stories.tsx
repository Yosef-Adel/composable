import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'Card Title',
    children: 'This is the card content. You can put any React components here.',
  },
};

export const WithoutTitle: Story = {
  args: {
    children: 'This is a card without a title.',
  },
};

export const WithElevation: Story = {
  args: {
    title: 'Elevated Card',
    children: 'This card has custom elevation.',
    elevation: 8,
  },
};
