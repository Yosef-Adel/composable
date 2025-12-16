import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { ConfirmDialog } from './ConfirmDialog';

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Example
export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Dialog
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm Action"
          content="Are you sure you want to proceed?"
          action={
            <Button variant="contained" color="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          }
        />
      </>
    );
  },
};

// Delete Confirmation
export const DeleteConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={() => setOpen(true)}
        >
          Delete Item
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete Item"
          content="Are you sure you want to delete this item? This action cannot be undone."
          action={
            <Button 
              variant="contained" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                console.log('Item deleted');
                setOpen(false);
              }}
            >
              Delete
            </Button>
          }
        />
      </>
    );
  },
};

// Warning Dialog
export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button 
          variant="contained" 
          color="warning"
          onClick={() => setOpen(true)}
        >
          Show Warning
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              <span>Warning</span>
            </Box>
          }
          content="This action may have unexpected consequences. Please review before proceeding."
          action={
            <Button 
              variant="contained" 
              color="warning"
              onClick={() => setOpen(false)}
            >
              I Understand
            </Button>
          }
        />
      </>
    );
  },
};

// With Rich Content
export const RichContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          View Details
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Subscription Details"
          content={
            <Box>
              <Typography variant="body2" paragraph>
                You are about to subscribe to the <strong>Pro Plan</strong>:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2">
                  $29.99/month
                </Typography>
                <Typography component="li" variant="body2">
                  Unlimited projects
                </Typography>
                <Typography component="li" variant="body2">
                  Priority support
                </Typography>
                <Typography component="li" variant="body2">
                  Advanced analytics
                </Typography>
              </Box>
            </Box>
          }
          action={
            <Button variant="contained" onClick={() => setOpen(false)}>
              Subscribe Now
            </Button>
          }
        />
      </>
    );
  },
};

// Multiple Actions
export const MultipleActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Save Changes
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Unsaved Changes"
          content="You have unsaved changes. What would you like to do?"
          action={
            <>
              <Button 
                variant="text" 
                color="error"
                onClick={() => {
                  console.log('Discard changes');
                  setOpen(false);
                }}
              >
                Discard
              </Button>
              <Button 
                variant="contained"
                onClick={() => {
                  console.log('Save changes');
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </>
          }
        />
      </>
    );
  },
};

// Without Content
export const TitleOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Quick Confirm
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Are you sure?"
          action={
            <Button variant="contained" onClick={() => setOpen(false)}>
              Yes
            </Button>
          }
        />
      </>
    );
  },
};

// Custom Width
export const LargeDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Large Dialog
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          title="Terms and Conditions"
          content={
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              <Typography variant="body2" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
              <Typography variant="body2" paragraph>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
                in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
              <Typography variant="body2" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </Typography>
            </Box>
          }
          action={
            <Button variant="contained" onClick={() => setOpen(false)}>
              I Agree
            </Button>
          }
        />
      </>
    );
  },
};

// Loading State
export const WithLoading: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 2000);
    };

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Submit Form
        </Button>

        <ConfirmDialog
          open={open}
          onClose={() => !loading && setOpen(false)}
          title="Submit Form"
          content="Are you sure you want to submit this form?"
          action={
            <Button 
              variant="contained"
              disabled={loading}
              onClick={handleConfirm}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          }
        />
      </>
    );
  },
};
