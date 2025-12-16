import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Box, Stack, Typography } from '@mui/material';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ minWidth: 400 }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'Card Title',
    children: (
      <Typography variant="body2" color="text.secondary">
        This is the card content. You can put any React components here.
      </Typography>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    children: (
      <Typography variant="body2" color="text.secondary">
        This is a card without a title.
      </Typography>
    ),
  },
};

export const WithElevation: Story = {
  args: {
    title: 'Elevated Card',
    children: (
      <Typography variant="body2" color="text.secondary">
        This card has custom elevation with enhanced shadow.
      </Typography>
    ),
    elevation: 8,
  },
};

export const LongContent: Story = {
  args: {
    title: 'Card with Long Content',
    children: (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          This card contains multiple paragraphs of content to demonstrate how the card
          adapts to larger amounts of text.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The card will expand to fit all the content while maintaining proper spacing
          and layout. This is useful for content-heavy sections.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can add as much content as needed, and the card will handle it gracefully
          with the dark theme styling applied.
        </Typography>
      </Stack>
    ),
  },
};

export const MultipleCards: Story = {
  render: () => (
    <Stack spacing={2}>
      <Card title="Card 1">
        <Typography variant="body2" color="text.secondary">
          First card content with dark theme styling
        </Typography>
      </Card>
      <Card title="Card 2">
        <Typography variant="body2" color="text.secondary">
          Second card content with hover effects
        </Typography>
      </Card>
      <Card title="Card 3">
        <Typography variant="body2" color="text.secondary">
          Third card content with rounded corners
        </Typography>
      </Card>
    </Stack>
  ),
};
