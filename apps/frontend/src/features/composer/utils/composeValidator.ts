import type { NodeConfig, ServiceConfig, VolumeConfig, NetworkConfig } from '../types';
import type { Edge } from 'reactflow';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  severity: ValidationSeverity;
  message: string;
  nodeId?: string;
  field?: string;
}

export function validateCompose(
  nodeConfigs: Record<string, NodeConfig>,
  edges: Edge[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const configs = Object.values(nodeConfigs);
  const services = configs.filter((c): c is ServiceConfig => c.type === 'service');
  const volumes = configs.filter((c): c is VolumeConfig => c.type === 'volume');
  const networks = configs.filter((c): c is NetworkConfig => c.type === 'network');

  // ── Service-level validations ─────────────────────────────────
  for (const svc of services) {
    // Must have an image
    if (!svc.image?.trim()) {
      issues.push({
        severity: 'error',
        message: `Service "${svc.name}" has no image specified`,
        nodeId: svc.id,
        field: 'image',
      });
    }

    // Service name should be valid for Docker
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(svc.name)) {
      issues.push({
        severity: 'warning',
        message: `Service name "${svc.name}" contains invalid characters — must match [a-zA-Z0-9_.-] and start with alphanumeric`,
        nodeId: svc.id,
        field: 'name',
      });
    }

    // Check for duplicate service names
    const dupes = services.filter((s) => s.name === svc.name && s.id !== svc.id);
    if (dupes.length > 0) {
      issues.push({
        severity: 'error',
        message: `Duplicate service name "${svc.name}"`,
        nodeId: svc.id,
        field: 'name',
      });
    }

    // Port validation
    const hostPorts = new Map<string, string>();
    for (const port of svc.ports) {
      if (!port.host || !port.container) continue;

      // Port format
      if (!/^\d+$/.test(port.host) || !/^\d+$/.test(port.container)) {
        issues.push({
          severity: 'error',
          message: `Service "${svc.name}" has invalid port mapping "${port.host}:${port.container}"`,
          nodeId: svc.id,
          field: 'ports',
        });
        continue;
      }

      const hostNum = parseInt(port.host, 10);
      const containerNum = parseInt(port.container, 10);

      if (hostNum < 1 || hostNum > 65535 || containerNum < 1 || containerNum > 65535) {
        issues.push({
          severity: 'error',
          message: `Service "${svc.name}" port ${port.host}:${port.container} is out of range (1-65535)`,
          nodeId: svc.id,
          field: 'ports',
        });
      }

      // Check intra-service host port duplicates
      if (hostPorts.has(port.host)) {
        issues.push({
          severity: 'error',
          message: `Service "${svc.name}" has duplicate host port ${port.host}`,
          nodeId: svc.id,
          field: 'ports',
        });
      }
      hostPorts.set(port.host, svc.id);
    }

    // Env var validation
    for (const env of svc.environment) {
      if (env.key && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(env.key)) {
        issues.push({
          severity: 'warning',
          message: `Service "${svc.name}" env var "${env.key}" contains invalid characters — keys must match [A-Za-z_][A-Za-z0-9_]*`,
          nodeId: svc.id,
          field: 'environment',
        });
      }
    }

    // Volume path validation
    for (const vol of svc.volumes) {
      if (vol.container && !vol.container.startsWith('/')) {
        issues.push({
          severity: 'warning',
          message: `Service "${svc.name}" volume container path "${vol.container}" should start with /`,
          nodeId: svc.id,
          field: 'volumes',
        });
      }
    }

    // Restart policy validation
    const validRestartPolicies = ['no', 'always', 'on-failure', 'unless-stopped'];
    if (svc.restart && !validRestartPolicies.includes(svc.restart)) {
      issues.push({
        severity: 'warning',
        message: `Service "${svc.name}" has invalid restart policy "${svc.restart}" — must be one of: ${validRestartPolicies.join(', ')}`,
        nodeId: svc.id,
        field: 'restart',
      });
    }

    // Referenced networks exist
    for (const netName of svc.networks) {
      const exists = networks.some((n) => n.name === netName);
      if (!exists) {
        issues.push({
          severity: 'warning',
          message: `Service "${svc.name}" references network "${netName}" which is not defined`,
          nodeId: svc.id,
          field: 'networks',
        });
      }
    }

    // Volume references via edges
    const volumeEdges = edges.filter(
      (e) =>
        (e.source === svc.id || e.target === svc.id) &&
        (e.data?.edgeType === 'volume' || e.sourceHandle === 'volume-out' || e.targetHandle === 'volume-in'),
    );
    for (const ve of volumeEdges) {
      const volNodeId = ve.source === svc.id ? ve.target : ve.source;
      const volExists = volumes.some((v) => v.id === volNodeId);
      if (!volExists) {
        issues.push({
          severity: 'error',
          message: `Service "${svc.name}" references a volume node that does not exist`,
          nodeId: svc.id,
          field: 'volumes',
        });
      }
    }

    // Network references via edges
    const networkEdges = edges.filter(
      (e) =>
        (e.source === svc.id || e.target === svc.id) &&
        (e.data?.edgeType === 'network' || e.sourceHandle === 'network-out' || e.targetHandle === 'network-in'),
    );
    for (const ne of networkEdges) {
      const netNodeId = ne.source === svc.id ? ne.target : ne.source;
      const netExists = networks.some((n) => n.id === netNodeId);
      if (!netExists) {
        issues.push({
          severity: 'error',
          message: `Service "${svc.name}" references a network node that does not exist`,
          nodeId: svc.id,
          field: 'networks',
        });
      }
    }
  }

  // ── Cross-service port conflict ───────────────────────────────
  const globalHostPorts = new Map<string, string>();
  for (const svc of services) {
    for (const port of svc.ports) {
      if (!port.host) continue;
      const existing = globalHostPorts.get(port.host);
      if (existing && existing !== svc.id) {
        const otherSvc = services.find((s) => s.id === existing);
        issues.push({
          severity: 'error',
          message: `Host port ${port.host} is used by both "${svc.name}" and "${otherSvc?.name ?? 'unknown'}"`,
          nodeId: svc.id,
          field: 'ports',
        });
      }
      globalHostPorts.set(port.host, svc.id);
    }
  }

  // ── Volume/Network name validation ────────────────────────────
  for (const vol of volumes) {
    if (!/^[a-z][a-z0-9_-]*$/.test(vol.name)) {
      issues.push({
        severity: 'warning',
        message: `Volume name "${vol.name}" should be lowercase and contain only [a-z0-9_-]`,
        nodeId: vol.id,
        field: 'name',
      });
    }
  }

  for (const net of networks) {
    if (!/^[a-z][a-z0-9_-]*$/.test(net.name)) {
      issues.push({
        severity: 'warning',
        message: `Network name "${net.name}" should be lowercase and contain only [a-z0-9_-]`,
        nodeId: net.id,
        field: 'name',
      });
    }
  }

  // ── Orphan check ──────────────────────────────────────────────
  const connectedNodes = new Set<string>();
  for (const edge of edges) {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  }

  for (const vol of volumes) {
    if (!connectedNodes.has(vol.id)) {
      issues.push({
        severity: 'info',
        message: `Volume "${vol.name}" is not connected to any service`,
        nodeId: vol.id,
      });
    }
  }

  for (const net of networks) {
    if (!connectedNodes.has(net.id)) {
      issues.push({
        severity: 'info',
        message: `Network "${net.name}" is not connected to any service`,
        nodeId: net.id,
      });
    }
  }

  // ── Empty compose ─────────────────────────────────────────────
  if (services.length === 0) {
    issues.push({
      severity: 'warning',
      message: 'No services defined — compose file will be empty',
    });
  }

  // ── Circular dependency check ─────────────────────────────────
  const dependsEdges = edges.filter(
    (e) => e.data?.edgeType === 'depends' || e.sourceHandle === 'depends-out',
  );
  if (dependsEdges.length > 0) {
    const visited = new Set<string>();
    const stack = new Set<string>();

    function hasCycle(nodeId: string): boolean {
      if (stack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      visited.add(nodeId);
      stack.add(nodeId);

      const children = dependsEdges.filter((e) => e.source === nodeId).map((e) => e.target);
      for (const child of children) {
        if (hasCycle(child)) return true;
      }

      stack.delete(nodeId);
      return false;
    }

    const serviceIds = services.map((s) => s.id);
    for (const id of serviceIds) {
      if (hasCycle(id)) {
        issues.push({
          severity: 'error',
          message: 'Circular dependency detected in depends_on chain',
        });
        break;
      }
    }
  }

  return issues;
}
