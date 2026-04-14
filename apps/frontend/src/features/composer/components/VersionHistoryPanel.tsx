import { useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { api } from '@/services/api';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { loadProjectData } from '../store/composerSlice';
import { showNotification } from '@/app/store/notificationSlice';
import { generateYaml } from '../utils/yamlGenerator';

interface VersionHistoryPanelProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

interface Version {
  _id: string;
  version: number;
  message: string;
  source: string;
  createdAt: string;
}

interface DiffLine {
  type: 'same' | 'add' | 'remove';
  text: string;
}

function simpleDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  // LCS-based diff
  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = m;
  let j = n;
  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({ type: 'same', text: oldLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'add', text: newLines[j - 1] });
      j--;
    } else {
      stack.push({ type: 'remove', text: oldLines[i - 1] });
      i--;
    }
  }
  stack.reverse();
  return stack;
}

function yamlFromComposerData(composerData: any): string {
  if (!composerData) return '';
  try {
    return generateYaml(composerData.nodeConfigs ?? {}, composerData.edges ?? []);
  } catch {
    return JSON.stringify(composerData, null, 2);
  }
}

export function VersionHistoryPanel({
  projectId,
  open,
  onClose,
}: VersionHistoryPanelProps) {
  const dispatch = useAppDispatch();
  const nodeConfigs = useAppSelector((s) => s.composer.nodeConfigs);
  const edges = useAppSelector((s) => s.composer.edges);

  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [restoreTarget, setRestoreTarget] = useState<Version | null>(null);
  const [diffData, setDiffData] = useState<DiffLine[] | null>(null);
  const [diffVersion, setDiffVersion] = useState<Version | null>(null);
  const [diffLoading, setDiffLoading] = useState(false);

  const loadVersions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${projectId}/versions`);
      setVersions(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      loadVersions();
    }
  }, [open, loadVersions]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/projects/${projectId}/versions`, {
        message: message || undefined,
      });
      setMessage('');
      dispatch(
        showNotification({ message: 'Version saved', severity: 'success' }),
      );
      loadVersions();
    } catch {
      dispatch(
        showNotification({
          message: 'Failed to save version',
          severity: 'error',
        }),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreTarget) return;
    try {
      const { data } = await api.post(
        `/projects/${projectId}/versions/${restoreTarget._id}/restore`,
      );
      const project = data.data ?? data;
      const composerData = project.composerData;
      if (composerData) {
        dispatch(
          loadProjectData({
            nodes: composerData.nodes ?? [],
            edges: composerData.edges ?? [],
            nodeConfigs: composerData.nodeConfigs ?? {},
          }),
        );
      }
      dispatch(
        showNotification({
          message: `Restored to v${restoreTarget.version}`,
          severity: 'success',
        }),
      );
    } catch {
      dispatch(
        showNotification({
          message: 'Failed to restore version',
          severity: 'error',
        }),
      );
    } finally {
      setRestoreTarget(null);
    }
  };

  const handleCompare = async (version: Version) => {
    setDiffLoading(true);
    setDiffVersion(version);
    try {
      const { data } = await api.get(
        `/projects/${projectId}/versions/${version._id}`,
      );
      const versionData = data.data ?? data;
      const oldYaml = yamlFromComposerData(versionData.composerData);
      const newYaml = yamlFromComposerData({ nodeConfigs, edges });
      const diff = simpleDiff(
        oldYaml.split('\n'),
        newYaml.split('\n'),
      );
      setDiffData(diff);
    } catch {
      dispatch(
        showNotification({
          message: 'Failed to load version data',
          severity: 'error',
        }),
      );
      setDiffVersion(null);
    } finally {
      setDiffLoading(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 400,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">Version History</Typography>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="solar:close-circle-bold" width={20} />
          </IconButton>
        </Box>

        {/* Save Version */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Version message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            fullWidth
            variant="contained"
            size="small"
            disabled={saving}
            onClick={handleSave}
            startIcon={
              saving ? (
                <CircularProgress size={14} />
              ) : (
                <Iconify icon="solar:bookmark-bold" width={16} />
              )
            }
            sx={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            }}
          >
            Save Version
          </Button>
        </Box>

        {/* Version List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : versions.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No versions saved yet
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {versions.map((v, idx) => (
                <Box key={v._id}>
                  {idx > 0 && <Divider />}
                  <ListItem
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="subtitle2">
                        v{v.version}
                      </Typography>
                      <Chip
                        label={v.source}
                        size="small"
                        color={v.source === 'auto' ? 'info' : 'default'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(v.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {v.message && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {v.message}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setRestoreTarget(v)}
                        sx={{
                          fontSize: '0.7rem',
                          py: 0,
                          borderColor: 'grey.700',
                          color: 'grey.300',
                        }}
                      >
                        Restore
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleCompare(v)}
                        sx={{
                          fontSize: '0.7rem',
                          py: 0,
                          borderColor: 'grey.700',
                          color: 'grey.300',
                        }}
                      >
                        Compare
                      </Button>
                    </Box>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Drawer>

      {/* Restore Confirmation Dialog */}
      <Dialog open={!!restoreTarget} onClose={() => setRestoreTarget(null)}>
        <DialogTitle>Restore Version?</DialogTitle>
        <DialogContent>
          <Typography>
            This will replace the current project state with{' '}
            <strong>v{restoreTarget?.version}</strong>. Unsaved changes will be
            lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreTarget(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleRestore}
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diff Dialog */}
      <Dialog
        open={!!diffVersion}
        onClose={() => {
          setDiffVersion(null);
          setDiffData(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Compare v{diffVersion?.version} → Current
        </DialogTitle>
        <DialogContent>
          {diffLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : diffData ? (
            <Box
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                whiteSpace: 'pre',
                overflow: 'auto',
                maxHeight: 500,
                bgcolor: 'grey.900',
                borderRadius: 1,
                p: 2,
              }}
            >
              {diffData.map((line, i) => (
                <Box
                  key={i}
                  sx={{
                    color:
                      line.type === 'add'
                        ? '#4ade80'
                        : line.type === 'remove'
                          ? '#f87171'
                          : 'grey.400',
                    bgcolor:
                      line.type === 'add'
                        ? 'rgba(74, 222, 128, 0.08)'
                        : line.type === 'remove'
                          ? 'rgba(248, 113, 113, 0.08)'
                          : 'transparent',
                  }}
                >
                  {line.type === 'add'
                    ? '+ '
                    : line.type === 'remove'
                      ? '- '
                      : '  '}
                  {line.text}
                </Box>
              ))}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDiffVersion(null);
              setDiffData(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
