import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import { Label } from './Label';

const meta = {
  title: 'Components/Display/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Colors
export const Colors: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Label color="default">Default</Label>
        <Label color="primary">Primary</Label>
        <Label color="secondary">Secondary</Label>
        <Label color="info">Info</Label>
        <Label color="success">Success</Label>
        <Label color="warning">Warning</Label>
        <Label color="error">Error</Label>
      </Stack>
    </Stack>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>Filled</Typography>
        <Stack direction="row" spacing={1}>
          <Label variant="filled" color="primary">Primary</Label>
          <Label variant="filled" color="secondary">Secondary</Label>
          <Label variant="filled" color="info">Info</Label>
          <Label variant="filled" color="success">Success</Label>
          <Label variant="filled" color="warning">Warning</Label>
          <Label variant="filled" color="error">Error</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>Outlined</Typography>
        <Stack direction="row" spacing={1}>
          <Label variant="outlined" color="primary">Primary</Label>
          <Label variant="outlined" color="secondary">Secondary</Label>
          <Label variant="outlined" color="info">Info</Label>
          <Label variant="outlined" color="success">Success</Label>
          <Label variant="outlined" color="warning">Warning</Label>
          <Label variant="outlined" color="error">Error</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>Soft (Default)</Typography>
        <Stack direction="row" spacing={1}>
          <Label variant="soft" color="primary">Primary</Label>
          <Label variant="soft" color="secondary">Secondary</Label>
          <Label variant="soft" color="info">Info</Label>
          <Label variant="soft" color="success">Success</Label>
          <Label variant="soft" color="warning">Warning</Label>
          <Label variant="soft" color="error">Error</Label>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>Inverted</Typography>
        <Stack direction="row" spacing={1}>
          <Label variant="inverted" color="primary">Primary</Label>
          <Label variant="inverted" color="secondary">Secondary</Label>
          <Label variant="inverted" color="info">Info</Label>
          <Label variant="inverted" color="success">Success</Label>
          <Label variant="inverted" color="warning">Warning</Label>
          <Label variant="inverted" color="error">Error</Label>
        </Stack>
      </Box>
    </Stack>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Label color="success" startIcon={<CheckCircleIcon />}>
          Completed
        </Label>
        <Label color="error" startIcon={<ErrorIcon />}>
          Failed
        </Label>
        <Label color="warning" startIcon={<WarningIcon />}>
          Pending
        </Label>
        <Label color="info" startIcon={<StarIcon />}>
          Featured
        </Label>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Label color="success" endIcon={<CheckCircleIcon />}>
          Completed
        </Label>
        <Label color="error" endIcon={<ErrorIcon />}>
          Failed
        </Label>
        <Label color="warning" endIcon={<WarningIcon />}>
          Pending
        </Label>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Label 
          color="success" 
          variant="filled"
          startIcon={<CheckCircleIcon />}
          endIcon={<CheckCircleIcon />}
        >
          Both Icons
        </Label>
      </Stack>
    </Stack>
  ),
};

// Status Labels
export const StatusLabels: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Label color="success" startIcon={<CheckCircleIcon />}>Active</Label>
        <Label color="error" startIcon={<ErrorIcon />}>Inactive</Label>
        <Label color="warning" startIcon={<WarningIcon />}>Pending</Label>
        <Label color="info">Draft</Label>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Label color="success" variant="outlined">Paid</Label>
        <Label color="warning" variant="outlined">Pending</Label>
        <Label color="error" variant="outlined">Overdue</Label>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Label color="primary" variant="filled">New</Label>
        <Label color="success" variant="filled">In Stock</Label>
        <Label color="error" variant="filled">Out of Stock</Label>
      </Stack>
    </Stack>
  ),
};

// In Table
export const InTable: Story = {
  render: () => (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, p: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
          <Typography>#12345</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Status</Typography>
          <Label color="success" startIcon={<CheckCircleIcon />}>Delivered</Label>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Payment</Typography>
          <Label color="success">Paid</Label>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
          <Typography>#12346</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Status</Typography>
          <Label color="warning" startIcon={<WarningIcon />}>Pending</Label>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Payment</Typography>
          <Label color="warning">Pending</Label>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
          <Typography>#12347</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Status</Typography>
          <Label color="error" startIcon={<ErrorIcon />}>Cancelled</Label>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">Payment</Typography>
          <Label color="error">Refunded</Label>
        </Box>
      </Box>
    </Box>
  ),
};

// Different Sizes
export const CustomSizes: Story = {
  render: () => (
    <Stack spacing={2} alignItems="flex-start">
      <Label color="primary" sx={{ height: 20, fontSize: 10 }}>
        Small
      </Label>
      <Label color="primary">
        Default
      </Label>
      <Label color="primary" sx={{ height: 32, fontSize: 14, px: 2 }}>
        Large
      </Label>
    </Stack>
  ),
};

// Sentence Case
export const SentenceCase: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Label color="primary">uppercase text</Label>
      <Label color="success">lowercase text</Label>
      <Label color="warning">CamelCase text</Label>
      <Label color="error">ALLCAPS TEXT</Label>
    </Stack>
  ),
};

// All Combinations
export const AllCombinations: Story = {
  render: () => (
    <Stack spacing={3}>
      {(['filled', 'outlined', 'soft', 'inverted'] as const).map((variant) => (
        <Box key={variant}>
          <Typography variant="subtitle2" gutterBottom textTransform="capitalize">
            {variant}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map((color) => (
              <Label key={color} variant={variant} color={color}>
                {color}
              </Label>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  ),
};
