import type { NodeConfig, ServiceConfig, VolumeConfig, NetworkConfig, EnvironmentConfig } from '../types';
import type { Edge } from 'reactflow';

function quoteYamlValue(value: string): string {
  if (/[:{}\[\],&*?|>!%@`#'"\n]/.test(value) || value.trim() !== value || value === '') {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

export function generateYaml(nodeConfigs: Record<string, NodeConfig>, edges: Edge[]): string {
  const services: Record<string, Record<string, unknown>> = {};
  const volumes: Record<string, Record<string, unknown>> = {};
  const networks: Record<string, Record<string, unknown>> = {};

  const configById = new Map(Object.entries(nodeConfigs));

  // Build typed adjacency from edges using handle IDs
  // For each service node, collect what's connected to each handle type
  const volumeConnections = new Map<string, string[]>(); // serviceId → volumeNodeIds
  const networkConnections = new Map<string, string[]>();
  const envConnections = new Map<string, string[]>();
  const dependsOnConnections = new Map<string, string[]>(); // serviceId → target serviceIds

  for (const edge of edges) {
    const edgeType = edge.data?.edgeType;

    if (edgeType === 'volume' || edge.targetHandle === 'volume') {
      const list = volumeConnections.get(edge.target) ?? [];
      list.push(edge.source);
      volumeConnections.set(edge.target, list);
    } else if (edgeType === 'network' || edge.targetHandle === 'network') {
      const list = networkConnections.get(edge.target) ?? [];
      list.push(edge.source);
      networkConnections.set(edge.target, list);
    } else if (edgeType === 'env' || edge.targetHandle === 'env') {
      const list = envConnections.get(edge.target) ?? [];
      list.push(edge.source);
      envConnections.set(edge.target, list);
    } else if (edgeType === 'depends' || edge.sourceHandle === 'depends-out') {
      const list = dependsOnConnections.get(edge.source) ?? [];
      list.push(edge.target);
      dependsOnConnections.set(edge.source, list);
    } else {
      // Legacy edges without handle types — use bidirectional detection
      const sourceConfig = configById.get(edge.source);
      const targetConfig = configById.get(edge.target);
      if (sourceConfig && targetConfig) {
        if (sourceConfig.type === 'volume' && targetConfig.type === 'service') {
          const list = volumeConnections.get(edge.target) ?? [];
          list.push(edge.source);
          volumeConnections.set(edge.target, list);
        } else if (sourceConfig.type === 'network' && targetConfig.type === 'service') {
          const list = networkConnections.get(edge.target) ?? [];
          list.push(edge.source);
          networkConnections.set(edge.target, list);
        } else if (sourceConfig.type === 'environment' && targetConfig.type === 'service') {
          const list = envConnections.get(edge.target) ?? [];
          list.push(edge.source);
          envConnections.set(edge.target, list);
        } else if (sourceConfig.type === 'service' && targetConfig.type === 'service') {
          const list = dependsOnConnections.get(edge.source) ?? [];
          list.push(edge.target);
          dependsOnConnections.set(edge.source, list);
        }
        // Also handle reverse direction for legacy edges
        if (targetConfig.type === 'volume' && sourceConfig.type === 'service') {
          const list = volumeConnections.get(edge.source) ?? [];
          list.push(edge.target);
          volumeConnections.set(edge.source, list);
        } else if (targetConfig.type === 'network' && sourceConfig.type === 'service') {
          const list = networkConnections.get(edge.source) ?? [];
          list.push(edge.target);
          networkConnections.set(edge.source, list);
        } else if (targetConfig.type === 'environment' && sourceConfig.type === 'service') {
          const list = envConnections.get(edge.source) ?? [];
          list.push(edge.target);
          envConnections.set(edge.source, list);
        }
      }
    }
  }

  // First pass: collect volumes and networks
  for (const config of Object.values(nodeConfigs)) {
    if (config.type === 'volume') {
      const vc = config as VolumeConfig;
      volumes[vc.name] = { driver: vc.driver || 'local' };
    } else if (config.type === 'network') {
      const nc = config as NetworkConfig;
      networks[nc.name] = { driver: nc.driver || 'bridge' };
    }
  }

  // Second pass: build services
  for (const config of Object.values(nodeConfigs)) {
    if (config.type !== 'service') continue;
    const sc = config as ServiceConfig;

    const svc: Record<string, unknown> = {};
    if (sc.image) svc.image = sc.image;

    if (sc.ports.length > 0) {
      svc.ports = sc.ports
        .filter((p) => p.host && p.container)
        .map((p) => quoteYamlValue(`${p.host}:${p.container}`));
    }

    const envMap: Record<string, string> = {};
    for (const env of sc.environment) {
      if (env.key) envMap[env.key] = env.value;
    }

    const volumeEntries = [...sc.volumes.filter((v) => v.host && v.container).map((v) => `${v.host}:${v.container}`)];
    const networkEntries = [...sc.networks];
    const dependsOn: string[] = [];

    // Connected volumes
    for (const volId of volumeConnections.get(config.id) ?? []) {
      const vol = configById.get(volId);
      if (vol?.type === 'volume') {
        const mount = `${(vol as VolumeConfig).name}:/data`;
        if (!volumeEntries.includes(mount)) volumeEntries.push(mount);
      }
    }

    // Connected networks
    for (const netId of networkConnections.get(config.id) ?? []) {
      const net = configById.get(netId);
      if (net?.type === 'network') {
        const name = (net as NetworkConfig).name;
        if (!networkEntries.includes(name)) networkEntries.push(name);
      }
    }

    // Connected env groups
    for (const envId of envConnections.get(config.id) ?? []) {
      const envNode = configById.get(envId);
      if (envNode?.type === 'environment') {
        for (const v of (envNode as EnvironmentConfig).variables) {
          if (v.key) envMap[v.key] = v.value;
        }
      }
    }

    // depends_on
    for (const depId of dependsOnConnections.get(config.id) ?? []) {
      const dep = configById.get(depId);
      if (dep?.type === 'service') {
        const name = (dep as ServiceConfig).name;
        if (!dependsOn.includes(name)) dependsOn.push(name);
      }
    }

    if (Object.keys(envMap).length > 0) {
      const quotedEnv: Record<string, string> = {};
      for (const [k, v] of Object.entries(envMap)) {
        quotedEnv[k] = quoteYamlValue(v);
      }
      svc.environment = quotedEnv;
    }
    if (volumeEntries.length > 0) svc.volumes = volumeEntries;
    if (networkEntries.length > 0) svc.networks = networkEntries;
    if (dependsOn.length > 0) svc.depends_on = dependsOn;
    if (sc.restart) svc.restart = sc.restart;
    if (sc.command) svc.command = sc.command;

    services[sc.name] = svc;
  }

  const yamlObject: Record<string, unknown> = {};

  if (Object.keys(services).length > 0) yamlObject.services = services;
  if (Object.keys(volumes).length > 0) yamlObject.volumes = volumes;
  if (Object.keys(networks).length > 0) yamlObject.networks = networks;

  if (Object.keys(yamlObject).length === 0) return '';

  return convertToYamlString(yamlObject);
}

function convertToYamlString(obj: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}:\n`;
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          yaml += `${spaces}  - ${convertToYamlString(item as Record<string, unknown>, indent + 2).trim()}\n`;
        } else {
          yaml += `${spaces}  - ${String(item)}\n`;
        }
      }
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n`;
      yaml += convertToYamlString(value as Record<string, unknown>, indent + 1);
    } else {
      yaml += `${spaces}${key}: ${String(value)}\n`;
    }
  }

  return yaml;
}
