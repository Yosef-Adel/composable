import type { ServiceConfig, VolumeConfig, NetworkConfig, NodeConfig } from '../types';

export interface StackTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  services: Array<Partial<ServiceConfig> & { name: string; image: string }>;
  volumes?: Array<{ name: string; driver?: string }>;
  networks?: Array<{ name: string; driver?: string }>;
  /** Connections: [sourceName, targetName, type] */
  connections?: Array<[string, string, 'depends' | 'volume' | 'network']>;
}

export const STACK_TEMPLATES: StackTemplate[] = [
  {
    id: 'mern',
    name: 'MERN Stack',
    icon: 'simple-icons:mongodb',
    description: 'MongoDB + Express + React + Node.js',
    services: [
      {
        name: 'frontend',
        image: 'node:22-alpine',
        ports: [{ host: '3000', container: '3000' }],
        command: 'npm start',
        restart: 'unless-stopped',
      },
      {
        name: 'backend',
        image: 'node:22-alpine',
        ports: [{ host: '4000', container: '4000' }],
        command: 'npm start',
        restart: 'unless-stopped',
        environment: [
          { key: 'MONGO_URI', value: 'mongodb://mongodb:27017/app' },
        ],
      },
      {
        name: 'mongodb',
        image: 'mongo:7',
        ports: [{ host: '27017', container: '27017' }],
        volumes: [{ host: 'mongodata', container: '/data/db' }],
        restart: 'unless-stopped',
      },
    ],
    volumes: [{ name: 'mongodata' }],
    networks: [{ name: 'app-network' }],
    connections: [
      ['frontend', 'backend', 'depends'],
      ['backend', 'mongodb', 'depends'],
      ['frontend', 'app-network', 'network'],
      ['backend', 'app-network', 'network'],
      ['mongodb', 'app-network', 'network'],
      ['mongodb', 'mongodata', 'volume'],
    ],
  },
  {
    id: 'lamp',
    name: 'LAMP Stack',
    icon: 'simple-icons:php',
    description: 'Linux + Apache + MySQL + PHP',
    services: [
      {
        name: 'php-apache',
        image: 'php:8.3-apache',
        ports: [{ host: '80', container: '80' }],
        environment: [
          { key: 'MYSQL_HOST', value: 'mysql' },
        ],
        restart: 'unless-stopped',
      },
      {
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
      {
        name: 'phpmyadmin',
        image: 'phpmyadmin:latest',
        ports: [{ host: '8080', container: '80' }],
        environment: [
          { key: 'PMA_HOST', value: 'mysql' },
          { key: 'PMA_PORT', value: '3306' },
        ],
        restart: 'unless-stopped',
      },
    ],
    volumes: [{ name: 'mysqldata' }],
    connections: [
      ['php-apache', 'mysql', 'depends'],
      ['phpmyadmin', 'mysql', 'depends'],
      ['mysql', 'mysqldata', 'volume'],
    ],
  },
  {
    id: 'wordpress-stack',
    name: 'WordPress + MySQL',
    icon: 'simple-icons:wordpress',
    description: 'WordPress CMS with MySQL database',
    services: [
      {
        name: 'wordpress',
        image: 'wordpress:latest',
        ports: [{ host: '8080', container: '80' }],
        environment: [
          { key: 'WORDPRESS_DB_HOST', value: 'mysql:3306' },
          { key: 'WORDPRESS_DB_NAME', value: 'wordpress' },
          { key: 'WORDPRESS_DB_USER', value: 'wordpress' },
          { key: 'WORDPRESS_DB_PASSWORD', value: 'wordpress' },
        ],
        volumes: [{ host: 'wp_data', container: '/var/www/html' }],
        restart: 'unless-stopped',
      },
      {
        name: 'mysql',
        image: 'mysql:8',
        environment: [
          { key: 'MYSQL_ROOT_PASSWORD', value: 'rootpassword' },
          { key: 'MYSQL_DATABASE', value: 'wordpress' },
          { key: 'MYSQL_USER', value: 'wordpress' },
          { key: 'MYSQL_PASSWORD', value: 'wordpress' },
        ],
        volumes: [{ host: 'db_data', container: '/var/lib/mysql' }],
        restart: 'unless-stopped',
      },
    ],
    volumes: [{ name: 'wp_data' }, { name: 'db_data' }],
    connections: [
      ['wordpress', 'mysql', 'depends'],
      ['wordpress', 'wp_data', 'volume'],
      ['mysql', 'db_data', 'volume'],
    ],
  },
  {
    id: 'monitoring',
    name: 'Monitoring Stack',
    icon: 'simple-icons:grafana',
    description: 'Prometheus + Grafana + Node Exporter',
    services: [
      {
        name: 'prometheus',
        image: 'prom/prometheus:latest',
        ports: [{ host: '9090', container: '9090' }],
        volumes: [{ host: 'prom_data', container: '/prometheus' }],
        restart: 'unless-stopped',
      },
      {
        name: 'grafana',
        image: 'grafana/grafana:latest',
        ports: [{ host: '3000', container: '3000' }],
        environment: [
          { key: 'GF_SECURITY_ADMIN_PASSWORD', value: 'admin' },
        ],
        volumes: [{ host: 'grafana_data', container: '/var/lib/grafana' }],
        restart: 'unless-stopped',
      },
      {
        name: 'node-exporter',
        image: 'prom/node-exporter:latest',
        ports: [{ host: '9100', container: '9100' }],
        restart: 'unless-stopped',
      },
    ],
    volumes: [{ name: 'prom_data' }, { name: 'grafana_data' }],
    networks: [{ name: 'monitoring' }],
    connections: [
      ['grafana', 'prometheus', 'depends'],
      ['prometheus', 'node-exporter', 'depends'],
      ['prometheus', 'prom_data', 'volume'],
      ['grafana', 'grafana_data', 'volume'],
      ['prometheus', 'monitoring', 'network'],
      ['grafana', 'monitoring', 'network'],
      ['node-exporter', 'monitoring', 'network'],
    ],
  },
  {
    id: 'elk',
    name: 'ELK Stack',
    icon: 'simple-icons:elasticsearch',
    description: 'Elasticsearch + Logstash + Kibana',
    services: [
      {
        name: 'elasticsearch',
        image: 'elasticsearch:8.13.0',
        ports: [{ host: '9200', container: '9200' }],
        environment: [
          { key: 'discovery.type', value: 'single-node' },
          { key: 'xpack.security.enabled', value: 'false' },
          { key: 'ES_JAVA_OPTS', value: '-Xms512m -Xmx512m' },
        ],
        volumes: [{ host: 'esdata', container: '/usr/share/elasticsearch/data' }],
        restart: 'unless-stopped',
      },
      {
        name: 'logstash',
        image: 'logstash:8.13.0',
        ports: [{ host: '5044', container: '5044' }],
        environment: [
          { key: 'LS_JAVA_OPTS', value: '-Xms256m -Xmx256m' },
        ],
        restart: 'unless-stopped',
      },
      {
        name: 'kibana',
        image: 'kibana:8.13.0',
        ports: [{ host: '5601', container: '5601' }],
        environment: [
          { key: 'ELASTICSEARCH_HOSTS', value: 'http://elasticsearch:9200' },
        ],
        restart: 'unless-stopped',
      },
    ],
    volumes: [{ name: 'esdata' }],
    connections: [
      ['kibana', 'elasticsearch', 'depends'],
      ['logstash', 'elasticsearch', 'depends'],
      ['elasticsearch', 'esdata', 'volume'],
    ],
  },
  {
    id: 'redis-stack',
    name: 'Redis + Redis Commander',
    icon: 'simple-icons:redis',
    description: 'Redis with web-based management UI',
    services: [
      {
        name: 'redis',
        image: 'redis:7-alpine',
        ports: [{ host: '6379', container: '6379' }],
        command: 'redis-server --appendonly yes',
        volumes: [{ host: 'redisdata', container: '/data' }],
        restart: 'unless-stopped',
      },
      {
        name: 'redis-commander',
        image: 'rediscommander/redis-commander:latest',
        ports: [{ host: '8081', container: '8081' }],
        environment: [
          { key: 'REDIS_HOSTS', value: 'local:redis:6379' },
        ],
        restart: 'unless-stopped',
      },
    ],
    volumes: [{ name: 'redisdata' }],
    connections: [
      ['redis-commander', 'redis', 'depends'],
      ['redis', 'redisdata', 'volume'],
    ],
  },
];
