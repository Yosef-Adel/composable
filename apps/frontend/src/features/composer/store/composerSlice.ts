import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from 'reactflow';
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

const loadComposerFromStorage = (): Omit<ComposerState, 'isLoading' | 'selectedNodeId'> => {
  try {
    const stored = localStorage.getItem(COMPOSER_DATA_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          nodes: [],
          edges: [],
          nodeConfigs: {},
        };
  } catch {
    return {
      nodes: [],
      edges: [],
      nodeConfigs: {},
    };
  }
};

const saveToStorage = (state: ComposerState) => {
  localStorage.setItem(
    COMPOSER_DATA_KEY,
    JSON.stringify({
      nodes: state.nodes,
      edges: state.edges,
      nodeConfigs: state.nodeConfigs,
    })
  );
};

const initialState: ComposerState = {
  ...loadComposerFromStorage(),
  selectedNodeId: null,
  isLoading: false,
};

const composerSlice = createSlice({
  name: 'composer',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
      saveToStorage(state);
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
      saveToStorage(state);
    },
    addNode: (
      state,
      action: PayloadAction<{ blockType: BuildingBlockType; position: { x: number; y: number } }>
    ) => {
      const { blockType, position } = action.payload;
      const id = `${blockType}-${Date.now()}`;

      const newNode: Node = {
        id,
        type: 'service',
        position,
        data: {
          label: blockType,
          serviceType: blockType,
        },
      };

      let newConfig: NodeConfig;

      switch (blockType) {
        case 'service':
          newConfig = {
            id,
            type: 'service',
            name: 'my-service',
            image: 'nginx:alpine',
            ports: [],
            environment: [],
            volumes: [],
            networks: [],
            restart: 'unless-stopped',
          } as ServiceConfig;
          break;

        case 'volume':
          newConfig = {
            id,
            type: 'volume',
            name: 'my-volume',
            driver: 'local',
          } as VolumeConfig;
          break;

        case 'network':
          newConfig = {
            id,
            type: 'network',
            name: 'my-network',
            driver: 'bridge',
          } as NetworkConfig;
          break;

        case 'environment':
          newConfig = {
            id,
            type: 'environment',
            name: 'my-env',
            variables: [],
          } as EnvironmentConfig;
          break;

        default:
          return;
      }

      state.nodes.push(newNode);
      state.nodeConfigs[id] = newConfig;
      saveToStorage(state);
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      state.nodes = state.nodes.filter((n) => n.id !== nodeId);
      state.edges = state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
      delete state.nodeConfigs[nodeId];
      if (state.selectedNodeId === nodeId) {
        state.selectedNodeId = null;
      }
      saveToStorage(state);
    },
    updateNodeConfig: (state, action: PayloadAction<{ nodeId: string; config: Partial<NodeConfig> }>) => {
      const { nodeId, config } = action.payload;
      if (state.nodeConfigs[nodeId]) {
        state.nodeConfigs[nodeId] = { ...state.nodeConfigs[nodeId], ...config } as NodeConfig;

        // Update node label when name changes
        if (config.name) {
          const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);
          if (nodeIndex !== -1) {
            state.nodes[nodeIndex].data = {
              ...state.nodes[nodeIndex].data,
              label: config.name,
            };
          }
        }
        saveToStorage(state);
      }
    },
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
      // Don't save selectedNodeId to storage (it's UI state only)
    },
    loadProjectData: (
      state,
      action: PayloadAction<{
        nodes: Node[];
        edges: Edge[];
        nodeConfigs: Record<string, NodeConfig>;
      }>
    ) => {
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
  setNodes,
  setEdges,
  addNode,
  deleteNode,
  updateNodeConfig,
  setSelectedNode,
  loadProjectData,
  clearComposer,
} = composerSlice.actions;

export default composerSlice.reducer;
