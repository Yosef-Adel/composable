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

  // Build adjacency: source → target[] from edges (bidirectional)
  const connections = new Map<string, string[]>();
  for (const edge of edges) {
    const list = connections.get(edge.source) ?? [];
    list.push(edge.target);
    connections.set(edge.source, list);

    const rList = connections.get(edge.target) ?? [];
    rList.push(edge.source);
    connections.set(edge.target, rList);
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

  // Second pass: build services with connected resources and depends_on
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

    const neighbors = connections.get(config.id) ?? [];
    for (const neighborId of neighbors) {
      const neighbor = configById.get(neighborId);
      if (!neighbor) continue;

      if (neighbor.type === 'volume') {
        const vn = neighbor as VolumeConfig;
        const mount = `${vn.name}:/data`;
        if (!volumeEntries.includes(mount)) volumeEntries.push(mount);
      } else if (neighbor.type === 'network') {
        const nn = neighbor as NetworkConfig;
        if (!networkEntries.includes(nn.name)) networkEntries.push(nn.name);
      } else if (neighbor.type === 'environment') {
        const en = neighbor as EnvironmentConfig;
        for (const v of en.variables) {
          if (v.key) envMap[v.key] = v.value;
        }
      } else if (neighbor.type === 'service') {
        const sn = neighbor as ServiceConfig;
        // Only add depends_on for outgoing edges (source → target)
        const isOutgoing = edges.some(
          (e) => e.source === config.id && e.target === neighborId,
        );
        if (isOutgoing && !dependsOn.includes(sn.name)) {
          dependsOn.push(sn.name);
        }
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
