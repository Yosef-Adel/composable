import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProjectsState, Project, CreateProjectData } from '../types';

const PROJECTS_STORAGE_KEY = 'composable_projects';

const loadProjectsFromStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState: ProjectsState = {
  projects: loadProjectsFromStorage(),
  currentProjectId: null,
  isLoading: false,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action: PayloadAction<CreateProjectData>) => {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodeCount: 0,
      };
      state.projects.push(newProject);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(state.projects));
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(state.projects));
      if (state.currentProjectId === action.payload) {
        state.currentProjectId = null;
      }
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: string }>) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = {
          ...state.projects[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(state.projects));
      }
    },
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload;
    },
  },
});

export const { createProject, deleteProject, updateProject, setCurrentProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;
