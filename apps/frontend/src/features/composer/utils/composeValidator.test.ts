import { describe, it, expect } from 'vitest';
import { validateCompose } from './composeValidator';
import type { ServiceConfig, VolumeConfig } from '../types';
import type { Edge } from 'reactflow';

function svc(overrides: Partial<ServiceConfig> = {}): ServiceConfig {
  return {
    id: 'svc-1',
    type: 'service',
    name: 'web',
    image: 'nginx:alpine',
    ports: [],
    environment: [],
    volumes: [],
    networks: [],
    ...overrides,
  };
}

describe('composeValidator', () => {
  it('reports no issues for a valid service', () => {
    const configs = { 'svc-1': svc() };
    const issues = validateCompose(configs, []);
    const errors = issues.filter((i) => i.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('reports missing image', () => {
    const configs = { 'svc-1': svc({ image: '' }) };
    const issues = validateCompose(configs, []);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('no image'))).toBe(true);
  });

  it('reports duplicate service names', () => {
    const configs = {
      'svc-1': svc({ id: 'svc-1', name: 'web' }),
      'svc-2': svc({ id: 'svc-2', name: 'web' }),
    };
    const issues = validateCompose(configs, []);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('Duplicate'))).toBe(true);
  });

  it('reports port conflicts across services', () => {
    const configs = {
      'svc-1': svc({ id: 'svc-1', name: 'web', ports: [{ host: '80', container: '80' }] }),
      'svc-2': svc({ id: 'svc-2', name: 'api', ports: [{ host: '80', container: '3000' }] }),
    };
    const issues = validateCompose(configs, []);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('Host port 80'))).toBe(true);
  });

  it('reports invalid port ranges', () => {
    const configs = { 'svc-1': svc({ ports: [{ host: '99999', container: '80' }] }) };
    const issues = validateCompose(configs, []);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('out of range'))).toBe(true);
  });

  it('reports orphan volumes', () => {
    const vol: VolumeConfig = { id: 'vol-1', type: 'volume', name: 'data', driver: 'local' };
    const configs = { 'svc-1': svc(), 'vol-1': vol };
    const issues = validateCompose(configs, []);
    expect(issues.some((i) => i.severity === 'info' && i.message.includes('not connected'))).toBe(true);
  });

  it('reports circular dependencies', () => {
    const configs = {
      'svc-1': svc({ id: 'svc-1', name: 'a' }),
      'svc-2': svc({ id: 'svc-2', name: 'b' }),
    };
    const edges: Edge[] = [
      { id: 'e1', source: 'svc-1', target: 'svc-2', sourceHandle: 'depends-out', targetHandle: 'depends-in', data: { edgeType: 'depends' } },
      { id: 'e2', source: 'svc-2', target: 'svc-1', sourceHandle: 'depends-out', targetHandle: 'depends-in', data: { edgeType: 'depends' } },
    ];
    const issues = validateCompose(configs, edges);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('Circular'))).toBe(true);
  });

  it('reports no services warning', () => {
    const issues = validateCompose({}, []);
    expect(issues.some((i) => i.severity === 'warning' && i.message.includes('No services'))).toBe(true);
  });

  it('warns about invalid service name format', () => {
    const configs = { 'svc-1': svc({ name: 'My Service' }) };
    const issues = validateCompose(configs, []);
    expect(issues.some((i) => i.severity === 'warning' && i.message.includes('lowercase'))).toBe(true);
  });
});
