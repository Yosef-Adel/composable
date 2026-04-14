import type { ServiceConfig } from '../types';

export interface ServiceTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  defaults: Partial<ServiceConfig>;
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  // ── Databases ────────────────────────────────────────
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'Database',
    icon: 'simple-icons:postgresql',
    description: 'Relational database',
    defaults: {
      name: 'postgres',
      image: 'postgres:16-alpine',
      ports: [{ host: '5432', container: '5432' }],
      environment: [
        { key: 'POSTGRES_USER', value: 'postgres' },
        { key: 'POSTGRES_PASSWORD', value: 'postgres' },
        { key: 'POSTGRES_DB', value: 'app' },
      ],
      volumes: [{ host: 'pgdata', container: '/var/lib/postgresql/data' }],
      restart: 'unless-stopped',
    },
  },
  {
    id: 'mysql',
    name: 'MySQL',
    category: 'Database',
    icon: 'simple-icons:mysql',
    description: 'Relational database',
    defaults: {
      name: 'mysql',
      image: 'mysql:8',
      ports: [{ host: '3306', container: '3306' }],
      environment: [
        { key: 'MYSQL_ROOT_PASSWORD', value: 'root' },
        { key: 'MYSQL_DATABASE', value: 'app' },
      ],
      volumes: [{ host: 'mysqldata', container: '/var/lib/mysql' }],
      restart: 'unless-stopped',
    },
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    icon: 'simple-icons:mongodb',
    description: 'Document database',
    defaults: {
      name: 'mongodb',
      image: 'mongo:7',
      ports: [{ host: '27017', container: '27017' }],
      environment: [
        { key: 'MONGO_INITDB_ROOT_USERNAME', value: 'root' },
        { key: 'MONGO_INITDB_ROOT_PASSWORD', value: 'root' },
      ],
      volumes: [{ host: 'mongodata', container: '/data/db' }],
      restart: 'unless-stopped',
    },
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'Database',
    icon: 'simple-icons:redis',
    description: 'In-memory data store',
    defaults: {
      name: 'redis',
      image: 'redis:7-alpine',
      ports: [{ host: '6379', container: '6379' }],
      command: 'redis-server --appendonly yes',
      volumes: [{ host: 'redisdata', container: '/data' }],
      restart: 'unless-stopped',
    },
  },
  {
    id: 'mariadb',
    name: 'MariaDB',
    category: 'Database',
    icon: 'simple-icons:mariadb',
    description: 'MySQL-compatible database',
    defaults: {
      name: 'mariadb',
      image: 'mariadb:11',
      ports: [{ host: '3306', container: '3306' }],
      environment: [
        { key: 'MARIADB_ROOT_PASSWORD', value: 'root' },
        { key: 'MARIADB_DATABASE', value: 'app' },
      ],
      volumes: [{ host: 'mariadbdata', container: '/var/lib/mysql' }],
      restart: 'unless-stopped',
    },
  },

  // ── Web Servers / Proxies ────────────────────────────
  {
    id: 'nginx',
    name: 'Nginx',
    category: 'Web Server',
    icon: 'simple-icons:nginx',
    description: 'Web server & reverse proxy',
    defaults: {
      name: 'nginx',
      image: 'nginx:alpine',
      ports: [{ host: '80', container: '80' }],
      restart: 'unless-stopped',
    },
  },
  {
    id: 'traefik',
    name: 'Traefik',
    category: 'Web Server',
    icon: 'simple-icons:traefikproxy',
    description: 'Cloud-native reverse proxy',
    defaults: {
      name: 'traefik',
      image: 'traefik:v3.0',
      ports: [
        { host: '80', container: '80' },
        { host: '8080', container: '8080' },
      ],
      command: '--api.insecure=true --providers.docker=true',
      restart: 'unless-stopped',
    },
  },
  {
    id: 'caddy',
    name: 'Caddy',
    category: 'Web Server',
    icon: 'simple-icons:caddy',
    description: 'Web server with auto HTTPS',
    defaults: {
      name: 'caddy',
      image: 'caddy:2-alpine',
      ports: [
        { host: '80', container: '80' },
        { host: '443', container: '443' },
      ],
      volumes: [{ host: 'caddy_data', container: '/data' }],
      restart: 'unless-stopped',
    },
  },

  // ── Application Runtimes ─────────────────────────────
  {
    id: 'node',
    name: 'Node.js',
    category: 'Runtime',
    icon: 'simple-icons:nodedotjs',
    description: 'JavaScript runtime',
    defaults: {
      name: 'app',
      image: 'node:22-alpine',
      ports: [{ host: '3000', container: '3000' }],
      command: 'npm start',
      restart: 'unless-stopped',
    },
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Runtime',
    icon: 'simple-icons:python',
    description: 'Python application',
    defaults: {
      name: 'app',
      image: 'python:3.12-slim',
      ports: [{ host: '8000', container: '8000' }],
      command: 'python app.py',
      restart: 'unless-stopped',
    },
  },
  {
    id: 'go',
    name: 'Go',
    category: 'Runtime',
    icon: 'simple-icons:go',
    description: 'Go application',
    defaults: {
      name: 'app',
      image: 'golang:1.22-alpine',
      ports: [{ host: '8080', container: '8080' }],
      restart: 'unless-stopped',
    },
  },

  // ── Message Queues ───────────────────────────────────
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    category: 'Messaging',
    icon: 'simple-icons:rabbitmq',
    description: 'Message broker',
    defaults: {
      name: 'rabbitmq',
      image: 'rabbitmq:3-management-alpine',
      ports: [
        { host: '5672', container: '5672' },
        { host: '15672', container: '15672' },
      ],
      environment: [
        { key: 'RABBITMQ_DEFAULT_USER', value: 'guest' },
        { key: 'RABBITMQ_DEFAULT_PASS', value: 'guest' },
      ],
      restart: 'unless-stopped',
    },
  },

  // ── Monitoring ───────────────────────────────────────
  {
    id: 'grafana',
    name: 'Grafana',
    category: 'Monitoring',
    icon: 'simple-icons:grafana',
    description: 'Observability dashboard',
    defaults: {
      name: 'grafana',
      image: 'grafana/grafana:latest',
      ports: [{ host: '3000', container: '3000' }],
      volumes: [{ host: 'grafana_data', container: '/var/lib/grafana' }],
      restart: 'unless-stopped',
    },
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    category: 'Monitoring',
    icon: 'simple-icons:prometheus',
    description: 'Metrics collection',
    defaults: {
      name: 'prometheus',
      image: 'prom/prometheus:latest',
      ports: [{ host: '9090', container: '9090' }],
      restart: 'unless-stopped',
    },
  },

  // ── Storage ──────────────────────────────────────────
  {
    id: 'minio',
    name: 'MinIO',
    category: 'Storage',
    icon: 'simple-icons:minio',
    description: 'S3-compatible object storage',
    defaults: {
      name: 'minio',
      image: 'minio/minio:latest',
      ports: [
        { host: '9000', container: '9000' },
        { host: '9001', container: '9001' },
      ],
      command: 'server /data --console-address ":9001"',
      environment: [
        { key: 'MINIO_ROOT_USER', value: 'minioadmin' },
        { key: 'MINIO_ROOT_PASSWORD', value: 'minioadmin' },
      ],
      volumes: [{ host: 'minio_data', container: '/data' }],
      restart: 'unless-stopped',
    },
  },

  // ── CMS / Apps ───────────────────────────────────────
  {
    id: 'wordpress',
    name: 'WordPress',
    category: 'Application',
    icon: 'simple-icons:wordpress',
    description: 'CMS platform',
    defaults: {
      name: 'wordpress',
      image: 'wordpress:latest',
      ports: [{ host: '8080', container: '80' }],
      environment: [
        { key: 'WORDPRESS_DB_HOST', value: 'mysql:3306' },
        { key: 'WORDPRESS_DB_NAME', value: 'wordpress' },
        { key: 'WORDPRESS_DB_USER', value: 'root' },
        { key: 'WORDPRESS_DB_PASSWORD', value: 'root' },
      ],
      restart: 'unless-stopped',
    },
  },

  // ── Search ───────────────────────────────────────────
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    category: 'Search',
    icon: 'simple-icons:elasticsearch',
    description: 'Search & analytics engine',
    defaults: {
      name: 'elasticsearch',
      image: 'elasticsearch:8.13.0',
      ports: [{ host: '9200', container: '9200' }],
      environment: [
        { key: 'discovery.type', value: 'single-node' },
        { key: 'xpack.security.enabled', value: 'false' },
      ],
      volumes: [{ host: 'esdata', container: '/usr/share/elasticsearch/data' }],
      restart: 'unless-stopped',
    },
  },

  // ── Generic ──────────────────────────────────────────
  {
    id: 'custom',
    name: 'Custom Service',
    category: 'Generic',
    icon: 'solar:server-bold',
    description: 'Empty service — configure manually',
    defaults: {
      name: 'my-service',
      image: '',
      restart: 'unless-stopped',
    },
  },
];

export const TEMPLATE_CATEGORIES = [...new Set(SERVICE_TEMPLATES.map((t) => t.category))];
