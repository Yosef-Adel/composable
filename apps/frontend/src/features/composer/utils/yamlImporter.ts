import { parse } from 'yaml';
import type { Node, Edge } from 'reactflow';
import type { NodeConfig, ServiceConfig, VolumeConfig, NetworkConfig } from '../types';
import { HANDLE_IDS, EDGE_COLORS } from '../components/ServiceNode';

interface ParsedCompose {
  nodes: Node[];
  edges: Edge[];
  nodeConfigs: Record<string, NodeConfig>;
}

export function parseDockerCompose(yamlString: string): ParsedCompose {
  const doc = parse(yamlString) as Record<string, any>;
  if (!doc || typeof doc !== 'object') {
    throw new Error('Invalid docker-compose.yml format');
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeConfigs: Record<string, NodeConfig> = {};

  let y = 100;
  const X_SPACING = 300;
  const Y_SPACING = 200;
  const PER_ROW = 3;
  let idx = 0;

  function nextPosition() {
    const pos = { x: 100 + (idx % PER_ROW) * X_SPACING, y: 100 + Math.floor(idx / PER_ROW) * Y_SPACING };
    idx++;
    return pos;
  }

  const serviceNameToId = new Map<string, string>();
  const volumeNameToId = new Map<string, string>();
  const networkNameToId = new Map<string, string>();

  // ── Parse volumes ─────────────────────────────────────────────
  if (doc.volumes && typeof doc.volumes === 'object') {
    for (const [name, cfg] of Object.entries(doc.volumes)) {
      const id = crypto.randomUUID();
      const config: VolumeConfig = {
        id,
        type: 'volume',
        name,
        driver: (cfg as any)?.driver || 'local',
      };
      volumeNameToId.set(name, id);
      nodeConfigs[id] = config;
      nodes.push({
        id,
        type: 'volume',
        position: { x: 0, y: y },
        data: { label: name, serviceType: 'volume' },
      });
      y += 80;
    }
  }

  // ── Parse networks ────────────────────────────────────────────
  y = 100;
  if (doc.networks && typeof doc.networks === 'object') {
    for (const [name, cfg] of Object.entries(doc.networks)) {
      const id = crypto.randomUUID();
      const config: NetworkConfig = {
        id,
        type: 'network',
        name,
        driver: (cfg as any)?.driver || 'bridge',
      };
      networkNameToId.set(name, id);
      nodeConfigs[id] = config;
      nodes.push({
        id,
        type: 'network',
        position: { x: 0, y: y + 400 },
        data: { label: name, serviceType: 'network' },
      });
      y += 80;
    }
  }

  // ── Parse services ────────────────────────────────────────────
  idx = 0;
  if (doc.services && typeof doc.services === 'object') {
    for (const [name, svcDef] of Object.entries(doc.services)) {
      const id = crypto.randomUUID();
      const svc = svcDef as Record<string, any>;
      serviceNameToId.set(name, id);

      // Parse ports
      const ports: Array<{ host: string; container: string }> = [];
      if (Array.isArray(svc.ports)) {
        for (const p of svc.ports) {
          const parts = String(p).replace(/"/g, '').split(':');
          if (parts.length >= 2) {
            ports.push({ host: parts[0], container: parts[1] });
          }
        }
      }

      // Parse environment
      const environment: Array<{ key: string; value: string }> = [];
      if (Array.isArray(svc.environment)) {
        for (const e of svc.environment) {
          const eq = String(e).indexOf('=');
          if (eq > 0) {
            environment.push({ key: e.substring(0, eq), value: e.substring(eq + 1) });
          }
        }
      } else if (svc.environment && typeof svc.environment === 'object') {
        for (const [k, v] of Object.entries(svc.environment)) {
          environment.push({ key: k, value: String(v).replace(/^"|"$/g, '') });
        }
      }

      // Parse inline volumes
      const volumes: Array<{ host: string; container: string }> = [];
      const connectedVolumeNames: string[] = [];
      if (Array.isArray(svc.volumes)) {
        for (const v of svc.volumes) {
          const parts = String(v).split(':');
          if (parts.length >= 2) {
            // Check if it's a named volume reference
            if (volumeNameToId.has(parts[0]) || doc.volumes?.[parts[0]]) {
              connectedVolumeNames.push(parts[0]);
            } else {
              volumes.push({ host: parts[0], container: parts[1] });
            }
          }
        }
      }

      // Parse network references
      const connectedNetworkNames: string[] = [];
      const networks: string[] = [];
      if (Array.isArray(svc.networks)) {
        for (const n of svc.networks) {
          if (networkNameToId.has(n)) {
            connectedNetworkNames.push(n);
          } else {
            networks.push(n);
          }
        }
      }

      const config: ServiceConfig = {
        id,
        type: 'service',
        name,
        image: svc.image || '',
        ports,
        environment,
        volumes,
        networks,
        command: svc.command,
        restart: svc.restart,
      };

      nodeConfigs[id] = config;
      nodes.push({
        id,
        type: 'service',
        position: nextPosition(),
        data: {
          label: name,
          serviceType: 'service',
          image: svc.image,
          portCount: ports.length,
          envCount: environment.length,
          volCount: volumes.length + connectedVolumeNames.length,
        },
      });

      // Create edges for volume connections
      for (const volName of connectedVolumeNames) {
        const volId = volumeNameToId.get(volName);
        if (volId) {
          edges.push({
            id: `e-${volId}-link-${id}-volume`,
            source: volId,
            target: id,
            sourceHandle: HANDLE_IDS.LINK,
            targetHandle: HANDLE_IDS.VOLUME,
            type: 'smoothstep',
            animated: false,
            style: { stroke: EDGE_COLORS.volume, strokeWidth: 2 },
            data: { edgeType: 'volume' },
          });
        }
      }

      // Create edges for network connections
      for (const netName of connectedNetworkNames) {
        const netId = networkNameToId.get(netName);
        if (netId) {
          edges.push({
            id: `e-${netId}-link-${id}-network`,
            source: netId,
            target: id,
            sourceHandle: HANDLE_IDS.LINK,
            targetHandle: HANDLE_IDS.NETWORK,
            type: 'smoothstep',
            animated: false,
            style: { stroke: EDGE_COLORS.network, strokeWidth: 2 },
            data: { edgeType: 'network' },
          });
        }
      }
    }
  }

  // ── Parse depends_on ──────────────────────────────────────────
  if (doc.services) {
    for (const [name, svcDef] of Object.entries(doc.services)) {
      const svc = svcDef as Record<string, any>;
      const sourceId = serviceNameToId.get(name);
      if (!sourceId) continue;

      let deps: string[] = [];
      if (Array.isArray(svc.depends_on)) {
        deps = svc.depends_on;
      } else if (svc.depends_on && typeof svc.depends_on === 'object') {
        deps = Object.keys(svc.depends_on);
      }

      for (const dep of deps) {
        const targetId = serviceNameToId.get(dep);
        if (targetId) {
          edges.push({
            id: `e-${sourceId}-depends-out-${targetId}-depends-in`,
            source: sourceId,
            target: targetId,
            sourceHandle: HANDLE_IDS.DEPENDS_OUT,
            targetHandle: HANDLE_IDS.DEPENDS_IN,
            type: 'smoothstep',
            animated: true,
            style: { stroke: EDGE_COLORS.depends, strokeWidth: 2 },
            data: { edgeType: 'depends' },
          });
        }
      }
    }
  }

  return { nodes, edges, nodeConfigs };
}
