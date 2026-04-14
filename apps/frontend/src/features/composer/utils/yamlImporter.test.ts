import { describe, it, expect } from 'vitest';
import { parseDockerCompose } from './yamlImporter';

const SAMPLE_YAML = `
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - frontend
  api:
    image: node:22-alpine
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: db
    volumes:
      - app_data:/data
    networks:
      - frontend
      - backend
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
    driver: local
  app_data:

networks:
  frontend:
    driver: bridge
  backend:
`;

describe('yamlImporter', () => {
  it('parses services with image, ports, env, command', () => {
    const result = parseDockerCompose(SAMPLE_YAML);
    const serviceNodes = result.nodes.filter((n) => n.type === 'service');
    expect(serviceNodes).toHaveLength(3);

    const webId = serviceNodes.find((n) => n.data.label === 'web')?.id;
    expect(webId).toBeDefined();
    const webConfig = result.nodeConfigs[webId!] as any;
    expect(webConfig.image).toBe('nginx:alpine');
    expect(webConfig.ports).toHaveLength(1);
    expect(webConfig.ports[0]).toEqual({ host: '80', container: '80' });
  });

  it('parses volumes and creates volume nodes', () => {
    const result = parseDockerCompose(SAMPLE_YAML);
    const volumeNodes = result.nodes.filter((n) => n.type === 'volume');
    expect(volumeNodes).toHaveLength(2);
  });

  it('parses networks and creates network nodes', () => {
    const result = parseDockerCompose(SAMPLE_YAML);
    const networkNodes = result.nodes.filter((n) => n.type === 'network');
    expect(networkNodes).toHaveLength(2);
  });

  it('creates depends_on edges', () => {
    const result = parseDockerCompose(SAMPLE_YAML);
    const dependsEdges = result.edges.filter((e) => e.data?.edgeType === 'depends');
    expect(dependsEdges).toHaveLength(1);
    // web depends on api
    const webId = result.nodes.find((n) => n.data.label === 'web')?.id;
    const apiId = result.nodes.find((n) => n.data.label === 'api')?.id;
    expect(dependsEdges[0].source).toBe(webId);
    expect(dependsEdges[0].target).toBe(apiId);
  });

  it('creates volume connection edges', () => {
    const result = parseDockerCompose(SAMPLE_YAML);
    const volumeEdges = result.edges.filter((e) => e.data?.edgeType === 'volume');
    // api uses app_data, db uses pgdata
    expect(volumeEdges).toHaveLength(2);
  });

  it('creates network connection edges', () => {
    const result = parseDockerCompose(SAMPLE_YAML);
    const networkEdges = result.edges.filter((e) => e.data?.edgeType === 'network');
    // web→frontend, api→frontend, api→backend
    expect(networkEdges).toHaveLength(3);
  });

  it('parses environment as object notation', () => {
    const result = parseDockerCompose(SAMPLE_YAML);
    const apiId = result.nodes.find((n) => n.data.label === 'api')?.id;
    const apiConfig = result.nodeConfigs[apiId!] as any;
    expect(apiConfig.environment).toContainEqual({ key: 'NODE_ENV', value: 'production' });
    expect(apiConfig.environment).toContainEqual({ key: 'DB_HOST', value: 'db' });
  });

  it('throws on invalid YAML', () => {
    expect(() => parseDockerCompose('not: valid: yaml: [broken')).toThrow();
  });
});
