import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { api } from '@/services/api';

interface ProjectSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onNameChange: (name: string) => void;
}

export function ProjectSettingsDialog({
  open,
  onClose,
  projectId,
  projectName,
  onNameChange,
}: ProjectSettingsDialogProps) {
  const navigate = useNavigate();
  const [name, setName] = useState(projectName);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(projectName);
      setConfirmDelete(false);
    }
  }, [open, projectName]);

  const handleSave = async () => {
    if (!name.trim() || name === projectName) return;
    setSaving(true);
    try {
      await api.put(`/projects/${projectId}`, { name: name.trim() });
      onNameChange(name.trim());
      onClose();
    } catch {
      // error handled silently
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/projects/${projectId}`);
      navigate('/projects');
    } catch {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Project Settings</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1 }}
        />

        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {confirmDelete
              ? 'This action cannot be undone. Click again to confirm.'
              : 'Permanently delete this project and all its data.'}
          </Typography>
          <Button
            variant={confirmDelete ? 'contained' : 'outlined'}
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={18} />}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : confirmDelete ? 'Confirm Delete' : 'Delete Project'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !name.trim() || name === projectName}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
