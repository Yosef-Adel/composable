import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import { HANDLE_IDS, EDGE_COLORS } from '../components/ServiceNode';
import type {
  ComposerState,
  NodeConfig,
  ServiceConfig,
  VolumeConfig,
  NetworkConfig,
  EnvironmentConfig,
  BuildingBlockType,
} from '../types';

interface PersistedComposerData {
  nodes: Node[];
  edges: Edge[];
  nodeConfigs: Record<string, NodeConfig>;
}

const initialState: ComposerState = {
  nodes: [],
  edges: [],
  nodeConfigs: {},
  selectedNodeId: null,
  isLoading: false,
  history: [],
  historyIndex: -1,
};

const MAX_HISTORY = 50;

function generateNodeId(): string {
  return crypto.randomUUID();
}

// Save a snapshot for undo/redo (call before mutating)
function pushHistory(state: ComposerState) {
  const snapshot = {
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    edges: JSON.parse(JSON.stringify(state.edges)),
    nodeConfigs: JSON.parse(JSON.stringify(state.nodeConfigs)),
  };
  // Truncate any forward history
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snapshot);
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
  }
  state.historyIndex = state.history.length - 1;
}

// Derive connection type from handle IDs
function getEdgeType(sourceHandle?: string | null, targetHandle?: string | null): string {
  if (targetHandle === HANDLE_IDS.VOLUME || sourceHandle === HANDLE_IDS.LINK) {
    if (targetHandle === HANDLE_IDS.VOLUME) return 'volume';
    if (targetHandle === HANDLE_IDS.NETWORK) return 'network';
    if (targetHandle === HANDLE_IDS.ENV) return 'env';
  }
  if (sourceHandle === HANDLE_IDS.DEPENDS_OUT || targetHandle === HANDLE_IDS.DEPENDS_IN) {
    return 'depends';
  }
  return 'default';
}

// Build node data with config summaries for display on the node card
function buildNodeData(config: NodeConfig) {
  const base = { label: config.name, serviceType: config.type };
  if (config.type === 'service') {
    const sc = config as ServiceConfig;
    return {
      ...base,
      image: sc.image,
      portCount: sc.ports.filter((p) => p.host && p.container).length,
      envCount: sc.environment.filter((e) => e.key).length,
      volCount: sc.volumes.filter((v) => v.host && v.container).length,
    };
  }
  return base;
}

