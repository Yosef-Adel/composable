import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeMouseHandler,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { api } from '@/services/api';
import {
  addNode as addNodeAction,
  applyNodeChangesAction,
  applyEdgeChangesAction,
  addConnection,
  setSelectedNode,
  setNodes,
  loadProjectData,
  clearComposer,
  undo,
  redo,
} from '../store/composerSlice';
import { ServicePalette } from '../components/ServicePalette';
import { ServiceNode } from '../components/ServiceNode';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { YamlPanel } from '../components/YamlPanel';
import { ValidationPanel } from '../components/ValidationPanel';
import { ShareDialog } from '../components/ShareDialog';
import { ResizeHandle } from '../components/ResizeHandle';
import { generateYaml } from '../utils/yamlGenerator';
import { generateDocs } from '../utils/docsGenerator';
import { parseDockerCompose } from '../utils/yamlImporter';
import { autoLayout, type LayoutDirection } from '../utils/autoLayout';
import type { BuildingBlockType, ServiceConfig } from '../types';
import { HANDLE_IDS } from '../components/ServiceNode';

// Must be defined outside the component to keep a stable reference
const nodeTypes = {
  service: ServiceNode,
  volume: ServiceNode,
  network: ServiceNode,
  environment: ServiceNode,
};

function DashboardPageInner() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const reactFlowInstance = useReactFlow();

  const nodes = useAppSelector((state) => state.composer.nodes);
  const edges = useAppSelector((state) => state.composer.edges);
  const nodeConfigs = useAppSelector((state) => state.composer.nodeConfigs);

  const [showYamlPanel, setShowYamlPanel] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [projectName, setProjectName] = useState('Composable');
  const [isLoading, setIsLoading] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [yamlPanelWidth, setYamlPanelWidth] = useState(420);
  const [validationPanelWidth, setValidationPanelWidth] = useState(360);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadedRef = useRef(false);
  const projectIdRef = useRef(projectId);
  projectIdRef.current = projectId;

  // Keep refs to latest state for use in unmount/beforeunload saves
  const latestStateRef = useRef({ nodes, edges, nodeConfigs });
  latestStateRef.current = { nodes, edges, nodeConfigs };

  // Synchronous save function (for beforeunload)
  const saveSync = useCallback(() => {
    const pid = projectIdRef.current;
    if (!pid || !isLoadedRef.current) return;
    const { nodes: n, edges: e, nodeConfigs: nc } = latestStateRef.current;
    // Serialize only what we need from nodes (strip ReactFlow internals)
    const cleanNodes = n.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));
    const payload = JSON.stringify({
      nodes: cleanNodes,
      edges: e,
      nodeConfigs: nc,
      nodeCount: n.length,
    });
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const tokens = JSON.parse(localStorage.getItem('composable_tokens') ?? 'null');
    if (tokens?.accessToken) {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${baseUrl}/projects/${pid}/composer`, false);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      try { xhr.send(payload); } catch { /* best effort */ }
    }
  }, []);

  // Async save function (for debounced autosave)
  const saveAsync = useCallback(() => {
    const pid = projectIdRef.current;
    if (!pid || !isLoadedRef.current) return;
    const { nodes: n, edges: e, nodeConfigs: nc } = latestStateRef.current;
    const cleanNodes = n.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));
    api
      .put(`/projects/${pid}/composer`, {
        nodes: cleanNodes,
        edges: e,
        nodeConfigs: nc,
        nodeCount: n.length,
      })
      .catch(() => {});
  }, []);

  const yamlContent = useMemo(() => generateYaml(nodeConfigs, edges), [nodeConfigs, edges]);

  // Load composer data from backend
  useEffect(() => {
    if (!projectId) return;

    isLoadedRef.current = false;
    setIsLoading(true);

    (async () => {
      try {
        const { data: projResp } = await api.get(`/projects/${projectId}`);
        const project = projResp.data;
        setProjectName(project.name ?? 'Composable');

        const composerData = project.composerData;
        dispatch(
          loadProjectData({
            nodes: composerData?.nodes ?? [],
            edges: composerData?.edges ?? [],
            nodeConfigs: composerData?.nodeConfigs ?? {},
          }),
        );

        // Allow auto-save only after load settles
        setTimeout(() => {
          isLoadedRef.current = true;
        }, 200);
      } catch {
        // Project not found or unauthorized
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      // Save before unmount (navigation away)
      saveSync();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      isLoadedRef.current = false;
      dispatch(clearComposer());
    };
  }, [projectId, dispatch, saveSync]);

  // Debounced auto-save (2 seconds after last change)
  useEffect(() => {
    if (!projectId || !isLoadedRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(saveAsync, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [projectId, nodes, edges, nodeConfigs, saveAsync]);

  // Flush on page refresh/close
  useEffect(() => {
    window.addEventListener('beforeunload', saveSync);
    return () => window.removeEventListener('beforeunload', saveSync);
  }, [saveSync]);

  // ── ReactFlow event handlers (all route through Redux) ──────────

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      dispatch(applyNodeChangesAction(changes));
    },
    [dispatch],
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
    (serviceType: BuildingBlockType, template?: Partial<ServiceConfig>) => {
      dispatch(
        addNodeAction({
          blockType: serviceType,
          position: {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
          },
          template,
        })
      );
    },
    [dispatch]
  );

  // Validate connections at the drag level before they reach Redux
  const isValidConnection = useCallback(
    (connection: Connection) => {
      const sourceConfig = nodeConfigs[connection.source!];
      const targetConfig = nodeConfigs[connection.target!];
      if (!sourceConfig || !targetConfig) return false;

      // Volume link → must go to volume handle
      if (sourceConfig.type === 'volume') return connection.targetHandle === HANDLE_IDS.VOLUME;
      if (sourceConfig.type === 'network') return connection.targetHandle === HANDLE_IDS.NETWORK;
      if (sourceConfig.type === 'environment') return connection.targetHandle === HANDLE_IDS.ENV;

      // Service → Service depends_on
      if (sourceConfig.type === 'service' && targetConfig.type === 'service') {
        return connection.sourceHandle === HANDLE_IDS.DEPENDS_OUT && connection.targetHandle === HANDLE_IDS.DEPENDS_IN;
      }

      return false;
    },
    [nodeConfigs]
  );

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2, duration: 300 });
  }, [reactFlowInstance]);

  const handleAutoLayout = useCallback(
    (direction: LayoutDirection = 'TB') => {
      const layouted = autoLayout(nodes, edges, direction);
      dispatch(setNodes(layouted));
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 300 }), 50);
    },
    [nodes, edges, dispatch, reactFlowInstance],
  );

  const handleImportYaml = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yml,.yaml';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = parseDockerCompose(text);
        // Auto-layout the imported nodes
        const layouted = autoLayout(parsed.nodes, parsed.edges, 'TB');
        dispatch(loadProjectData({ nodes: layouted, edges: parsed.edges, nodeConfigs: parsed.nodeConfigs }));
        setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 300 }), 100);
      } catch {
        // Invalid YAML
      }
    };
    input.click();
  }, [dispatch, reactFlowInstance]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;

      switch (e.key) {
        case 's':
          e.preventDefault();
          saveAsync();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            dispatch(redo());
          } else {
            dispatch(undo());
          }
          break;
        case 'y':
          e.preventDefault();
          dispatch(redo());
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, saveAsync]);

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
              <Typography variant="h6">{projectName}</Typography>
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

            <IconButton onClick={handleFitView} sx={{ color: 'grey.400' }} title="Fit to view">
              <Iconify icon="solar:maximize-bold" width={20} />
            </IconButton>

            <IconButton onClick={() => handleAutoLayout('TB')} sx={{ color: 'grey.400' }} title="Auto-layout (top to bottom)">
              <Iconify icon="solar:sort-vertical-bold" width={20} />
            </IconButton>

            <IconButton onClick={() => handleAutoLayout('LR')} sx={{ color: 'grey.400' }} title="Auto-layout (left to right)">
              <Iconify icon="solar:sort-horizontal-bold" width={20} />
            </IconButton>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:upload-bold" width={16} />}
              onClick={handleImportYaml}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              Import
            </Button>

            <Button
              variant={showYamlPanel ? 'contained' : 'outlined'}
              size="small"
              startIcon={<Iconify icon="solar:code-bold" width={16} />}
              onClick={() => { setShowYamlPanel((v) => !v); setShowValidation(false); }}
              sx={showYamlPanel
                ? { background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }
                : { borderColor: 'grey.700', color: 'grey.300' }
              }
            >
              YAML
            </Button>

            <Button
              variant={showValidation ? 'contained' : 'outlined'}
              size="small"
              startIcon={<Iconify icon="solar:shield-check-bold" width={16} />}
              onClick={() => { setShowValidation((v) => !v); setShowYamlPanel(false); }}
              sx={showValidation
                ? { background: 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)' }
                : { borderColor: 'grey.700', color: 'grey.300' }
              }
            >
              Validate
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:copy-bold" width={16} />}
              onClick={() => yamlContent && navigator.clipboard.writeText(yamlContent)}
              disabled={!yamlContent}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              Copy
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:document-text-bold" width={16} />}
              onClick={() => {
                const docs = generateDocs(nodeConfigs, edges, projectName);
                const blob = new Blob([docs], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'README.md';
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={Object.keys(nodeConfigs).length === 0}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              Docs
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="solar:rocket-bold" width={16} />}
              sx={{ background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}
            >
              Deploy
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:share-bold" width={16} />}
              onClick={() => setShowShareDialog(true)}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              Share
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Service Palette */}
        <ServicePalette onAddService={handleAddService} width={leftPanelWidth} />
        <ResizeHandle side="right" width={leftPanelWidth} onResize={setLeftPanelWidth} minWidth={200} maxWidth={450} />

        {/* Center: ReactFlow Canvas */}
        <Box sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            isValidConnection={isValidConnection}
            deleteKeyCode={['Backspace', 'Delete']}
            snapToGrid
            snapGrid={[16, 16]}
            style={{ background: '#0f172a' }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
            <Controls
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
              }}
            />
            <MiniMap
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
              }}
              nodeColor="#3b82f6"
              maskColor="rgba(15, 23, 42, 0.7)"
            />
          </ReactFlow>

          {/* Loading Overlay */}
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(15, 23, 42, 0.9)',
                zIndex: 10,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={48} sx={{ mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ color: 'grey.300' }}>
                  Loading project...
                </Typography>
              </Box>
            </Box>
          )}

          {/* Empty State */}
          {!isLoading && nodes.length === 0 && (
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
        <ResizeHandle side="left" width={rightPanelWidth} onResize={setRightPanelWidth} minWidth={240} maxWidth={500} />
        <PropertiesPanel width={rightPanelWidth} />

        {/* YAML Panel (Monaco Editor) */}
        {showYamlPanel && (
          <ResizeHandle side="left" width={yamlPanelWidth} onResize={setYamlPanelWidth} minWidth={300} maxWidth={700} />
        )}
        <YamlPanel yaml={yamlContent} open={showYamlPanel} onClose={() => setShowYamlPanel(false)} width={yamlPanelWidth} />

        {/* Validation Panel */}
        {showValidation && (
          <ResizeHandle side="left" width={validationPanelWidth} onResize={setValidationPanelWidth} minWidth={280} maxWidth={600} />
        )}
        <ValidationPanel open={showValidation} onClose={() => setShowValidation(false)} width={validationPanelWidth} />
      </Box>

      {/* Share Dialog */}
      {projectId && (
        <ShareDialog
          open={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          projectId={projectId}
        />
      )}
    </Box>
  );
}

export function DashboardPage() {
  return (
    <ReactFlowProvider>
      <DashboardPageInner />
    </ReactFlowProvider>
  );
}

export default DashboardPage;
