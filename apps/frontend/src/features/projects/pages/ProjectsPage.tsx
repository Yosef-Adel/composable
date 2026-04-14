import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, AppBar, Toolbar, IconButton, Alert, CircularProgress } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchProjects, createProjectAsync, deleteProjectAsync, setCurrentProject } from '../store/projectsSlice';
import { ProjectCard } from '../components/ProjectCard';
import { NewProjectDialog } from '../components/NewProjectDialog';

export function ProjectsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, isLoading, error } = useAppSelector((state) => state.projects);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = (name: string, description: string) => {
    dispatch(createProjectAsync({ name, description }));
  };

  const handleOpenProject = (projectId: string) => {
    dispatch(setCurrentProject(projectId));
    navigate(`/dashboard/${projectId}`);
  };

  const handleDeleteProject = (projectId: string) => {
    dispatch(deleteProjectAsync(projectId));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: 1,
          borderColor: 'grey.800',
        }}
      >
        <Toolbar>
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              color: 'grey.400',
              '&:hover': {
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <Iconify icon="solar:arrow-left-bold" width={24} />
          </IconButton>

          <Box>
            <Typography variant="h6">My Projects</Typography>
            <Typography variant="caption" color="text.secondary">
              Manage your Docker Compose stacks
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" width={20} />}
            onClick={() => setShowNewProjectDialog(true)}
            sx={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
              '&:hover': {
                background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)',
              },
            }}
          >
            New Project
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isLoading && projects.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 200px)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                opacity: 0.8,
              }}
            >
              <Iconify icon="solar:folder-open-bold" width={64} sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ mb: 2 }}>
              No Projects Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
              Create your first Docker Compose project to start building your infrastructure
              visually
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Iconify icon="solar:add-circle-bold" width={24} />}
              onClick={() => setShowNewProjectDialog(true)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.125rem',
                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)',
                },
              }}
            >
              Create Your First Project
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                All Projects
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
                  <ProjectCard
                    project={project}
                    onOpen={() => handleOpenProject(project.id)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>

      {/* New Project Dialog */}
      <NewProjectDialog
        open={showNewProjectDialog}
        onClose={() => setShowNewProjectDialog(false)}
        onCreate={handleCreateProject}
      />
    </Box>
  );
}
