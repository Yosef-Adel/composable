import { Box, Typography, Paper } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import type { BuildingBlock, BuildingBlockType } from '../types';

interface ServicePaletteProps {
  onAddService: (serviceType: BuildingBlockType) => void;
}

const buildingBlocks: BuildingBlock[] = [
  {
    id: 'service',
    name: 'Service',
    icon: 'solar:server-bold',
    color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    description: 'Add a container service',
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: 'solar:database-bold',
    color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    description: 'Add a named volume',
  },
  {
    id: 'network',
    name: 'Network',
    icon: 'solar:wi-fi-router-bold',
    color: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    description: 'Add a network',
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: 'solar:box-minimalistic-bold',
    color: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    description: 'Add environment group',
  },
];

export function ServicePalette({ onAddService }: ServicePaletteProps) {
  return (
    <Box
      sx={{
        width: 280,
        borderRight: 1,
        borderColor: 'grey.800',
        bgcolor: 'rgba(15, 23, 42, 0.5)',
        overflow: 'auto',
        flexShrink: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Building Blocks
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Click to add components
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {buildingBlocks.map((block) => (
            <Paper
              key={block.id}
              onClick={() => onAddService(block.id)}
              sx={{
                position: 'relative',
                p: 2,
                bgcolor: 'rgba(30, 41, 59, 0.5)',
                border: 1,
                borderColor: 'grey.700',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'grey.600',
                  transform: 'translateY(-2px)',
                  '& .gradient-overlay': {
                    opacity: 0.1,
                  },
                },
              }}
            >
              <Box
                className="gradient-overlay"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: block.color,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  pointerEvents: 'none',
                }}
              />
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    background: block.color,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon={block.icon} width={20} sx={{ color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {block.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {block.description}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Quick Tips */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            border: 1,
            borderColor: 'rgba(59, 130, 246, 0.2)',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.light', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Iconify icon="solar:lightbulb-bolt-bold" width={16} />
            Tips
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.5, fontSize: '0.75rem', color: 'grey.300' } }}>
            <li>Click a block to add it to the canvas</li>
            <li>Drag nodes to rearrange them</li>
            <li>Connect nodes by dragging from handles</li>
            <li>Click a node to configure its properties</li>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
