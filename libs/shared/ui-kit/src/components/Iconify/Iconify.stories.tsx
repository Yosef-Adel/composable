import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Box, Typography, Card, CardContent } from '@mui/material';
import { Iconify, FlagIcon, SocialIcon } from './index';

const meta = {
  title: 'Components/Display/Iconify',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Icons
export const BasicIcons: Story = {
  render: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Iconify icon="solar:home-bold" />
      <Iconify icon="solar:user-bold" width={24} />
      <Iconify icon="solar:settings-bold" width={32} />
      <Iconify icon="solar:trash-bin-trash-bold" width={40} color="error.main" />
    </Stack>
  ),
};

// Icon Sizes
export const IconSizes: Story = {
  render: () => (
    <Stack direction="row" spacing={3} alignItems="center">
      <Box>
        <Iconify icon="solar:star-bold" width={16} />
        <Typography variant="caption" display="block">16px</Typography>
      </Box>
      <Box>
        <Iconify icon="solar:star-bold" width={20} />
        <Typography variant="caption" display="block">20px</Typography>
      </Box>
      <Box>
        <Iconify icon="solar:star-bold" width={24} />
        <Typography variant="caption" display="block">24px</Typography>
      </Box>
      <Box>
        <Iconify icon="solar:star-bold" width={32} />
        <Typography variant="caption" display="block">32px</Typography>
      </Box>
      <Box>
        <Iconify icon="solar:star-bold" width={48} />
        <Typography variant="caption" display="block">48px</Typography>
      </Box>
    </Stack>
  ),
};

// Colored Icons
export const ColoredIcons: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Iconify icon="solar:heart-bold" color="error.main" width={32} />
      <Iconify icon="solar:check-circle-bold" color="success.main" width={32} />
      <Iconify icon="solar:danger-triangle-bold" color="warning.main" width={32} />
      <Iconify icon="solar:info-circle-bold" color="info.main" width={32} />
      <Iconify icon="solar:star-bold" color="primary.main" width={32} />
    </Stack>
  ),
};

// Common Icons
export const CommonIcons: Story = {
  render: () => (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Iconify icon="solar:home-bold" width={24} />
        <Typography>Home</Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Iconify icon="solar:user-bold" width={24} />
        <Typography>User</Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Iconify icon="solar:settings-bold" width={24} />
        <Typography>Settings</Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Iconify icon="solar:bell-bold" width={24} />
        <Typography>Notifications</Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Iconify icon="solar:magnifer-bold" width={24} />
        <Typography>Search</Typography>
      </Stack>
    </Stack>
  ),
};

// Social Icons
export const SocialIcons: Story = {
  render: () => (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <SocialIcon icon="google" />
        <SocialIcon icon="facebook" />
        <SocialIcon icon="twitter" />
        <SocialIcon icon="linkedin" />
        <SocialIcon icon="instagram" />
        <SocialIcon icon="github" />
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <SocialIcon icon="google" width={32} />
        <SocialIcon icon="facebook" width={32} />
        <SocialIcon icon="twitter" width={32} />
        <SocialIcon icon="linkedin" width={32} />
        <SocialIcon icon="instagram" width={32} />
        <SocialIcon icon="github" width={32} />
      </Stack>
    </Stack>
  ),
};

// Flag Icons
export const FlagIcons: Story = {
  render: () => (
    <Stack spacing={3}>
      <Typography variant="h6">Country Flags</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <FlagIcon code="US" />
        <FlagIcon code="GB" />
        <FlagIcon code="DE" />
        <FlagIcon code="FR" />
        <FlagIcon code="ES" />
        <FlagIcon code="IT" />
        <FlagIcon code="JP" />
        <FlagIcon code="CN" />
        <FlagIcon code="IN" />
        <FlagIcon code="BR" />
        <FlagIcon code="CA" />
        <FlagIcon code="AU" />
      </Stack>
    </Stack>
  ),
};

// In Card
export const InCard: Story = {
  render: () => (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="solar:user-bold-duotone" width={48} color="primary.main" />
            <Box>
              <Typography variant="h6">Profile Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your account information
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="solar:bell-bing-bold-duotone" width={48} color="warning.main" />
            <Box>
              <Typography variant="h6">Notifications</Typography>
              <Typography variant="body2" color="text.secondary">
                Configure your notification preferences
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  ),
};

// Mixed Usage
export const MixedUsage: Story = {
  render: () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="solar:phone-bold" color="primary.main" />
            <Typography>+1 234 567 8900</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="solar:letter-bold" color="primary.main" />
            <Typography>contact@example.com</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="solar:map-point-bold" color="primary.main" />
            <Typography>New York, USA</Typography>
            <FlagIcon code="US" />
          </Stack>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Social Media
        </Typography>
        <Stack direction="row" spacing={1}>
          <SocialIcon icon="facebook" width={24} />
          <SocialIcon icon="twitter" width={24} />
          <SocialIcon icon="linkedin" width={24} />
          <SocialIcon icon="instagram" width={24} />
        </Stack>
      </Box>
    </Stack>
  ),
};