const composerSlice = createSlice({
  name: 'composer',
  initialState,
  reducers: {
    // ── ReactFlow change handlers (single source of truth) ──────────

    applyNodeChangesAction: (state, action: PayloadAction<NodeChange[]>) => {
      const changes = action.payload;

      const removedIds = changes
        .filter((c): c is NodeChange & { type: 'remove' } => c.type === 'remove')
        .map((c) => c.id);

      // Only push history for structural changes (remove), not drag/select
      if (removedIds.length > 0) {
        pushHistory(state);
      }

      state.nodes = applyNodeChanges(changes, state.nodes) as Node[];

      if (removedIds.length > 0) {
        for (const id of removedIds) {
          delete state.nodeConfigs[id];
        }
        state.edges = state.edges.filter(
          (e) => !removedIds.includes(e.source) && !removedIds.includes(e.target)
        );
        if (state.selectedNodeId && removedIds.includes(state.selectedNodeId)) {
          state.selectedNodeId = null;
        }
      }
    },

    applyEdgeChangesAction: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, state.edges) as Edge[];
    },

    addConnection: (state, action: PayloadAction<Connection>) => {
      const conn = action.payload;
      const edgeType = getEdgeType(conn.sourceHandle, conn.targetHandle);
      const color = EDGE_COLORS[edgeType] ?? EDGE_COLORS.default;

      // Validate: only allow valid connection types
      const sourceConfig = state.nodeConfigs[conn.source!];
      const targetConfig = state.nodeConfigs[conn.target!];
      if (!sourceConfig || !targetConfig) return;

      // Volume link → must connect to volume handle
      if (sourceConfig.type === 'volume' && conn.targetHandle !== HANDLE_IDS.VOLUME) return;
      if (sourceConfig.type === 'network' && conn.targetHandle !== HANDLE_IDS.NETWORK) return;
      if (sourceConfig.type === 'environment' && conn.targetHandle !== HANDLE_IDS.ENV) return;

      // Prevent duplicate connections
      const exists = state.edges.some(
        (e) => e.source === conn.source && e.target === conn.target
          && e.sourceHandle === conn.sourceHandle && e.targetHandle === conn.targetHandle
      );
      if (exists) return;

      pushHistory(state);

      const newEdge: Edge = {
        ...conn,
        id: `e-${conn.source}-${conn.sourceHandle}-${conn.target}-${conn.targetHandle}`,
        animated: edgeType === 'depends',
        type: 'smoothstep',
        style: { stroke: color, strokeWidth: 2 },
        data: { edgeType },
      } as Edge;
      state.edges = addEdge(newEdge, state.edges) as Edge[];
    },

    // ── Node CRUD ───────────────────────────────────────────────────

    addNode: (
      state,
      action: PayloadAction<{ blockType: BuildingBlockType; position: { x: number; y: number }; template?: Partial<ServiceConfig> }>
    ) => {
      const { blockType, position, template } = action.payload;
      const id = generateNodeId();

      pushHistory(state);

      let config: NodeConfig;

      switch (blockType) {
        case 'service':
          config = {
            id,
            type: 'service',
            name: template?.name ?? 'my-service',
            image: template?.image ?? 'nginx:alpine',
            ports: template?.ports ?? [],
            environment: template?.environment ?? [],
            volumes: template?.volumes ?? [],
            networks: [],
            command: template?.command,
            restart: template?.restart ?? 'unless-stopped',
          } satisfies ServiceConfig;
          break;
        case 'volume':
          config = {
            id,
            type: 'volume',
            name: 'my-volume',
            driver: 'local',
          } satisfies VolumeConfig;
          break;
        case 'network':
          config = {
            id,
            type: 'network',
            name: 'my-network',
            driver: 'bridge',
          } satisfies NetworkConfig;
          break;
        case 'environment':
          config = {
            id,
            type: 'environment',
            name: 'my-env',
            variables: [],
          } satisfies EnvironmentConfig;
          break;
        default:
          return;
      }

      const newNode: Node = {
        id,
        type: blockType,
        position,
        data: buildNodeData(config),
      };

      state.nodes.push(newNode);
      state.nodeConfigs[id] = config;
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      pushHistory(state);
      state.nodes = state.nodes.filter((n) => n.id !== nodeId);
      state.edges = state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      );
      delete state.nodeConfigs[nodeId];
      if (state.selectedNodeId === nodeId) {
        state.selectedNodeId = null;
      }
    },

    updateNodeConfig: (
      state,
      action: PayloadAction<{ nodeId: string; config: Partial<NodeConfig> }>
    ) => {
      const { nodeId, config } = action.payload;
      const existing = state.nodeConfigs[nodeId];
      if (!existing) return;

      pushHistory(state);

      state.nodeConfigs[nodeId] = { ...existing, ...config } as NodeConfig;

      // Keep node data in sync with config
      const node = state.nodes.find((n) => n.id === nodeId);
      if (node) {
        node.data = buildNodeData(state.nodeConfigs[nodeId]);
      }
    },

    // ── Selection ───────────────────────────────────────────────────

    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },

    // ── Bulk operations ─────────────────────────────────────────────

    loadProjectData: (state, action: PayloadAction<PersistedComposerData>) => {
      const { nodes: rawNodes, edges, nodeConfigs } = action.payload;

      state.edges = edges ?? [];
      state.nodeConfigs = nodeConfigs ?? {};
      state.selectedNodeId = null;
      state.history = [];
      state.historyIndex = -1;

      const validNodes = (rawNodes ?? []).filter((n) => n && n.id);

      // If nodes array is empty/missing but nodeConfigs has data, reconstruct nodes
      if (validNodes.length === 0 && Object.keys(state.nodeConfigs).length > 0) {
        state.nodes = Object.entries(state.nodeConfigs).map(([id, cfg], i) => ({
          id,
          type: cfg.type,
          position: { x: 100 + (i % 4) * 250, y: 100 + Math.floor(i / 4) * 200 },
          data: buildNodeData(cfg),
        }));
      } else {
        state.nodes = validNodes.map((node, i) => ({
          ...node,
          type: node.type || state.nodeConfigs[node.id]?.type || 'service',
          position: node.position && typeof node.position.x === 'number'
            ? node.position
            : { x: 100 + (i % 4) * 250, y: 100 + Math.floor(i / 4) * 200 },
          data: buildNodeData(state.nodeConfigs[node.id] ?? { type: 'service', name: node.id }),
        }));
      }
    },

    clearComposer: (state) => {
      state.nodes = [];
      state.edges = [];
      state.nodeConfigs = {};
      state.selectedNodeId = null;
    },

    setNodes: (state, action: PayloadAction<Node[]>) => {
      pushHistory(state);
      state.nodes = action.payload;
    },

    undo: (state) => {
      if (state.historyIndex < 0) return;
      const snapshot = state.history[state.historyIndex];
      // Save current state as forward history if at the end
      if (state.historyIndex === state.history.length - 1) {
        state.history.push({
          nodes: JSON.parse(JSON.stringify(state.nodes)),
          edges: JSON.parse(JSON.stringify(state.edges)),
          nodeConfigs: JSON.parse(JSON.stringify(state.nodeConfigs)),
        });
      }
      state.nodes = snapshot.nodes;
      state.edges = snapshot.edges;
      state.nodeConfigs = snapshot.nodeConfigs;
      state.historyIndex -= 1;
    },

    redo: (state) => {
      if (state.historyIndex >= state.history.length - 2) return;
      state.historyIndex += 1;
      const snapshot = state.history[state.historyIndex + 1];
      state.nodes = snapshot.nodes;
      state.edges = snapshot.edges;
      state.nodeConfigs = snapshot.nodeConfigs;
    },
  },
});

export const {
  applyNodeChangesAction,
  applyEdgeChangesAction,
  addConnection,
  addNode,
  deleteNode,
  updateNodeConfig,
  setSelectedNode,
  loadProjectData,
  clearComposer,
  setNodes,
  undo,
  redo,
} = composerSlice.actions;

export default composerSlice.reducer;
