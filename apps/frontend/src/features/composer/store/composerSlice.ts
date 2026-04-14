import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import type {
  ComposerState,
  NodeConfig,
  ServiceConfig,
  VolumeConfig,
  NetworkConfig,
  EnvironmentConfig,
  BuildingBlockType,
} from '../types';

const COMPOSER_DATA_KEY = 'composable_composer_data';

interface PersistedComposerData {
  nodes: Node[];
  edges: Edge[];
  nodeConfigs: Record<string, NodeConfig>;
}

const loadComposerFromStorage = (): PersistedComposerData => {
  try {
    const stored = localStorage.getItem(COMPOSER_DATA_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PersistedComposerData;
      return {
        nodes: parsed.nodes ?? [],
        edges: parsed.edges ?? [],
        nodeConfigs: parsed.nodeConfigs ?? {},
      };
    }
  } catch {
    // Ignore corrupted storage
  }
  return { nodes: [], edges: [], nodeConfigs: {} };
};

const saveToStorage = (state: ComposerState) => {
  const data: PersistedComposerData = {
    nodes: state.nodes,
    edges: state.edges,
    nodeConfigs: state.nodeConfigs,
  };
  localStorage.setItem(COMPOSER_DATA_KEY, JSON.stringify(data));
};

const initialState: ComposerState = {
  ...loadComposerFromStorage(),
  selectedNodeId: null,
  isLoading: false,
};

let nodeCounter = Date.now();

const composerSlice = createSlice({
  name: 'composer',
  initialState,
  reducers: {
    // ── ReactFlow change handlers (single source of truth) ──────────

    applyNodeChangesAction: (state, action: PayloadAction<NodeChange[]>) => {
      const changes = action.payload;

      // Collect IDs of removed nodes before applying
      const removedIds = changes
        .filter((c): c is NodeChange & { type: 'remove' } => c.type === 'remove')
        .map((c) => c.id);

      // Apply positional / selection / dimension changes via ReactFlow utility
      state.nodes = applyNodeChanges(changes, state.nodes) as Node[];

      // Clean up configs and edges for removed nodes
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

      saveToStorage(state);
    },

    applyEdgeChangesAction: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, state.edges) as Edge[];
      saveToStorage(state);
    },

    addConnection: (state, action: PayloadAction<Connection>) => {
      const conn = action.payload;
      const newEdge: Edge = {
        ...conn,
        id: `e-${conn.source}-${conn.target}`,
        animated: true,
        type: 'smoothstep',
        style: { stroke: '#3b82f6' },
      } as Edge;
      state.edges = addEdge(newEdge, state.edges) as Edge[];
      saveToStorage(state);
    },

    // ── Node CRUD ───────────────────────────────────────────────────

    addNode: (
      state,
      action: PayloadAction<{ blockType: BuildingBlockType; position: { x: number; y: number } }>
    ) => {
      const { blockType, position } = action.payload;
      const id = `${blockType}-${++nodeCounter}`;

      const newNode: Node = {
        id,
        type: blockType,
        position,
        data: { label: blockType, serviceType: blockType },
      };

      let config: NodeConfig;

      switch (blockType) {
        case 'service':
          config = {
            id,
            type: 'service',
            name: 'my-service',
            image: 'nginx:alpine',
            ports: [],
            environment: [],
            volumes: [],
            networks: [],
            restart: 'unless-stopped',
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

      state.nodes.push(newNode);
      state.nodeConfigs[id] = config;
      saveToStorage(state);
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter((n) => n.id !== nodeId);
      state.edges = state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      );
      delete state.nodeConfigs[nodeId];
      if (state.selectedNodeId === nodeId) {
        state.selectedNodeId = null;
      }
      saveToStorage(state);
    },

    updateNodeConfig: (
      state,
      action: PayloadAction<{ nodeId: string; config: Partial<NodeConfig> }>
    ) => {
      const { nodeId, config } = action.payload;
      const existing = state.nodeConfigs[nodeId];
      if (!existing) return;

      state.nodeConfigs[nodeId] = { ...existing, ...config } as NodeConfig;

      // Keep the node label in sync with the config name
      if (config.name) {
        const node = state.nodes.find((n) => n.id === nodeId);
        if (node) {
          node.data = { ...node.data, label: config.name };
        }
      }
      saveToStorage(state);
    },

    // ── Selection ───────────────────────────────────────────────────

    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },

    // ── Bulk operations ─────────────────────────────────────────────

    loadProjectData: (state, action: PayloadAction<PersistedComposerData>) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      state.nodeConfigs = action.payload.nodeConfigs;
      state.selectedNodeId = null;
      saveToStorage(state);
    },

    clearComposer: (state) => {
      state.nodes = [];
      state.edges = [];
      state.nodeConfigs = {};
      state.selectedNodeId = null;
      saveToStorage(state);
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
} = composerSlice.actions;

export default composerSlice.reducer;
