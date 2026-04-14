import { useMemo } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setSelectedNode } from '../store/composerSlice';
import { validateCompose, type ValidationIssue, type ValidationSeverity } from '../utils/composeValidator';

const severityConfig: Record<ValidationSeverity, { icon: string; color: string; bg: string }> = {
  error: { icon: 'solar:danger-circle-bold', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  warning: { icon: 'solar:danger-triangle-bold', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  info: { icon: 'solar:info-circle-bold', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
};

interface ValidationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function ValidationPanel({ open, onClose }: ValidationPanelProps) {
  const dispatch = useAppDispatch();
  const nodeConfigs = useAppSelector((s) => s.composer.nodeConfigs);
  const edges = useAppSelector((s) => s.composer.edges);

  const issues = useMemo(() => validateCompose(nodeConfigs, edges), [nodeConfigs, edges]);

  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;

  if (!open) return null;

  const handleIssueClick = (issue: ValidationIssue) => {
    if (issue.nodeId) {
      dispatch(setSelectedNode(issue.nodeId));
    }
  };

  return (
    <Box
      sx={{
        width: 360,
        borderLeft: 1,
        borderColor: 'grey.800',
        bgcolor: 'rgba(15, 23, 42, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, borderBottom: 1, borderColor: 'grey.800' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:shield-check-bold" width={18} sx={{ color: errors > 0 ? '#ef4444' : '#22c55e' }} />
          <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>
            Validation
          </Typography>
          {errors > 0 && <Chip label={`${errors} error${errors > 1 ? 's' : ''}`} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }} />}
          {warnings > 0 && <Chip label={`${warnings} warn`} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }} />}
        </Box>
        <Box
          onClick={onClose}
          sx={{ cursor: 'pointer', color: 'grey.400', '&:hover': { color: 'grey.200' } }}
        >
          <Iconify icon="solar:close-circle-line-duotone" width={18} />
        </Box>
      </Box>

      {/* Issues list */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
        {issues.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Iconify icon="solar:check-circle-bold" width={40} sx={{ color: '#22c55e', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#22c55e' }}>
              No issues found!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your compose configuration looks valid
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {issues.map((issue, idx) => {
              const cfg = severityConfig[issue.severity];
              return (
                <Paper
                  key={idx}
                  onClick={() => handleIssueClick(issue)}
                  sx={{
                    p: 1.25,
                    bgcolor: cfg.bg,
                    border: 1,
                    borderColor: 'transparent',
                    cursor: issue.nodeId ? 'pointer' : 'default',
                    transition: 'border-color 0.15s',
                    '&:hover': issue.nodeId ? { borderColor: cfg.color } : {},
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Iconify icon={cfg.icon} width={16} sx={{ color: cfg.color, mt: 0.25, flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ color: 'grey.300', fontSize: '0.75rem', lineHeight: 1.5 }}>
                      {issue.message}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
