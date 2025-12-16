import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tab, Box, Typography, Card, CardContent } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CustomTabs } from './CustomTabs';

const meta = {
  title: 'Components/CustomTabs',
  component: CustomTabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CustomTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Basic Tabs
export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box>
        <CustomTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab label="Overview" />
          <Tab label="Details" />
          <Tab label="Settings" />
        </CustomTabs>

        <TabPanel value={value} index={0}>
          <Typography>Overview content goes here</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Details content goes here</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Settings content goes here</Typography>
        </TabPanel>
      </Box>
    );
  },
};

// With Icons
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box>
        <CustomTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab icon={<HomeIcon />} label="Home" />
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<ShoppingCartIcon />} label="Cart" />
          <Tab icon={<SettingsIcon />} label="Settings" />
        </CustomTabs>

        <TabPanel value={value} index={0}>
          <Typography>Home content</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Profile content</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Cart content</Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography>Settings content</Typography>
        </TabPanel>
      </Box>
    );
  },
};

// Icon Only
export const IconOnly: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box>
        <CustomTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab icon={<HomeIcon />} />
          <Tab icon={<PersonIcon />} />
          <Tab icon={<ShoppingCartIcon />} />
          <Tab icon={<SettingsIcon />} />
        </CustomTabs>

        <TabPanel value={value} index={0}>
          <Typography>Home</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Profile</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Cart</Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography>Settings</Typography>
        </TabPanel>
      </Box>
    );
  },
};

// Centered
export const Centered: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box>
        <CustomTabs value={value} onChange={(_, newValue) => setValue(newValue)} centered>
          <Tab label="Tab One" />
          <Tab label="Tab Two" />
          <Tab label="Tab Three" />
        </CustomTabs>

        <TabPanel value={value} index={0}>
          <Typography align="center">Centered tab content 1</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography align="center">Centered tab content 2</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography align="center">Centered tab content 3</Typography>
        </TabPanel>
      </Box>
    );
  },
};

// Scrollable
export const Scrollable: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box sx={{ maxWidth: 600 }}>
        <CustomTabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tab 1" />
          <Tab label="Tab 2" />
          <Tab label="Tab 3" />
          <Tab label="Tab 4" />
          <Tab label="Tab 5" />
          <Tab label="Tab 6" />
          <Tab label="Tab 7" />
          <Tab label="Tab 8" />
        </CustomTabs>

        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <TabPanel key={index} value={value} index={index}>
            <Typography>Content for Tab {index + 1}</Typography>
          </TabPanel>
        ))}
      </Box>
    );
  },
};

// Full Width
export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box>
        <CustomTabs value={value} onChange={(_, newValue) => setValue(newValue)} variant="fullWidth">
          <Tab label="Overview" />
          <Tab label="Analytics" />
          <Tab label="Reports" />
        </CustomTabs>

        <TabPanel value={value} index={0}>
          <Typography>Overview content</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Analytics content</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Reports content</Typography>
        </TabPanel>
      </Box>
    );
  },
};

// In Card
export const InCard: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Card>
        <CustomTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab label="Details" />
          <Tab label="Activity" />
          <Tab label="History" />
        </CustomTabs>

        <CardContent>
          <TabPanel value={value} index={0}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is the product details section with information about the product.
            </Typography>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track recent activities and changes made to this product.
            </Typography>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Typography variant="h6" gutterBottom>
              Change History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View the complete history of all changes.
            </Typography>
          </TabPanel>
        </CardContent>
      </Card>
    );
  },
};

// With Badges
export const WithBadges: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box>
        <CustomTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab label="All (42)" />
          <Tab label="Active (15)" />
          <Tab label="Pending (8)" />
          <Tab label="Completed (19)" />
        </CustomTabs>

        <TabPanel value={value} index={0}>
          <Typography>All items (42)</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Active items (15)</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Pending items (8)</Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography>Completed items (19)</Typography>
        </TabPanel>
      </Box>
    );
  },
};

// Custom Styling
export const CustomStyling: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <Box>
        <CustomTabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          slotProps={{
            indicator: {
              bgcolor: 'primary.main',
            },
            selected: {
              color: 'primary.main',
              fontWeight: 'bold',
            },
          }}
        >
          <Tab label="Dashboard" />
          <Tab label="Analytics" />
          <Tab label="Reports" />
        </CustomTabs>

        <TabPanel value={value} index={0}>
          <Typography>Dashboard content</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography>Analytics content</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Reports content</Typography>
        </TabPanel>
      </Box>
    );
  },
};
