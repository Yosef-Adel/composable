import { useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  addNode as addNodeAction,
  applyNodeChangesAction,
  applyEdgeChangesAction,
  addConnection,
  setSelectedNode,
} from '../store/composerSlice';
import { updateProject } from '@/features/projects/store/projectsSlice';
import { ServicePalette } from '../components/ServicePalette';
import { ServiceNode } from '../components/ServiceNode';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { generateYaml } from '../utils/yamlGenerator';
import type { BuildingBlockType } from '../types';

// Must be defined outside the component to keep a stable reference
const nodeTypes = {
  service: ServiceNode,
  volume: ServiceNode,
  network: ServiceNode,
  environment: ServiceNode,
};

export function DashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { projects } = useAppSelector((state) => state.projects);
  const nodes = useAppSelector((state) => state.composer.nodes);
  const edges = useAppSelector((state) => state.composer.edges);
  const nodeConfigs = useAppSelector((state) => state.composer.nodeConfigs);

  const [showYamlDialog, setShowYamlDialog] = useState(false);

  const currentProject = projects.find((p) => p.id === projectId);
  const yamlContent = useMemo(() => generateYaml(nodeConfigs, edges), [nodeConfigs, edges]);

  // ── ReactFlow event handlers (all route through Redux) ──────────

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      dispatch(applyNodeChangesAction(changes));

      // Keep project node count in sync after removals
      const hasRemovals = changes.some((c) => c.type === 'remove');
      if (hasRemovals && projectId) {
        const remaining = Object.keys(nodeConfigs).length;
        dispatch(updateProject({ id: projectId, nodeCount: remaining }));
      }
    },
    [dispatch, projectId, nodeConfigs]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      dispatch(applyEdgeChangesAction(changes));
    },
    [dispatch]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      dispatch(addConnection(connection));
    },
    [dispatch]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      dispatch(setSelectedNode(node.id));
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch(setSelectedNode(null));
  }, [dispatch]);

  // ── Actions ─────────────────────────────────────────────────────

  const handleAddService = useCallback(
    (serviceType: BuildingBlockType) => {
      dispatch(
        addNodeAction({
          blockType: serviceType,
          position: {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
          },
        })
      );
    },
    [dispatch]
  );

  const handleDownloadYaml = useCallback(() => {
    if (!yamlContent) return;
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    a.click();
    URL.revokeObjectURL(url);
  }, [yamlContent]);

  // ── Render ──────────────────────────────────────────────────────

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: 1,
          borderColor: 'grey.800',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
              <Iconify icon="solar:box-bold" width={24} sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6">{currentProject?.name || 'Composable'}</Typography>
              <Typography variant="caption" color="text.secondary">
                Docker Compose Project
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => navigate('/projects')} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:home-2-bold" width={20} />
            </IconButton>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:code-bold" width={16} />}
              onClick={() => setShowYamlDialog(true)}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              View YAML
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:download-bold" width={16} />}
              onClick={handleDownloadYaml}
              disabled={!yamlContent}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              Download
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="solar:rocket-bold" width={16} />}
              sx={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}
            >
              Deploy
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Service Palette */}
        <ServicePalette onAddService={handleAddService} />

        {/* Center: ReactFlow Canvas */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            deleteKeyCode={['Backspace', 'Delete']}
            style={{ background: '#0f172a' }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
            <Controls
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
              }}
            />
          </ReactFlow>

          {/* Empty State */}
          {nodes.length === 0 && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ mb: 2, fontSize: '4rem' }}>
                  🐳
                </Typography>
                <Typography variant="h5" sx={{ mb: 1, color: 'grey.300' }}>
                  Start Building Your Stack
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click a service from the sidebar to begin
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Right: Properties Panel */}
        <PropertiesPanel />
      </Box>

      {/* YAML Preview Dialog */}
      <Dialog
        open={showYamlDialog}
        onClose={() => setShowYamlDialog(false)}
        maxWidth="md"
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
            <Iconify icon="solar:code-bold" width={24} />
            docker-compose.yml
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            component="pre"
            sx={{
              p: 2,
              bgcolor: 'rgba(15, 23, 42, 0.8)',
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              border: 1,
              borderColor: 'grey.700',
            }}
          >
            {yamlContent || '# No services added yet'}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowYamlDialog(false)}>Close</Button>
          <Button
            onClick={handleDownloadYaml}
            variant="contained"
            startIcon={<Iconify icon="solar:download-bold" width={16} />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
