import type { NodeConfig, ServiceConfig, VolumeConfig, NetworkConfig, EnvironmentConfig } from '../types';
import type { Edge } from 'reactflow';

export function generateDocs(
  nodeConfigs: Record<string, NodeConfig>,
  edges: Edge[],
  projectName = 'Composable Project',
): string {
  const configs = Object.values(nodeConfigs);
  const services = configs.filter((c): c is ServiceConfig => c.type === 'service');
  const volumes = configs.filter((c): c is VolumeConfig => c.type === 'volume');
  const networks = configs.filter((c): c is NetworkConfig => c.type === 'network');
  const envGroups = configs.filter((c): c is EnvironmentConfig => c.type === 'environment');

  const lines: string[] = [];

  lines.push(`# ${projectName}`);
  lines.push('');
  lines.push('> Auto-generated documentation from Composable');
  lines.push('');

  // Overview
  lines.push('## Overview');
  lines.push('');
  lines.push(`| Component | Count |`);
  lines.push(`|-----------|-------|`);
  lines.push(`| Services | ${services.length} |`);
  lines.push(`| Volumes | ${volumes.length} |`);
  lines.push(`| Networks | ${networks.length} |`);
  lines.push('');

  // Services
  if (services.length > 0) {
    lines.push('## Services');
    lines.push('');

    for (const svc of services) {
      lines.push(`### ${svc.name}`);
      lines.push('');
      if (svc.image) lines.push(`- **Image:** \`${svc.image}\``);
      if (svc.restart) lines.push(`- **Restart Policy:** ${svc.restart}`);
      if (svc.command) lines.push(`- **Command:** \`${svc.command}\``);
      lines.push('');

      // Ports
      const activePorts = svc.ports.filter((p) => p.host && p.container);
      if (activePorts.length > 0) {
        lines.push('#### Ports');
        lines.push('');
        lines.push('| Host | Container |');
        lines.push('|------|-----------|');
        for (const p of activePorts) {
          lines.push(`| ${p.host} | ${p.container} |`);
        }
        lines.push('');
      }

      // Environment
      const activeEnvs = svc.environment.filter((e) => e.key);
      if (activeEnvs.length > 0) {
        lines.push('#### Environment Variables');
        lines.push('');
        lines.push('| Variable | Default Value |');
        lines.push('|----------|---------------|');
        for (const e of activeEnvs) {
          const val = e.value.length > 50 ? e.value.substring(0, 47) + '...' : e.value;
          lines.push(`| \`${e.key}\` | \`${val}\` |`);
        }
        lines.push('');
      }

      // Volumes
      const activeVols = svc.volumes.filter((v) => v.host && v.container);
      if (activeVols.length > 0) {
        lines.push('#### Volumes');
        lines.push('');
        for (const v of activeVols) {
          lines.push(`- \`${v.host}\` → \`${v.container}\``);
        }
        lines.push('');
      }

      // Connected volumes/networks via edges
      const connectedVols = edges
        .filter((e) => e.target === svc.id && (e.data?.edgeType === 'volume' || e.targetHandle === 'volume'))
        .map((e) => configs.find((c) => c.id === e.source))
        .filter((c): c is VolumeConfig => c?.type === 'volume');

      const connectedNets = edges
        .filter((e) => e.target === svc.id && (e.data?.edgeType === 'network' || e.targetHandle === 'network'))
        .map((e) => configs.find((c) => c.id === e.source))
        .filter((c): c is NetworkConfig => c?.type === 'network');

      if (connectedVols.length > 0) {
        lines.push('#### Connected Volumes');
        lines.push('');
        for (const v of connectedVols) {
          lines.push(`- **${v.name}** (driver: ${v.driver || 'local'})`);
        }
        lines.push('');
      }

      if (connectedNets.length > 0) {
        lines.push('#### Connected Networks');
        lines.push('');
        for (const n of connectedNets) {
          lines.push(`- **${n.name}** (driver: ${n.driver || 'bridge'})`);
        }
        lines.push('');
      }

      // Dependencies
      const deps = edges
        .filter((e) => e.source === svc.id && (e.data?.edgeType === 'depends' || e.sourceHandle === 'depends-out'))
        .map((e) => configs.find((c) => c.id === e.target))
        .filter((c): c is ServiceConfig => c?.type === 'service');

      if (deps.length > 0) {
        lines.push('#### Dependencies');
        lines.push('');
        for (const d of deps) {
          lines.push(`- ${d.name}`);
        }
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    }
  }

  // Volumes section
  if (volumes.length > 0) {
    lines.push('## Volumes');
    lines.push('');
    lines.push('| Name | Driver |');
    lines.push('|------|--------|');
    for (const v of volumes) {
      lines.push(`| ${v.name} | ${v.driver || 'local'} |`);
    }
    lines.push('');
  }

  // Networks section
  if (networks.length > 0) {
    lines.push('## Networks');
    lines.push('');
    lines.push('| Name | Driver |');
    lines.push('|------|--------|');
    for (const n of networks) {
      lines.push(`| ${n.name} | ${n.driver || 'bridge'} |`);
    }
    lines.push('');
  }

  // Environment groups
  if (envGroups.length > 0) {
    lines.push('## Environment Groups');
    lines.push('');
    for (const eg of envGroups) {
      lines.push(`### ${eg.name}`);
      lines.push('');
      const activeVars = eg.variables.filter((v) => v.key);
      if (activeVars.length > 0) {
        lines.push('| Variable | Value |');
        lines.push('|----------|-------|');
        for (const v of activeVars) {
          lines.push(`| \`${v.key}\` | \`${v.value}\` |`);
        }
      } else {
        lines.push('*No variables defined*');
      }
      lines.push('');
    }
  }

  // Quick start
  lines.push('## Quick Start');
  lines.push('');
  lines.push('```bash');
  lines.push('# Start all services');
  lines.push('docker compose up -d');
  lines.push('');
  lines.push('# View logs');
  lines.push('docker compose logs -f');
  lines.push('');
  lines.push('# Stop all services');
  lines.push('docker compose down');
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}
