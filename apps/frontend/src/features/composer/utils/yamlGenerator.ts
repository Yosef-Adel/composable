import type { NodeConfig, ServiceConfig, VolumeConfig, NetworkConfig } from '../types';
import type { Edge } from 'reactflow';

export function generateYaml(nodeConfigs: Record<string, NodeConfig>, _edges: Edge[]): string {
  const services: Record<string, any> = {};
  const volumes: Record<string, any> = {};
  const networks: Record<string, any> = {};

  // Process all nodes
  Object.values(nodeConfigs).forEach((config) => {
    if (config.type === 'service') {
      const serviceConfig = config as ServiceConfig;
      services[serviceConfig.name] = {
        image: serviceConfig.image,
        ...(serviceConfig.ports.length > 0 && {
          ports: serviceConfig.ports.map((p) => `${p.host}:${p.container}`),
        }),
        ...(serviceConfig.environment.length > 0 && {
          environment: serviceConfig.environment.reduce(
            (acc, env) => ({ ...acc, [env.key]: env.value }),
            {}
          ),
        }),
        ...(serviceConfig.volumes.length > 0 && {
          volumes: serviceConfig.volumes.map((v) => `${v.host}:${v.container}`),
        }),
        ...(serviceConfig.networks.length > 0 && {
          networks: serviceConfig.networks,
        }),
        ...(serviceConfig.restart && { restart: serviceConfig.restart }),
        ...(serviceConfig.command && { command: serviceConfig.command }),
      };
    } else if (config.type === 'volume') {
      const volumeConfig = config as VolumeConfig;
      volumes[volumeConfig.name] = {
        driver: volumeConfig.driver || 'local',
      };
    } else if (config.type === 'network') {
      const networkConfig = config as NetworkConfig;
      networks[networkConfig.name] = {
        driver: networkConfig.driver || 'bridge',
      };
    }
  });

  // Build YAML structure
  const yamlObject: any = {
    version: '3.8',
  };

  if (Object.keys(services).length > 0) {
    yamlObject.services = services;
  }

  if (Object.keys(volumes).length > 0) {
    yamlObject.volumes = volumes;
  }

  if (Object.keys(networks).length > 0) {
    yamlObject.networks = networks;
  }

  // Convert to YAML string (simple implementation)
  return convertToYamlString(yamlObject);
}

function convertToYamlString(obj: any, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}:\n`;
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      value.forEach((item) => {
        if (typeof item === 'object') {
          yaml += `${spaces}  - ${convertToYamlString(item, indent + 2).trim()}\n`;
        } else {
          yaml += `${spaces}  - ${item}\n`;
        }
      });
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n`;
      yaml += convertToYamlString(value, indent + 1);
    } else {
      yaml += `${spaces}${key}: ${value}\n`;
    }
  }

  return yaml;
}
