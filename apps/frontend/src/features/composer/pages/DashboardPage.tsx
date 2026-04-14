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
  type Node,
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
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { showNotification } from '@/app/store/notificationSlice';
import { logoutAsync } from '@/features/auth/store/authSlice';
import { api } from '@/services/api';
import {
  addNode as addNodeAction,
  addStack as addStackAction,
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
import { DocsPanel } from '../components/DocsPanel';
import { ShareDialog } from '../components/ShareDialog';
import { ProjectSettingsDialog } from '../components/ProjectSettingsDialog';
import { VersionHistoryPanel } from '../components/VersionHistoryPanel';
import { ResizeHandle } from '../components/ResizeHandle';
import { OnboardingTour } from '../components/OnboardingTour';
import { generateYaml } from '../utils/yamlGenerator';
import { generateDocs } from '../utils/docsGenerator';
import { parseDockerCompose } from '../utils/yamlImporter';
import { validateCompose } from '../utils/composeValidator';
import { autoLayout, type LayoutDirection } from '../utils/autoLayout';
import type { BuildingBlockType, NodeConfig, ServiceConfig } from '../types';
import type { StackTemplate } from '../data/stackTemplates';
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
  const user = useAppSelector((state) => state.auth.user);

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const [clipboard, setClipboard] = useState<{nodes: Node[], configs: Record<string, NodeConfig>} | null>(null);
  const [showYamlPanel, setShowYamlPanel] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [projectName, setProjectName] = useState('Composable');
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [yamlPanelWidth, setYamlPanelWidth] = useState(420);
  const [validationPanelWidth, setValidationPanelWidth] = useState(360);
  const [canvasTool, setCanvasTool] = useState<'select' | 'hand'>('select');
  const [showDocsPanel, setShowDocsPanel] = useState(false);
  const [docsPanelWidth, setDocsPanelWidth] = useState(420);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadedRef = useRef(false);
  const projectIdRef = useRef(projectId);
  projectIdRef.current = projectId;

  // Keep refs to latest state for use in unmount/beforeunload saves
  const latestStateRef = useRef({ nodes, edges, nodeConfigs });
  latestStateRef.current = { nodes, edges, nodeConfigs };

  const handleApplyYaml = useCallback((yamlString: string) => {
    try {
      const parsed = parseDockerCompose(yamlString);
      dispatch(loadProjectData(parsed));
      dispatch(showNotification({ message: 'YAML applied to canvas', severity: 'success' }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid YAML';
      dispatch(showNotification({ message: `Failed to apply YAML: ${message}`, severity: 'error' }));
    }
  }, [dispatch]);

  // Synchronous save function (for beforeunload)
  const saveSync = useCallback(() => {
    const pid = projectIdRef.current;
    if (!pid || !isLoadedRef.current) return;
    const { nodes: n, edges: e, nodeConfigs: nc } = latestStateRef.current;
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
      .then(() => setIsDirty(false))
      .catch(() => {});
  }, []);

  const yamlContent = useMemo(() => generateYaml(nodeConfigs, edges), [nodeConfigs, edges]);
  const docsContent = useMemo(() => generateDocs(nodeConfigs, edges, projectName), [nodeConfigs, edges, projectName]);

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

        dispatch(showNotification({ message: 'Project loaded', severity: 'success' }));

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

    setIsDirty(true);
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

  const handleAddStack = useCallback(
    (stack: StackTemplate) => {
      // Center the stack in the current viewport
      const viewport = reactFlowInstance.getViewport();
      const centerX = (-viewport.x + window.innerWidth / 2) / viewport.zoom;
      const centerY = (-viewport.y + window.innerHeight / 2) / viewport.zoom;
      dispatch(
        addStackAction({
          stack,
          origin: { x: centerX, y: centerY },
        })
      );
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.3, duration: 300 }), 50);
    },
    [dispatch, reactFlowInstance]
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
      // Skip if typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

      // Non-modifier shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            setCanvasTool('hand');
            return;
          case 'v':
            setCanvasTool('select');
            return;
        }
        return;
      }

      switch (e.key) {
        case 's':
          e.preventDefault();
          saveAsync();
          // Also save a version snapshot automatically
          if (projectId) {
            api.post(`/projects/${projectId}/versions`, { message: 'Auto-save', source: 'auto' }).catch(() => {});
          }
          dispatch(showNotification({ message: 'Project saved', severity: 'success' }));
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
        case 'c': {
          e.preventDefault();
          const selectedNodes = reactFlowInstance.getNodes().filter((n) => n.selected);
          if (selectedNodes.length === 0) break;
          const configs: Record<string, NodeConfig> = {};
          for (const n of selectedNodes) {
            if (nodeConfigs[n.id]) {
              configs[n.id] = nodeConfigs[n.id];
            }
          }
          setClipboard({ nodes: selectedNodes, configs });
          break;
        }
        case 'v': {
          e.preventDefault();
          if (!clipboard) break;
          for (const node of clipboard.nodes) {
            const config = clipboard.configs[node.id];
            if (!config) continue;
            const blockType = config.type as BuildingBlockType;
            const template: Partial<ServiceConfig> = { ...config } as Partial<ServiceConfig>;
            dispatch(addNodeAction({
              blockType,
              position: { x: node.position.x + 50, y: node.position.y + 50 },
              template,
            }));
          }
          break;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dispatch, saveAsync, clipboard, nodeConfigs, reactFlowInstance, projectId]);

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
        <Toolbar id="onboarding-toolbar">
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">{projectName}</Typography>
                {isDirty && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'warning.main',
                      flexShrink: 0,
                    }}
                    title="Unsaved changes"
                  />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Docker Compose Project
              </Typography>
            </Box>

            <IconButton onClick={() => setSettingsOpen(true)} size="small" sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:settings-bold" width={18} />
            </IconButton>
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
              onClick={() => { setShowYamlPanel((v) => !v); setShowValidation(false); setShowDocsPanel(false); }}
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
              onClick={() => { setShowValidation((v) => !v); setShowYamlPanel(false); setShowDocsPanel(false); }}
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
              onClick={() => {
                if (!yamlContent) return;
                const issues = validateCompose(nodeConfigs, edges);
                const errors = issues.filter((i) => i.severity === 'error');
                if (errors.length > 0) {
                  dispatch(showNotification({ message: `Compose has ${errors.length} error(s). Fix them before exporting.`, severity: 'warning' }));
                  return;
                }
                const warnings = issues.filter((i) => i.severity === 'warning' || i.severity === 'info');
                navigator.clipboard.writeText(yamlContent);
                if (warnings.length > 0) {
                  dispatch(showNotification({ message: `Copied to clipboard with ${warnings.length} warning(s)`, severity: 'info' }));
                } else {
                  dispatch(showNotification({ message: 'Copied to clipboard', severity: 'success' }));
                }
              }}
              disabled={!yamlContent}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              Copy
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:download-bold" width={16} />}
              onClick={() => {
                if (!yamlContent) return;
                const issues = validateCompose(nodeConfigs, edges);
                const errors = issues.filter((i) => i.severity === 'error');
                if (errors.length > 0) {
                  dispatch(showNotification({ message: `Fix ${errors.length} error(s) before exporting`, severity: 'warning' }));
                  setShowValidation(true);
                  setShowYamlPanel(false);
                  setShowDocsPanel(false);
                  return;
                }
                // Download docker-compose.yml + README.md
                const docs = generateDocs(nodeConfigs, edges, projectName);
                const composeBlob = new Blob([yamlContent], { type: 'text/yaml' });
                const docsBlob = new Blob([docs], { type: 'text/markdown' });
                const composeUrl = URL.createObjectURL(composeBlob);
                const a1 = document.createElement('a');
                a1.href = composeUrl;
                a1.download = 'docker-compose.yml';
                a1.click();
                URL.revokeObjectURL(composeUrl);
                setTimeout(() => {
                  const docsUrl = URL.createObjectURL(docsBlob);
                  const a2 = document.createElement('a');
                  a2.href = docsUrl;
                  a2.download = 'README.md';
                  a2.click();
                  URL.revokeObjectURL(docsUrl);
                }, 200);
                const warnings = issues.filter((i) => i.severity === 'warning');
                dispatch(showNotification({
                  message: warnings.length > 0
                    ? `Downloaded with ${warnings.length} warning(s)`
                    : 'Downloaded docker-compose.yml + README.md',
                  severity: 'success',
                }));
              }}
              disabled={!yamlContent}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              Download
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:document-text-bold" width={16} />}
              onClick={() => { setShowDocsPanel((v) => !v); setShowYamlPanel(false); setShowValidation(false); }}
              disabled={Object.keys(nodeConfigs).length === 0}
              sx={{
                borderColor: showDocsPanel ? 'primary.main' : 'grey.700',
                color: showDocsPanel ? 'primary.main' : 'grey.300',
              }}
            >
              Docs
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon="solar:history-bold" width={16} />}
              onClick={() => setVersionHistoryOpen(true)}
              sx={{ borderColor: 'grey.700', color: 'grey.300' }}
            >
              History
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

            {user && (
              <>
                <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} sx={{ ml: 0.5 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                    {(user.name?.[0] ?? 'U').toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{ paper: { sx: { mt: 1, minWidth: 200 } } }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <MenuItem
                    onClick={() => { dispatch(logoutAsync()); setUserMenuAnchor(null); navigate('/'); }}
                    sx={{ color: 'error.main', gap: 1 }}
                  >
                    <Iconify icon="solar:logout-2-bold" width={20} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Service Palette */}
        {leftCollapsed ? (
          <Box
            id="onboarding-left-panel"
            sx={{
              width: 40,
              borderRight: 1,
              borderColor: 'grey.800',
              bgcolor: 'rgba(15, 23, 42, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 1,
              flexShrink: 0,
            }}
          >
            <IconButton size="small" onClick={() => setLeftCollapsed(false)} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:alt-arrow-right-bold" width={18} />
            </IconButton>
          </Box>
        ) : (
          <>
            <Box id="onboarding-left-panel" sx={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
              <ServicePalette onAddService={handleAddService} onAddStack={handleAddStack} width={leftPanelWidth} />
              <IconButton
                size="small"
                onClick={() => setLeftCollapsed(true)}
                sx={{ position: 'absolute', top: 8, right: 4, color: 'grey.400', zIndex: 1 }}
              >
                <Iconify icon="solar:alt-arrow-left-bold" width={18} />
              </IconButton>
            </Box>
            <ResizeHandle side="right" width={leftPanelWidth} onResize={setLeftPanelWidth} minWidth={200} maxWidth={450} />
          </>
        )}

        {/* Center: ReactFlow Canvas */}
        <Box id="onboarding-canvas" sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
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
            panOnDrag={canvasTool === 'hand'}
            selectionOnDrag={canvasTool === 'select'}
            panOnScroll
            style={{ background: '#0f172a', cursor: canvasTool === 'hand' ? 'grab' : 'default' }}
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

            {/* Canvas Tool Switcher */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                display: 'flex',
                gap: 0.25,
                bgcolor: 'rgba(30, 41, 59, 0.95)',
                border: 1,
                borderColor: 'grey.700',
                borderRadius: 1,
                p: 0.25,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setCanvasTool('select')}
                title="Select (V)"
                sx={{
                  color: canvasTool === 'select' ? 'primary.main' : 'grey.500',
                  bgcolor: canvasTool === 'select' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  borderRadius: 0.75,
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: canvasTool === 'select' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)' },
                }}
              >
                <Iconify icon="solar:cursor-bold" width={18} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setCanvasTool('hand')}
                title="Hand (H)"
                sx={{
                  color: canvasTool === 'hand' ? 'primary.main' : 'grey.500',
                  bgcolor: canvasTool === 'hand' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  borderRadius: 0.75,
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: canvasTool === 'hand' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)' },
                }}
              >
                <Iconify icon="solar:hand-shake-bold" width={18} />
              </IconButton>
            </Box>
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
        {rightCollapsed ? (
          <Box
            id="onboarding-right-panel"
            sx={{
              width: 40,
              borderLeft: 1,
              borderColor: 'grey.800',
              bgcolor: 'rgba(15, 23, 42, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 1,
              flexShrink: 0,
            }}
          >
            <IconButton size="small" onClick={() => setRightCollapsed(false)} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:alt-arrow-left-bold" width={18} />
            </IconButton>
          </Box>
        ) : (
          <>
            <ResizeHandle side="left" width={rightPanelWidth} onResize={setRightPanelWidth} minWidth={240} maxWidth={500} />
            <Box id="onboarding-right-panel" sx={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
              <IconButton
                size="small"
                onClick={() => setRightCollapsed(true)}
                sx={{ position: 'absolute', top: 8, left: 4, color: 'grey.400', zIndex: 1 }}
              >
                <Iconify icon="solar:alt-arrow-right-bold" width={18} />
              </IconButton>
              <PropertiesPanel width={rightPanelWidth} />
            </Box>
          </>
        )}

        {/* YAML Panel (Monaco Editor) */}
        {showYamlPanel && (
          <ResizeHandle side="left" width={yamlPanelWidth} onResize={setYamlPanelWidth} minWidth={300} maxWidth={700} />
        )}
        <YamlPanel yaml={yamlContent} open={showYamlPanel} onClose={() => setShowYamlPanel(false)} onApplyYaml={handleApplyYaml} width={yamlPanelWidth} />

        {/* Validation Panel */}
        {showValidation && (
          <ResizeHandle side="left" width={validationPanelWidth} onResize={setValidationPanelWidth} minWidth={280} maxWidth={600} />
        )}
        <ValidationPanel open={showValidation} onClose={() => setShowValidation(false)} width={validationPanelWidth} />

        {/* Docs Panel */}
        {showDocsPanel && (
          <ResizeHandle side="left" width={docsPanelWidth} onResize={setDocsPanelWidth} minWidth={300} maxWidth={700} />
        )}
        <DocsPanel docs={docsContent} open={showDocsPanel} onClose={() => setShowDocsPanel(false)} width={docsPanelWidth} />
      </Box>

      {/* Share Dialog */}
      {projectId && (
        <ShareDialog
          open={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          projectId={projectId}
        />
      )}

      {/* Project Settings Dialog */}
      {projectId && (
        <ProjectSettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          projectId={projectId}
          projectName={projectName}
          onNameChange={setProjectName}
        />
      )}

      {/* Version History Panel */}
      {projectId && (
        <VersionHistoryPanel
          open={versionHistoryOpen}
          onClose={() => setVersionHistoryOpen(false)}
          projectId={projectId}
        />
      )}

      {/* Onboarding Tour */}
      {!isLoading && <OnboardingTour />}
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
