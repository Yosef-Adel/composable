import type { Meta, StoryObj } from '@storybook/react';
import { EmptyContent } from './EmptyContent';
import { Button } from '../Button';

const meta = {
  title: 'Components/Feedback/EmptyContent',
  component: EmptyContent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'No data',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'No orders found',
    description: "Looks like you haven't placed any orders yet. Start shopping to see your orders here!",
  },
};

export const WithAction: Story = {
  args: {
    title: 'No items in cart',
    description: 'Your shopping cart is empty. Add some items to get started!',
    action: <Button label="Start Shopping" variant="contained" color="primary" />,
  },
};

export const Filled: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filter to find what you are looking for.',
    filled: true,
  },
};

export const CustomImage: Story = {
  args: {
    title: 'No notifications',
    description: "You're all caught up! No new notifications at this time.",
    imgUrl: 'https://via.placeholder.com/160/e0e0e0/757575?text=No+Data',
  },
};

export const InContainer: Story = {
  args: {
    title: 'No data available',
    description: 'This section is currently empty.',
    filled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
};
