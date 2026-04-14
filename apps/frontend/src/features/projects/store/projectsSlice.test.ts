import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import projectsReducer, {
  fetchProjects,
  createProjectAsync,
  deleteProjectAsync,
  setCurrentProject,
  clearProjectsError,
} from './projectsSlice';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { api } from '@/services/api';

function createStore() {
  return configureStore({
    reducer: { projects: projectsReducer },
  });
}

describe('projectsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProjects', () => {
    it('populates projects on successful fetch', async () => {
      const mockProjects = [
        {
          _id: 'p1',
          name: 'Project 1',
          description: 'Desc 1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
          nodeCount: 3,
        },
      ];

      (api.get as any).mockResolvedValueOnce({
        data: { data: { data: mockProjects, total: 1 } },
      });

      const store = createStore();
      await store.dispatch(fetchProjects());

      const state = store.getState().projects;
      expect(state.projects).toHaveLength(1);
      expect(state.projects[0].id).toBe('p1');
      expect(state.projects[0].name).toBe('Project 1');
      expect(state.total).toBe(1);
      expect(state.isLoading).toBe(false);
    });

    it('sets error on failed fetch', async () => {
      (api.get as any).mockRejectedValueOnce(new Error('Network error'));

      const store = createStore();
      await store.dispatch(fetchProjects());

      const state = store.getState().projects;
      expect(state.error).toBeTruthy();
      expect(state.isLoading).toBe(false);
    });
  });

  describe('createProjectAsync', () => {
    it('adds new project to list', async () => {
      (api.post as any).mockResolvedValueOnce({
        data: {
          data: {
            _id: 'new-1',
            name: 'New Project',
            description: '',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            nodeCount: 0,
          },
        },
      });

      const store = createStore();
      await store.dispatch(
        createProjectAsync({ name: 'New Project', description: '' }),
      );

      const state = store.getState().projects;
      expect(state.projects).toHaveLength(1);
      expect(state.projects[0].name).toBe('New Project');
      expect(state.total).toBe(1);
    });
  });

  describe('deleteProjectAsync', () => {
    it('removes project from list', async () => {
      // First add a project
      (api.post as any).mockResolvedValueOnce({
        data: {
          data: {
            _id: 'del-1',
            name: 'To Delete',
            description: '',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            nodeCount: 0,
          },
        },
      });

      const store = createStore();
      await store.dispatch(
        createProjectAsync({ name: 'To Delete', description: '' }),
      );

      (api.delete as any).mockResolvedValueOnce({});
      await store.dispatch(deleteProjectAsync('del-1'));

      const state = store.getState().projects;
      expect(state.projects).toHaveLength(0);
    });
  });

  describe('reducers', () => {
    it('setCurrentProject sets the current project ID', () => {
      const store = createStore();
      store.dispatch(setCurrentProject('proj-1'));
      expect(store.getState().projects.currentProjectId).toBe('proj-1');
    });

    it('clearProjectsError clears the error', () => {
      const store = createStore();
      store.dispatch(clearProjectsError());
      expect(store.getState().projects.error).toBeNull();
    });
  });
});
