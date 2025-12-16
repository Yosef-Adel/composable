import type { Meta, StoryObj } from '@storybook/react';
import { Box, Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CustomBreadcrumbs } from './CustomBreadcrumbs';

const meta = {
  title: 'Components/Navigation/CustomBreadcrumbs',
  component: CustomBreadcrumbs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomBreadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    links: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'User', href: '/dashboard/user' },
      { name: 'List' },
    ],
  },
};

export const WithHeading: Story = {
  args: {
    heading: 'User List',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'User' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    heading: 'Settings',
    links: [
      { name: 'Home', href: '/', icon: <HomeIcon /> },
      { name: 'Settings', href: '/settings', icon: <SettingsIcon /> },
      { name: 'Profile' },
    ],
  },
};

export const WithAction: Story = {
  args: {
    heading: 'Products',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Products' },
    ],
    action: (
      <Button 
        variant="contained" 
        startIcon={<AddIcon />}
      >
        New Product
      </Button>
    ),
  },
};

export const WithMultipleActions: Story = {
  args: {
    heading: 'Invoice Details',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Invoices', href: '/invoices' },
      { name: 'INV-001' },
    ],
    action: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
        <Button variant="contained">
          Edit
        </Button>
      </Box>
    ),
  },
};

export const WithMoreLinks: Story = {
  args: {
    heading: 'Documentation',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Docs', href: '/docs' },
      { name: 'API Reference' },
    ],
    moreLink: [
      'https://docs.example.com',
      'https://api.example.com',
    ],
  },
};

export const ActiveLast: Story = {
  args: {
    heading: 'Current Page',
    activeLast: true,
    links: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Settings', href: '/settings' },
    ],
  },
};

export const LongPath: Story = {
  args: {
    heading: 'Deeply Nested Page',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Level 1', href: '/level1' },
      { name: 'Level 2', href: '/level1/level2' },
      { name: 'Level 3', href: '/level1/level2/level3' },
      { name: 'Level 4', href: '/level1/level2/level3/level4' },
      { name: 'Current Page' },
    ],
  },
};

export const OnlyBreadcrumbs: Story = {
  args: {
    links: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Products', href: '/products' },
      { name: 'Electronics', href: '/products/electronics' },
      { name: 'Laptops' },
    ],
  },
};

export const WithCustomStyles: Story = {
  args: {
    heading: 'Custom Styled',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'Details' },
    ],
    slotProps: {
      heading: {
        color: 'primary.main',
        fontWeight: 'bold',
      },
      breadcrumbs: {
        sx: {
          '& .MuiBreadcrumbs-li': {
            color: 'info.main',
          },
        },
      },
    },
  },
};

export const InCard: Story = {
  args: {
    heading: 'Page Header',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Analytics' },
    ],
    action: (
      <Button variant="contained" color="primary">
        Export Data
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <Box 
        sx={{ 
          p: 3, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Story />
      </Box>
    ),
  ],
};
