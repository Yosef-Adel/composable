import type { Meta, StoryObj } from "@storybook/react";
import { Button, Stack, TextField, Box } from "@mui/material";
import { toast } from "sonner";
import { Snackbar } from "./Snackbar";
import { useState } from "react";

const meta = {
  title: "Components/Snackbar",
  component: Snackbar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Types
export const BasicTypes: Story = {
  render: () => (
    <Box>
      <Snackbar />
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => toast("This is a default toast")}
        >
          Default Toast
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => toast.success("Operation completed successfully!")}
        >
          Success Toast
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => toast.error("Something went wrong!")}
        >
          Error Toast
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => toast.warning("Please review your input")}
        >
          Warning Toast
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => toast.info("Here is some information")}
        >
          Info Toast
        </Button>
      </Stack>
    </Box>
  ),
};

// With Description
export const WithDescription: Story = {
  render: () => (
    <Box>
      <Snackbar />
      <Stack spacing={2}>
        <Button
          variant="outlined"
          onClick={() =>
            toast.success("Email sent", {
              description:
                "Your email has been sent successfully to john@example.com",
            })
          }
        >
          Success with Description
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() =>
            toast.error("Upload failed", {
              description: "The file size exceeds the maximum limit of 5MB",
            })
          }
        >
          Error with Description
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() =>
            toast.warning("Storage almost full", {
              description: "You have used 95% of your available storage",
            })
          }
        >
          Warning with Description
        </Button>
      </Stack>
    </Box>
  ),
};

// With Actions
export const WithActions: Story = {
  render: () => (
    <Box>
      <Snackbar />
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() =>
            toast("Event has been created", {
              action: {
                label: "Undo",
                onClick: () => toast.info("Undo clicked"),
              },
            })
          }
        >
          Toast with Action
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            toast.success("Changes saved", {
              action: {
                label: "View",
                onClick: () => toast.info("View clicked"),
              },
            })
          }
        >
          Success with Action
        </Button>
      </Stack>
    </Box>
  ),
};

// Loading Toast
export const LoadingToast: Story = {
  render: () => {
    const handleAsyncOperation = () => {
      const promise = new Promise((resolve) => setTimeout(resolve, 3000));

      toast.promise(promise, {
        loading: "Processing...",
        success: "Operation completed!",
        error: "Operation failed",
      });
    };

    return (
      <Box>
        <Snackbar />
        <Stack spacing={2}>
          <Button variant="contained" onClick={handleAsyncOperation}>
            Show Promise Toast
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const toastId = toast.loading("Loading data...");
              setTimeout(() => {
                toast.success("Data loaded!", { id: toastId });
              }, 2000);
            }}
          >
            Manual Loading Toast
          </Button>
        </Stack>
      </Box>
    );
  },
};

// Custom Duration
export const CustomDuration: Story = {
  render: () => (
    <Box>
      <Snackbar />
      <Stack spacing={2}>
        <Button
          variant="outlined"
          onClick={() =>
            toast("This will stay for 1 second", { duration: 1000 })
          }
        >
          1 Second
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            toast("This will stay for 5 seconds", { duration: 5000 })
          }
        >
          5 Seconds
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            toast("This will stay until dismissed", { duration: Infinity })
          }
        >
          Infinite
        </Button>
      </Stack>
    </Box>
  ),
};

// Dismissible
export const Dismissible: Story = {
  render: () => (
    <Box>
      <Snackbar />
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            const id = toast("You can dismiss this");
            setTimeout(() => toast.dismiss(id), 3000);
          }}
        >
          Auto Dismiss after 3s
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            toast.success("First toast");
            toast.info("Second toast");
            toast.warning("Third toast");
          }}
        >
          Show Multiple
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => toast.dismiss()}
        >
          Dismiss All
        </Button>
      </Stack>
    </Box>
  ),
};

// Interactive Form Example
export const InteractiveForm: Story = {
  render: () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!name || !email) {
        toast.error("Validation Error", {
          description: "Please fill in all required fields",
        });
        return;
      }

      const promise = new Promise((resolve) => setTimeout(resolve, 2000));

      toast.promise(promise, {
        loading: "Saving your information...",
        success: "Profile updated successfully!",
        error: "Failed to update profile",
      });

      // Reset form after success
      promise.then(() => {
        setName("");
        setEmail("");
      });
    };

    return (
      <Box sx={{ width: 400 }}>
        <Snackbar />
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" fullWidth>
              Save Profile
            </Button>
          </Stack>
        </form>
      </Box>
    );
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <Box>
      <Snackbar />
      <Stack spacing={2}>
        <Box>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => toast("Default message")}
          >
            Default
          </Button>
        </Box>
        <Box>
          <Button
            fullWidth
            variant="outlined"
            color="success"
            onClick={() =>
              toast.success("Success!", {
                description: "Operation completed successfully",
                action: { label: "Undo", onClick: () => {} },
              })
            }
          >
            Success (Full)
          </Button>
        </Box>
        <Box>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() =>
              toast.error("Error!", {
                description: "Something went wrong",
              })
            }
          >
            Error (Full)
          </Button>
        </Box>
        <Box>
          <Button
            fullWidth
            variant="outlined"
            color="warning"
            onClick={() =>
              toast.warning("Warning!", {
                description: "Please be careful",
              })
            }
          >
            Warning (Full)
          </Button>
        </Box>
        <Box>
          <Button
            fullWidth
            variant="outlined"
            color="info"
            onClick={() =>
              toast.info("Info!", {
                description: "Here is some information",
              })
            }
          >
            Info (Full)
          </Button>
        </Box>
      </Stack>
    </Box>
  ),
};

// Rich Content
export const RichContent: Story = {
  render: () => (
    <Box>
      <Snackbar />
      <Button
        variant="contained"
        onClick={() =>
          toast.custom((id) => (
            <Box sx={{ p: 2 }}>
              <strong>Custom Toast</strong>
              <p style={{ margin: "8px 0 0 0" }}>
                You can put any React component here!
              </p>
            </Box>
          ))
        }
      >
        Custom Content
      </Button>
    </Box>
  ),
};
