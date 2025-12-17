import type { Node, Edge } from 'reactflow';

export interface ServiceConfig {
  id: string;
  type: 'service';
  name: string;
  image: string;
  ports: Array<{ host: string; container: string }>;
  environment: Array<{ key: string; value: string }>;
  volumes: Array<{ host: string; container: string }>;
  networks: string[];
  command?: string;
  restart?: string;
}

export interface VolumeConfig {
  id: string;
  type: 'volume';
  name: string;
  driver?: string;
}

export interface NetworkConfig {
  id: string;
  type: 'network';
  name: string;
  driver?: string;
}

export interface EnvironmentConfig {
  id: string;
  type: 'environment';
  name: string;
  variables: Array<{ key: string; value: string }>;
}

export type NodeConfig = ServiceConfig | VolumeConfig | NetworkConfig | EnvironmentConfig;

export interface ComposerState {
  nodes: Node[];
  edges: Edge[];
  nodeConfigs: Record<string, NodeConfig>;
  selectedNodeId: string | null;
  isLoading: boolean;
}

export type BuildingBlockType = 'service' | 'volume' | 'network' | 'environment';

export interface BuildingBlock {
  id: BuildingBlockType;
  name: string;
  icon: string;
  color: string;
  description: string;
}
