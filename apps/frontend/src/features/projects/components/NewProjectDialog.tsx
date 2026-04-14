import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export function NewProjectDialog({ open, onClose, onCreate }: NewProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleCreate = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreate(name.trim(), description.trim());
    setName('');
    setDescription('');
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(16px)',
          border: 1,
          borderColor: 'grey.700',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify icon="solar:add-square-bold" width={24} sx={{ color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="h6">Create New Project</Typography>
          <Typography variant="caption" color="text.secondary">
            Start a new Docker Compose stack
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: '24px !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            autoFocus
            label="Project Name"
            placeholder="my-awesome-stack"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({});
            }}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            InputProps={{
              startAdornment: (
                <Iconify icon="solar:document-text-bold" width={20} sx={{ mr: 1, color: 'grey.400' }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(15, 23, 42, 0.5)',
                '& fieldset': {
                  borderColor: errors.name ? 'error.main' : 'grey.700',
                },
              },
            }}
          />

          <TextField
            label="Description (Optional)"
            placeholder="A brief description of your project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            InputProps={{
              startAdornment: (
                <Iconify
                  icon="solar:text-field-bold"
                  width={20}
                  sx={{ mr: 1, color: 'grey.400', alignSelf: 'flex-start', mt: 1.5 }}
                />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(15, 23, 42, 0.5)',
                '& fieldset': {
                  borderColor: 'grey.700',
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleClose} sx={{ color: 'grey.400' }}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          startIcon={<Iconify icon="solar:check-circle-bold" width={20} />}
          sx={{
            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            '&:hover': {
              background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
            },
          }}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}
