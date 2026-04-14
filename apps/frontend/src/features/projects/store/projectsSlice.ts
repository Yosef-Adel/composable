import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { AxiosError } from 'axios';
import type { ProjectsState, Project, CreateProjectData } from '../types';

function mapProject(raw: any): Project {
  return {
    id: raw._id ?? raw.id,
    name: raw.name,
    description: raw.description ?? '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    nodeCount: raw.nodeCount ?? 0,
  };
}

function extractError(error: unknown): string {
  if (error instanceof AxiosError) {
    const msg = error.response?.data?.data?.message ?? error.response?.data?.message;
    return Array.isArray(msg) ? msg[0] : msg ?? 'Request failed';
  }
  return error instanceof Error ? error.message : 'An error occurred';
}

export const fetchProjects = createAsyncThunk<
  { data: Project[]; total: number },
  { page?: number; search?: string; sort?: string } | void,
  { rejectValue: string }
>('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/projects', { params: params ?? {} });
    const payload = data.data;
    return {
      data: payload.data.map(mapProject),
      total: payload.total,
    };
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const createProjectAsync = createAsyncThunk<
  Project,
  CreateProjectData,
  { rejectValue: string }
>('projects/create', async (dto, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/projects', dto);
    return mapProject(data.data);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const updateProjectAsync = createAsyncThunk<
  Project,
  { id: string; name?: string; description?: string },
  { rejectValue: string }
>('projects/update', async ({ id, ...dto }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/projects/${id}`, dto);
    return mapProject(data.data);
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

export const deleteProjectAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/projects/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(extractError(error));
  }
});

const initialState: ProjectsState = {
  projects: [],
  currentProjectId: null,
  isLoading: false,
  error: null,
  total: 0,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProjectId = action.payload;
    },
    clearProjectsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload.data;
        state.total = action.payload.total;
        state.isLoading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch projects';
      })
      // Create
      .addCase(createProjectAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProjectAsync.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
        state.total += 1;
        state.isLoading = false;
      })
      .addCase(createProjectAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to create project';
      })
      // Update
      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.projects[idx] = action.payload;
      })
      // Delete
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
        state.total -= 1;
        if (state.currentProjectId === action.payload) {
          state.currentProjectId = null;
        }
      });
  },
});

export const { setCurrentProject, clearProjectsError } = projectsSlice.actions;
export default projectsSlice.reducer;
