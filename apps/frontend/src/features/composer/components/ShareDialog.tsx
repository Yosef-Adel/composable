import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { api } from '@/services/api';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export function ShareDialog({ open, onClose, projectId }: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/projects/${projectId}/share`);
      const token = data.data?.shareToken ?? data.shareToken;
      const url = `${window.location.origin}/shared/${token}`;
      setShareUrl(url);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleUnshare = useCallback(async () => {
    try {
      await api.delete(`/projects/${projectId}/share`);
      setShareUrl(null);
    } catch {
      // handle error
    }
  }, [projectId]);

  const handleCopy = useCallback(() => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:share-bold" width={24} />
          Share Project
        </Box>
      </DialogTitle>
      <DialogContent>
        {shareUrl ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Anyone with this link can view your project (read-only).
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={shareUrl}
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: { fontSize: '0.85rem', fontFamily: 'monospace', bgcolor: 'rgba(15, 23, 42, 0.5)' },
                  },
                }}
              />
              <IconButton onClick={handleCopy} color={copied ? 'success' : 'default'}>
                <Iconify icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'} width={20} />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Iconify icon="solar:link-bold" width={48} sx={{ color: 'grey.500', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Generate a public link to share this project with anyone.
            </Typography>
            <Button
              variant="contained"
              onClick={handleShare}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Iconify icon="solar:link-bold" width={16} />}
              sx={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}
            >
              {loading ? 'Generating...' : 'Generate Share Link'}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {shareUrl && (
          <Button onClick={handleUnshare} color="error" size="small">
            Revoke Link
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
