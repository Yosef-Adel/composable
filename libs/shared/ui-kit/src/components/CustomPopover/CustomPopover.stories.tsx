import type { Meta, StoryObj } from '@storybook/react';
import { Button, MenuItem, MenuList, Typography, Box, Stack } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { CustomPopover, usePopover } from './index';

const meta = {
  title: 'Components/Utils/CustomPopover',
  component: CustomPopover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Menu
export const BasicMenu: Story = {
  render: () => {
    const popover = usePopover();

    return (
      <>
        <Button variant="contained" onClick={popover.onOpen}>
          Open Menu
        </Button>

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
        >
          <MenuList>
            <MenuItem onClick={popover.onClose}>Profile</MenuItem>
            <MenuItem onClick={popover.onClose}>Settings</MenuItem>
            <MenuItem onClick={popover.onClose}>Logout</MenuItem>
          </MenuList>
        </CustomPopover>
      </>
    );
  },
};

// Arrow Placements
export const ArrowPlacements: Story = {
  render: () => {
    const topLeft = usePopover();
    const topRight = usePopover();
    const bottomLeft = usePopover();
    const bottomRight = usePopover();

    return (
      <Stack spacing={3} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={topLeft.onOpen}>
            Top Left
          </Button>
          <Button variant="outlined" onClick={topRight.onOpen}>
            Top Right
          </Button>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={bottomLeft.onOpen}>
            Bottom Left
          </Button>
          <Button variant="outlined" onClick={bottomRight.onOpen}>
            Bottom Right
          </Button>
        </Stack>

        <CustomPopover
          open={topLeft.open}
          anchorEl={topLeft.anchorEl}
          onClose={topLeft.onClose}
          slotProps={{ arrow: { placement: 'top-left' } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography>Top Left Arrow</Typography>
          </Box>
        </CustomPopover>

        <CustomPopover
          open={topRight.open}
          anchorEl={topRight.anchorEl}
          onClose={topRight.onClose}
          slotProps={{ arrow: { placement: 'top-right' } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography>Top Right Arrow</Typography>
          </Box>
        </CustomPopover>

        <CustomPopover
          open={bottomLeft.open}
          anchorEl={bottomLeft.anchorEl}
          onClose={bottomLeft.onClose}
          slotProps={{ arrow: { placement: 'bottom-left' } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography>Bottom Left Arrow</Typography>
          </Box>
        </CustomPopover>

        <CustomPopover
          open={bottomRight.open}
          anchorEl={bottomRight.anchorEl}
          onClose={bottomRight.onClose}
          slotProps={{ arrow: { placement: 'bottom-right' } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography>Bottom Right Arrow</Typography>
          </Box>
        </CustomPopover>
      </Stack>
    );
  },
};

// Without Arrow
export const WithoutArrow: Story = {
  render: () => {
    const popover = usePopover();

    return (
      <>
        <Button variant="contained" onClick={popover.onOpen}>
          No Arrow
        </Button>

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{ arrow: { hide: true } }}
        >
          <MenuList>
            <MenuItem onClick={popover.onClose}>Option 1</MenuItem>
            <MenuItem onClick={popover.onClose}>Option 2</MenuItem>
            <MenuItem onClick={popover.onClose}>Option 3</MenuItem>
          </MenuList>
        </CustomPopover>
      </>
    );
  },
};

// With Icon
export const WithIcon: Story = {
  render: () => {
    const popover = usePopover();

    return (
      <>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={popover.onOpen}
        >
          Settings
        </Button>

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
        >
          <MenuList>
            <MenuItem onClick={popover.onClose}>Account Settings</MenuItem>
            <MenuItem onClick={popover.onClose}>Privacy</MenuItem>
            <MenuItem onClick={popover.onClose}>Notifications</MenuItem>
            <MenuItem onClick={popover.onClose}>Security</MenuItem>
          </MenuList>
        </CustomPopover>
      </>
    );
  },
};

// Custom Content
export const CustomContent: Story = {
  render: () => {
    const popover = usePopover();

    return (
      <>
        <Button variant="contained" onClick={popover.onOpen}>
          User Profile
        </Button>

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
        >
          <Box sx={{ p: 2, maxWidth: 250 }}>
            <Typography variant="subtitle2" gutterBottom>
              John Doe
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              john.doe@example.com
            </Typography>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={popover.onClose}
            >
              View Profile
            </Button>
          </Box>
        </CustomPopover>
      </>
    );
  },
};

// Large Arrow
export const LargeArrow: Story = {
  render: () => {
    const popover = usePopover();

    return (
      <>
        <Button variant="contained" onClick={popover.onOpen}>
          Large Arrow
        </Button>

        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{ 
            arrow: { 
              placement: 'top-right',
              size: 24,
              offset: 24
            } 
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography>Popover with large arrow</Typography>
          </Box>
        </CustomPopover>
      </>
    );
  },
};
