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

    it('adds a service node from template', () => {
      const store = createStore();
      store.dispatch(
        addNode({
          blockType: 'service',
          position: { x: 0, y: 0 },
          template: {
            name: 'postgres',
            image: 'postgres:16-alpine',
            ports: [{ host: '5432', container: '5432' }],
            environment: [{ key: 'POSTGRES_DB', value: 'app' }],
          },
        }),
      );

      const state = store.getState().composer;
      const nodeId = state.nodes[0].id;
      const config = state.nodeConfigs[nodeId] as any;
      expect(config.name).toBe('postgres');
      expect(config.image).toBe('postgres:16-alpine');
      expect(config.ports).toHaveLength(1);
      expect(config.environment).toHaveLength(1);
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
    it('connects a volume node to a service volume handle', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );
      store.dispatch(
        addNode({ blockType: 'volume', position: { x: 200, y: 0 } }),
      );

      const state = store.getState().composer;
      const serviceId = state.nodes.find((n) => n.type === 'service')!.id;
      const volumeId = state.nodes.find((n) => n.type === 'volume')!.id;

      store.dispatch(
        addConnection({ source: volumeId, target: serviceId, sourceHandle: 'link', targetHandle: 'volume' }),
      );

      const updatedState = store.getState().composer;
      expect(updatedState.edges).toHaveLength(1);
      expect(updatedState.edges[0].data?.edgeType).toBe('volume');
    });

    it('rejects invalid connection (volume to network handle)', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );
      store.dispatch(
        addNode({ blockType: 'volume', position: { x: 200, y: 0 } }),
      );

      const state = store.getState().composer;
      const serviceId = state.nodes.find((n) => n.type === 'service')!.id;
      const volumeId = state.nodes.find((n) => n.type === 'volume')!.id;

      store.dispatch(
        addConnection({ source: volumeId, target: serviceId, sourceHandle: 'link', targetHandle: 'network' }),
      );

      expect(store.getState().composer.edges).toHaveLength(0);
    });

    it('connects two services via depends_on', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 200, y: 0 } }),
      );

      const state = store.getState().composer;
      const [s1, s2] = state.nodes;

      store.dispatch(
        addConnection({ source: s1.id, target: s2.id, sourceHandle: 'depends-out', targetHandle: 'depends-in' }),
      );

      const updatedState = store.getState().composer;
      expect(updatedState.edges).toHaveLength(1);
      expect(updatedState.edges[0].data?.edgeType).toBe('depends');
      expect(updatedState.edges[0].animated).toBe(true);
    });

    it('prevents duplicate connections', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );
      store.dispatch(
        addNode({ blockType: 'network', position: { x: 200, y: 0 } }),
      );

      const state = store.getState().composer;
      const serviceId = state.nodes.find((n) => n.type === 'service')!.id;
      const networkId = state.nodes.find((n) => n.type === 'network')!.id;
      const conn = { source: networkId, target: serviceId, sourceHandle: 'link', targetHandle: 'network' };

      store.dispatch(addConnection(conn));
      store.dispatch(addConnection(conn));

      expect(store.getState().composer.edges).toHaveLength(1);
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
    it('updates config and syncs node display data', () => {
      const store = createStore();
      store.dispatch(
        addNode({ blockType: 'service', position: { x: 0, y: 0 } }),
      );

      const nodeId = store.getState().composer.nodes[0].id;
      store.dispatch(
        updateNodeConfig({
          nodeId,
          config: { image: 'nginx:latest', name: 'web' },
        }),
      );

      const config = store.getState().composer.nodeConfigs[nodeId];
      expect(config.type).toBe('service');
      expect((config as any).image).toBe('nginx:latest');

      // Node data should be updated too
      const node = store.getState().composer.nodes[0];
      expect(node.data.label).toBe('web');
      expect(node.data.image).toBe('nginx:latest');
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

      const state = store.getState().composer;
      const serviceId = state.nodes.find((n) => n.type === 'service')!.id;
      const volumeId = state.nodes.find((n) => n.type === 'volume')!.id;

      store.dispatch(
        addConnection({ source: volumeId, target: serviceId, sourceHandle: 'link', targetHandle: 'volume' }),
      );
      expect(store.getState().composer.edges).toHaveLength(1);

      // Delete the service node
      store.dispatch(
        applyNodeChangesAction([{ type: 'remove', id: serviceId }]),
      );

      const finalState = store.getState().composer;
      expect(finalState.nodes).toHaveLength(1);
      expect(finalState.nodes[0].id).toBe(volumeId);
      expect(finalState.edges).toHaveLength(0);
      expect(finalState.nodeConfigs[serviceId]).toBeUndefined();
    });
  });
});
