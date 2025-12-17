export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
}

export interface ProjectsState {
  projects: Project[];
  currentProjectId: string | null;
  isLoading: boolean;
}

export interface CreateProjectData {
  name: string;
  description: string;
}
