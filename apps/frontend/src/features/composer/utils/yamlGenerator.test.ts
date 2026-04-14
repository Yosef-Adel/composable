import { describe, it, expect } from 'vitest';
import { generateYaml } from './yamlGenerator';
import type { ServiceConfig } from '../types';
import type { Edge } from 'reactflow';

describe('generateYaml', () => {
  it('returns empty string when no configs exist', () => {
    expect(generateYaml({}, [])).toBe('');
  });

  it('generates basic service with image', () => {
    const configs: Record<string, ServiceConfig> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'web',
        image: 'nginx:alpine',
        ports: [],
        environment: [],
        volumes: [],
        networks: [],
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('services:');
    expect(yaml).toContain('web:');
    expect(yaml).toContain('image: nginx:alpine');
  });

  it('generates ports correctly', () => {
    const configs: Record<string, ServiceConfig> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'web',
        image: 'nginx',
        ports: [{ host: '8080', container: '80' }],
        environment: [],
        volumes: [],
        networks: [],
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('ports:');
    expect(yaml).toContain('8080:80');
  });

  it('filters out empty port entries', () => {
    const configs: Record<string, ServiceConfig> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'web',
        image: 'nginx',
        ports: [
          { host: '8080', container: '80' },
          { host: '', container: '' },
        ],
        environment: [],
        volumes: [],
        networks: [],
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('8080:80');
    expect(yaml).not.toContain('- ""');
  });

  it('generates environment variables', () => {
    const configs: Record<string, ServiceConfig> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'app',
        image: 'node',
        ports: [],
        environment: [{ key: 'NODE_ENV', value: 'production' }],
        volumes: [],
        networks: [],
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('environment:');
    expect(yaml).toContain('NODE_ENV: production');
  });

  it('generates top-level volumes section', () => {
    const configs = {
      v1: {
        id: 'v1',
        type: 'volume' as const,
        name: 'data-vol',
        driver: 'local',
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('volumes:');
    expect(yaml).toContain('data-vol:');
    expect(yaml).toContain('driver: local');
  });

  it('generates top-level networks section', () => {
    const configs = {
      n1: {
        id: 'n1',
        type: 'network' as const,
        name: 'backend-net',
        driver: 'bridge',
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('networks:');
    expect(yaml).toContain('backend-net:');
    expect(yaml).toContain('driver: bridge');
  });

  it('links volume to service via edge', () => {
    const configs: Record<string, any> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'db',
        image: 'postgres',
        ports: [],
        environment: [],
        volumes: [],
        networks: [],
      },
      v1: {
        id: 'v1',
        type: 'volume',
        name: 'pgdata',
      },
    };
    const edges: Edge[] = [{ id: 'e1', source: 's1', target: 'v1' }];
    const yaml = generateYaml(configs, edges);
    expect(yaml).toContain('volumes:');
    expect(yaml).toContain('pgdata:/data');
  });

  it('links environment config to service via edge', () => {
    const configs: Record<string, any> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'app',
        image: 'node',
        ports: [],
        environment: [],
        volumes: [],
        networks: [],
      },
      e1: {
        id: 'e1',
        type: 'environment',
        name: 'env-group',
        variables: [{ key: 'DB_HOST', value: 'localhost' }],
      },
    };
    const edges: Edge[] = [{ id: 'edge1', source: 's1', target: 'e1' }];
    const yaml = generateYaml(configs, edges);
    expect(yaml).toContain('DB_HOST: localhost');
  });

  it('generates depends_on for service-to-service edges', () => {
    const configs: Record<string, ServiceConfig> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'web',
        image: 'nginx',
        ports: [],
        environment: [],
        volumes: [],
        networks: [],
      },
      s2: {
        id: 's2',
        type: 'service',
        name: 'api',
        image: 'node',
        ports: [],
        environment: [],
        volumes: [],
        networks: [],
      },
    };
    const edges: Edge[] = [{ id: 'e1', source: 's1', target: 's2' }];
    const yaml = generateYaml(configs, edges);
    expect(yaml).toContain('depends_on:');
    expect(yaml).toContain('- api');
  });

  it('quotes YAML special characters in env values', () => {
    const configs: Record<string, ServiceConfig> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'app',
        image: 'node',
        ports: [],
        environment: [{ key: 'CONN_STR', value: 'host:5432/db?ssl=true' }],
        volumes: [],
        networks: [],
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('"host:5432/db?ssl=true"');
  });

  it('includes restart and command fields', () => {
    const configs: Record<string, ServiceConfig> = {
      s1: {
        id: 's1',
        type: 'service',
        name: 'app',
        image: 'node',
        ports: [],
        environment: [],
        volumes: [],
        networks: [],
        restart: 'always',
        command: 'npm start',
      },
    };
    const yaml = generateYaml(configs, []);
    expect(yaml).toContain('restart: always');
    expect(yaml).toContain('command: npm start');
  });
});
