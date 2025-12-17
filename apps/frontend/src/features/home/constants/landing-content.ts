import type { Feature, WorkflowStep } from '../types';

export const FEATURES: Feature[] = [
  {
    icon: 'solar:star-bold-duotone',
    title: 'Template Library',
    description: 'Start quickly with pre-built templates for common stacks. From NGINX to Kubernetes, we have you covered.',
    color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
  },
  {
    icon: 'solar:magnifier-bold-duotone',
    title: 'Smart Validation',
    description: 'Real-time validation with best practices and automatic warnings. Never miss critical configurations.',
    color: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
  },
  {
    icon: 'solar:rocket-bold',
    title: 'Deployment Tools',
    description: 'Deploy to Docker Compose, Swarm, or Kubernetes with built-in commands and full documentation.',
    color: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
  },
  {
    icon: 'solar:lock-keyhole-bold',
    title: 'Secrets Management',
    description: 'Manage environment variables and secrets securely with built-in interface and .env export.',
    color: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
  },
  {
    icon: 'solar:fork-bold',
    title: 'Self-Hostable',
    description: 'Zero external dependencies. Self-host and maintain full control of your data.',
    color: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)'
  },
  {
    icon: 'solar:bolt-bold',
    title: 'Visual Builder',
    description: 'Drag-and-drop interface for building Docker Compose stacks without memorizing YAML syntax.',
    color: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
  }
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: '1',
    title: 'Choose Your Services',
    description: 'Click services from the palette or start with a template',
    icon: 'solar:server-bold'
  },
  {
    step: '2',
    title: 'Connect Dependencies',
    description: 'Drag to connect services and create dependencies visually',
    icon: 'solar:network-bold'
  },
  {
    step: '3',
    title: 'Configure Properties',
    description: 'Set ports, environment, volumes, and resources',
    icon: 'solar:code-bold'
  },
  {
    step: '4',
    title: 'Deploy',
    description: 'Download YAML and get commands to deploy',
    icon: 'solar:rocket-bold'
  }
];

export const BENEFITS: string[] = [
  'Intuitive visual interface - no need to memorize YAML syntax',
  'Real-time configuration generation',
  'Built-in best practices validation',
  'Secret management without committing to version control',
  'Multi-platform deployment support',
  'Production-ready templates',
  'Fully self-hostable - your data stays yours',
];
