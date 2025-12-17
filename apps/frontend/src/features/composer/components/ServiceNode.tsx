import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Box, Typography, Paper } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

const getNodeStyle = (serviceType: string) => {
  switch (serviceType) {
    case 'service':
      return {
        color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        icon: 'solar:server-bold',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
      };
    case 'volume':
      return {
        color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        icon: 'solar:database-bold',
        bgColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgba(168, 85, 247, 0.3)',
      };
    case 'network':
      return {
        color: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
        icon: 'solar:wi-fi-router-bold',
        bgColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
      };
    case 'environment':
      return {
        color: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        icon: 'solar:box-minimalistic-bold',
        bgColor: 'rgba(249, 115, 22, 0.1)',
        borderColor: 'rgba(249, 115, 22, 0.3)',
      };
    default:
      return {
        color: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        icon: 'solar:box-bold',
        bgColor: 'rgba(107, 114, 128, 0.1)',
        borderColor: 'rgba(107, 114, 128, 0.3)',
      };
  }
};

export const ServiceNode = memo(({ data, selected }: NodeProps) => {
  const style = getNodeStyle(data.serviceType);

  return (
    <Paper
      sx={{
        minWidth: 200,
        bgcolor: style.bgColor,
        border: 2,
        borderColor: selected ? 'primary.main' : style.borderColor,
        boxShadow: selected ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Input Handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 12,
          height: 12,
          background: '#3b82f6',
          border: '2px solid #1e293b',
        }}
      />

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              background: style.color,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon={style.icon} width={20} sx={{ color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {data.label}
            </Typography>
            <Typography variant="caption" sx={{ color: 'grey.400' }}>
              {data.serviceType}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Output Handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 12,
          height: 12,
          background: '#3b82f6',
          border: '2px solid #1e293b',
        }}
      />
    </Paper>
  );
});

ServiceNode.displayName = 'ServiceNode';
