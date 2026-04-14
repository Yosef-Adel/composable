import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

// ── Handle IDs for typed connections ────────────────────────────────
export const HANDLE_IDS = {
  DEPENDS_IN: 'depends-in',
  DEPENDS_OUT: 'depends-out',
  VOLUME: 'volume',
  NETWORK: 'network',
  ENV: 'env',
  // Volume/Network/Environment nodes have a single "link" handle
  LINK: 'link',
} as const;

// ── Edge colors by connection type ─────────────────────────────────
export const EDGE_COLORS: Record<string, string> = {
  depends: '#3b82f6',
  volume: '#a855f7',
  network: '#22c55e',
  env: '#f97316',
  default: '#64748b',
};

// ── Style map ──────────────────────────────────────────────────────
const nodeStyles: Record<string, { gradient: string; icon: string; bg: string; border: string }> = {
  service: {
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    icon: 'solar:server-bold',
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  volume: {
    gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    icon: 'solar:database-bold',
    bg: 'rgba(168, 85, 247, 0.08)',
    border: 'rgba(168, 85, 247, 0.3)',
  },
  network: {
    gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    icon: 'solar:wi-fi-router-bold',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.3)',
  },
  environment: {
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    icon: 'solar:box-minimalistic-bold',
    bg: 'rgba(249, 115, 22, 0.08)',
    border: 'rgba(249, 115, 22, 0.3)',
  },
};

const handleStyle = (color: string, size = 10) => ({
  width: size,
  height: size,
  background: color,
  border: '2px solid #0f172a',
});

interface HandleRowProps {
  icon: string;
  label: string;
  color: string;
  handleId: string;
  handleType: 'source' | 'target';
  handlePosition: Position;
}

function HandleRow({ icon, label, color, handleId, handleType, handlePosition }: HandleRowProps) {
  const isLeft = handlePosition === Position.Left;
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.5,
        flexDirection: isLeft ? 'row' : 'row-reverse',
      }}
    >
      <Handle
        type={handleType}
        position={handlePosition}
        id={handleId}
        style={{
          ...handleStyle(color),
          top: '50%',
          ...(isLeft ? { left: -5 } : { right: -5 }),
        }}
      />
      <Iconify icon={icon} width={14} sx={{ color, flexShrink: 0 }} />
      <Typography variant="caption" sx={{ color: 'grey.400', fontSize: '0.65rem' }}>
        {label}
      </Typography>
    </Box>
  );
}

// ── Service Node ───────────────────────────────────────────────────
export const ServiceNode = memo(({ data, selected }: NodeProps) => {
  const style = nodeStyles[data.serviceType] ?? nodeStyles.service;
  const isService = data.serviceType === 'service';

  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        minWidth: isService ? 220 : 160,
        bgcolor: style.bg,
        border: 2,
        borderColor: selected ? 'primary.main' : style.border,
        boxShadow: selected ? `0 0 0 2px rgba(99, 102, 241, 0.2)` : 'none',
        transition: 'all 0.2s',
        overflow: 'visible',
        '&:hover': { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)' },
      }}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1.5,
          pb: isService ? 0.5 : 1.5,
          borderBottom: isService ? 1 : 0,
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            background: style.gradient,
            borderRadius: 0.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Iconify icon={style.icon} width={16} sx={{ color: 'white' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>
            {data.label}
          </Typography>
          {isService && data.image && (
            <Typography variant="caption" noWrap sx={{ color: 'grey.500', fontSize: '0.65rem' }}>
              {data.image}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ── Service: connection sections with typed handles ──── */}
      {isService && (
        <Box sx={{ py: 0.5 }}>
          {/* Left handles: targets (volume, network, env come IN) */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <HandleRow
                icon="solar:database-bold"
                label="Volumes"
                color={EDGE_COLORS.volume}
                handleId={HANDLE_IDS.VOLUME}
                handleType="target"
                handlePosition={Position.Left}
              />
              <HandleRow
                icon="solar:wi-fi-router-bold"
                label="Networks"
                color={EDGE_COLORS.network}
                handleId={HANDLE_IDS.NETWORK}
                handleType="target"
                handlePosition={Position.Left}
              />
              <HandleRow
                icon="solar:box-minimalistic-bold"
                label="Env"
                color={EDGE_COLORS.env}
                handleId={HANDLE_IDS.ENV}
                handleType="target"
                handlePosition={Position.Left}
              />
            </Box>

            {/* Right side: config summary chips */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25, pr: 1.5, justifyContent: 'center' }}>
              {data.portCount > 0 && (
                <Chip label={`${data.portCount} port${data.portCount > 1 ? 's' : ''}`} size="small"
                  sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(59, 130, 246, 0.15)', color: 'grey.300' }} />
              )}
              {data.envCount > 0 && (
                <Chip label={`${data.envCount} env`} size="small"
                  sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(249, 115, 22, 0.15)', color: 'grey.300' }} />
              )}
              {data.volCount > 0 && (
                <Chip label={`${data.volCount} vol`} size="small"
                  sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(168, 85, 247, 0.15)', color: 'grey.300' }} />
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* ── Service: depends_on handles (top=in, bottom=out) ── */}
      {isService && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            id={HANDLE_IDS.DEPENDS_IN}
            style={{ ...handleStyle(EDGE_COLORS.depends, 12), top: -6 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id={HANDLE_IDS.DEPENDS_OUT}
            style={{ ...handleStyle(EDGE_COLORS.depends, 12), bottom: -6 }}
          />
        </>
      )}

      {/* ── Volume/Network/Environment: single source handle ─ */}
      {!isService && (
        <Handle
          type="source"
          position={Position.Right}
          id={HANDLE_IDS.LINK}
          style={{ ...handleStyle(style.border.replace('0.3', '1'), 12), right: -6 }}
        />
      )}
    </Paper>
  );
});

ServiceNode.displayName = 'ServiceNode';
