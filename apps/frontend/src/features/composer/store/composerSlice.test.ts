import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import composerReducer from './composerSlice';
import {
  addNode,
  addConnection,
  setSelectedNode,
  updateNodeConfig,
  loadProjectData,
  clearComposer,
  applyNodeChangesAction,
  applyEdgeChangesAction,
} from './composerSlice';

function createStore(preloadedState?: any) {
  return configureStore({
    reducer: { composer: composerReducer },
    preloadedState: preloadedState
      ? { composer: preloadedState }
      : undefined,
  });
}

describe('composerSlice', () => {
  describe('addNode', () => {
    it('adds a service node with default config', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 100, y: 200 } }),
      );

      const state = store.getState().composer;
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].type).toBe('service');
      expect(state.nodes[0].position).toEqual({ x: 100, y: 200 });

      const nodeId = state.nodes[0].id;
      expect(state.nodeConfigs[nodeId]).toBeDefined();
      expect(state.nodeConfigs[nodeId].type).toBe('service');
    });

    it('adds a volume node', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'volume', position: { x: 0, y: 0 } }),
      );

      const state = store.getState().composer;
      expect(state.nodes).toHaveLength(1);
      expect(state.nodeConfigs[state.nodes[0].id].type).toBe('volume');
    });

    it('adds a network node', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'network', position: { x: 0, y: 0 } }),
      );

      const state = store.getState().composer;
      expect(state.nodeConfigs[state.nodes[0].id].type).toBe('network');
    });

    it('adds an environment node', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'environment', position: { x: 0, y: 0 } }),
      );

      const state = store.getState().composer;
      expect(state.nodeConfigs[state.nodes[0].id].type).toBe('environment');
    });
  });

  describe('addConnection', () => {
    it('adds an edge between two nodes', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );
      store.dispatch(
        addNode({ blockType: 'volume', position: { x: 200, y: 0 } }),
      );

      const state = store.getState().composer;
      const [n1, n2] = state.nodes;

      store.dispatch(
        addConnection({ source: n1.id, target: n2.id, sourceHandle: null, targetHandle: null }),
      );

      const updatedState = store.getState().composer;
      expect(updatedState.edges).toHaveLength(1);
      expect(updatedState.edges[0].source).toBe(n1.id);
      expect(updatedState.edges[0].target).toBe(n2.id);
    });
  });

  describe('setSelectedNode', () => {
    it('sets and clears selected node', () => {
      const store = createStore();
      store.dispatch(setSelectedNode('node-1'));
      expect(store.getState().composer.selectedNodeId).toBe('node-1');

      store.dispatch(setSelectedNode(null));
      expect(store.getState().composer.selectedNodeId).toBeNull();
    });
  });

  describe('updateNodeConfig', () => {
    it('updates config for an existing node', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );

      const nodeId = store.getState().composer.nodes[0].id;
      store.dispatch(
        updateNodeConfig({
          nodeId,
          config: { image: 'nginx:latest' },
        }),
      );

      const config = store.getState().composer.nodeConfigs[nodeId];
      expect(config.type).toBe('service');
      expect((config as any).image).toBe('nginx:latest');
    });
  });

  describe('loadProjectData', () => {
    it('replaces entire composer state with loaded data', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );

      const projectData = {
        nodes: [
          { id: 'loaded-1', type: 'service', position: { x: 50, y: 50 }, data: { label: 'loaded' } },
        ],
        edges: [],
        nodeConfigs: {
          'loaded-1': { id: 'loaded-1', type: 'service' as const, name: 'loaded', image: 'test', ports: [], environment: [], volumes: [], networks: [] },
        },
      };

      store.dispatch(loadProjectData(projectData));

      const state = store.getState().composer;
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].id).toBe('loaded-1');
      expect(state.nodeConfigs['loaded-1'].name).toBe('loaded');
    });
  });

  describe('clearComposer', () => {
    it('resets composer to empty state', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );
      store.dispatch(clearComposer());

      const state = store.getState().composer;
      expect(state.nodes).toHaveLength(0);
      expect(state.edges).toHaveLength(0);
      expect(Object.keys(state.nodeConfigs)).toHaveLength(0);
      expect(state.selectedNodeId).toBeNull();
    });
  });

  describe('applyNodeChangesAction (delete)', () => {
    it('removes node, its config, and connected edges', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );
      store.dispatch(
        addNode({ blockType: 'volume', position: { x: 200, y: 0 } }),
      );

      const [n1, n2] = store.getState().composer.nodes;
      store.dispatch(
        addConnection({ source: n1.id, target: n2.id, sourceHandle: null, targetHandle: null }),
      );

      // Delete the first node
      store.dispatch(
        applyNodeChangesAction([{ type: 'remove', id: n1.id }]),
      );

      const state = store.getState().composer;
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].id).toBe(n2.id);
      expect(state.edges).toHaveLength(0);
      expect(state.nodeConfigs[n1.id]).toBeUndefined();
    });
  });
});
