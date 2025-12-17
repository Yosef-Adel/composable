import { Card, CardContent, Box, Typography, IconButton, Chip } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onOpen, onDelete }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: 'rgba(30, 41, 59, 0.5)',
        border: 1,
        borderColor: 'grey.700',
        transition: 'all 0.2s',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.1)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={onOpen}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:folder-with-files-bold" width={24} sx={{ color: 'white' }} />
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{
              color: 'grey.400',
              '&:hover': {
                color: 'error.main',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={20} />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {project.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {project.description || 'No description'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<Iconify icon="solar:layers-bold" width={16} />}
            label={`${project.nodeCount} services`}
            size="small"
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.light',
              border: 1,
              borderColor: 'rgba(99, 102, 241, 0.2)',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'grey.400' }}>
            <Iconify icon="solar:clock-circle-bold" width={16} />
            <Typography variant="caption">{formatDate(project.updatedAt)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
