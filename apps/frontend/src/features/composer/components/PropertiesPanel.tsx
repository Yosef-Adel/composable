import { useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateNodeConfig, deleteNode, setSelectedNode } from '../store/composerSlice';
import type {
  NodeConfig,
  ServiceConfig,
  VolumeConfig,
  NetworkConfig,
  EnvironmentConfig,
} from '../types';

// ── Helpers ──────────────────────────────────────────────────────────

function isService(c: NodeConfig): c is ServiceConfig {
  return c.type === 'service';
}
function isVolume(c: NodeConfig): c is VolumeConfig {
  return c.type === 'volume';
}
function isNetwork(c: NodeConfig): c is NetworkConfig {
  return c.type === 'network';
}
function isEnvironment(c: NodeConfig): c is EnvironmentConfig {
  return c.type === 'environment';
}

const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
  service: { label: 'Service', icon: 'solar:server-bold', color: '#3b82f6' },
  volume: { label: 'Volume', icon: 'solar:database-bold', color: '#a855f7' },
  network: { label: 'Network', icon: 'solar:wi-fi-router-bold', color: '#22c55e' },
  environment: { label: 'Environment', icon: 'solar:box-minimalistic-bold', color: '#f97316' },
};

// ── Component ────────────────────────────────────────────────────────

export function PropertiesPanel() {
  const dispatch = useAppDispatch();
  const { selectedNodeId, nodeConfigs } = useAppSelector((s) => s.composer);
  const config = selectedNodeId ? nodeConfigs[selectedNodeId] : null;

  const update = useCallback(
    (partial: Partial<NodeConfig>) => {
      if (selectedNodeId) {
        dispatch(updateNodeConfig({ nodeId: selectedNodeId, config: partial }));
      }
    },
    [dispatch, selectedNodeId]
  );

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      dispatch(deleteNode(selectedNodeId));
    }
  }, [dispatch, selectedNodeId]);

  const handleClose = useCallback(() => {
    dispatch(setSelectedNode(null));
  }, [dispatch]);

  if (!config) {
    return (
      <Box
        sx={{
          width: 320,
          borderLeft: 1,
          borderColor: 'grey.800',
          bgcolor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box sx={{ textAlign: 'center', px: 3 }}>
          <Iconify icon="solar:cursor-bold" width={48} sx={{ color: 'grey.600', mb: 2 }} />
          <Typography variant="subtitle1" sx={{ color: 'grey.400', mb: 0.5 }}>
            No Node Selected
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Click a node on the canvas to edit its properties
          </Typography>
        </Box>
      </Box>
    );
  }

  const meta = typeLabels[config.type] ?? typeLabels.service;

  return (
    <Box
      sx={{
        width: 320,
        borderLeft: 1,
        borderColor: 'grey.800',
        bgcolor: 'rgba(15, 23, 42, 0.5)',
        overflow: 'auto',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: 1,
          borderColor: 'grey.800',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            bgcolor: meta.color,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Iconify icon={meta.icon} width={20} sx={{ color: 'white' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {config.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.400' }}>
            {meta.label} Properties
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'grey.400' }}>
          <Iconify icon="solar:close-circle-bold" width={20} />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Common: Name */}
        <TextField
          label="Name"
          size="small"
          fullWidth
          value={config.name}
          onChange={(e) => update({ name: e.target.value })}
        />

        {/* Type-specific fields */}
        {isService(config) && <ServiceFields config={config} update={update} />}
        {isVolume(config) && <VolumeFields config={config} update={update} />}
        {isNetwork(config) && <NetworkFields config={config} update={update} />}
        {isEnvironment(config) && <EnvironmentFields config={config} update={update} />}
      </Box>

      {/* Footer: Delete */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.800' }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          size="small"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={16} />}
          onClick={handleDelete}
        >
          Delete Node
        </Button>
      </Box>
    </Box>
  );
}

// ── Type-specific sub-forms ──────────────────────────────────────────

interface FieldProps<T> {
  config: T;
  update: (partial: Partial<NodeConfig>) => void;
}

function ServiceFields({ config, update }: FieldProps<ServiceConfig>) {
  const addPort = () =>
    update({ ports: [...config.ports, { host: '8080', container: '80' }] });
  const removePort = (i: number) =>
    update({ ports: config.ports.filter((_, idx) => idx !== i) });
  const setPort = (i: number, field: 'host' | 'container', value: string) => {
    const ports = config.ports.map((p, idx) => (idx === i ? { ...p, [field]: value } : p));
    update({ ports });
  };

  const addEnv = () =>
    update({ environment: [...config.environment, { key: '', value: '' }] });
  const removeEnv = (i: number) =>
    update({ environment: config.environment.filter((_, idx) => idx !== i) });
  const setEnv = (i: number, field: 'key' | 'value', value: string) => {
    const environment = config.environment.map((e, idx) =>
      idx === i ? { ...e, [field]: value } : e
    );
    update({ environment });
  };

  const addVolume = () =>
    update({ volumes: [...config.volumes, { host: './data', container: '/data' }] });
  const removeVolume = (i: number) =>
    update({ volumes: config.volumes.filter((_, idx) => idx !== i) });
  const setVolume = (i: number, field: 'host' | 'container', value: string) => {
    const volumes = config.volumes.map((v, idx) => (idx === i ? { ...v, [field]: value } : v));
    update({ volumes });
  };

  return (
    <>
      <TextField
        label="Image"
        size="small"
        fullWidth
        value={config.image}
        onChange={(e) => update({ image: e.target.value })}
      />

      <TextField
        label="Command"
        size="small"
        fullWidth
        value={config.command ?? ''}
        onChange={(e) => update({ command: e.target.value || undefined })}
        placeholder="e.g. npm start"
      />

      <FormControl size="small" fullWidth>
        <InputLabel>Restart Policy</InputLabel>
        <Select
          label="Restart Policy"
          value={config.restart ?? ''}
          onChange={(e) => update({ restart: e.target.value })}
        >
          <MenuItem value="no">no</MenuItem>
          <MenuItem value="always">always</MenuItem>
          <MenuItem value="on-failure">on-failure</MenuItem>
          <MenuItem value="unless-stopped">unless-stopped</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* Ports */}
      <SectionHeader title="Ports" onAdd={addPort} />
      {config.ports.map((port, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            label="Host"
            value={port.host}
            onChange={(e) => setPort(i, 'host', e.target.value)}
            sx={{ flex: 1 }}
          />
          <Typography sx={{ color: 'grey.500' }}>:</Typography>
          <TextField
            size="small"
            label="Container"
            value={port.container}
            onChange={(e) => setPort(i, 'container', e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton size="small" onClick={() => removePort(i)} sx={{ color: 'grey.500' }}>
            <Iconify icon="solar:minus-circle-bold" width={18} />
          </IconButton>
        </Box>
      ))}

      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* Environment */}
      <SectionHeader title="Environment" onAdd={addEnv} />
      {config.environment.map((env, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            label="Key"
            value={env.key}
            onChange={(e) => setEnv(i, 'key', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Value"
            value={env.value}
            onChange={(e) => setEnv(i, 'value', e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton size="small" onClick={() => removeEnv(i)} sx={{ color: 'grey.500' }}>
            <Iconify icon="solar:minus-circle-bold" width={18} />
          </IconButton>
        </Box>
      ))}

      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* Volumes */}
      <SectionHeader title="Volumes" onAdd={addVolume} />
      {config.volumes.map((vol, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            label="Host"
            value={vol.host}
            onChange={(e) => setVolume(i, 'host', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Container"
            value={vol.container}
            onChange={(e) => setVolume(i, 'container', e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton size="small" onClick={() => removeVolume(i)} sx={{ color: 'grey.500' }}>
            <Iconify icon="solar:minus-circle-bold" width={18} />
          </IconButton>
        </Box>
      ))}
    </>
  );
}

function VolumeFields({ config, update }: FieldProps<VolumeConfig>) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel>Driver</InputLabel>
      <Select
        label="Driver"
        value={config.driver ?? 'local'}
        onChange={(e) => update({ driver: e.target.value })}
      >
        <MenuItem value="local">local</MenuItem>
        <MenuItem value="nfs">nfs</MenuItem>
        <MenuItem value="tmpfs">tmpfs</MenuItem>
      </Select>
    </FormControl>
  );
}

function NetworkFields({ config, update }: FieldProps<NetworkConfig>) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel>Driver</InputLabel>
      <Select
        label="Driver"
        value={config.driver ?? 'bridge'}
        onChange={(e) => update({ driver: e.target.value })}
      >
        <MenuItem value="bridge">bridge</MenuItem>
        <MenuItem value="host">host</MenuItem>
        <MenuItem value="overlay">overlay</MenuItem>
        <MenuItem value="none">none</MenuItem>
      </Select>
    </FormControl>
  );
}

function EnvironmentFields({ config, update }: FieldProps<EnvironmentConfig>) {
  const addVar = () =>
    update({ variables: [...config.variables, { key: '', value: '' }] });
  const removeVar = (i: number) =>
    update({ variables: config.variables.filter((_, idx) => idx !== i) });
  const setVar = (i: number, field: 'key' | 'value', value: string) => {
    const variables = config.variables.map((v, idx) =>
      idx === i ? { ...v, [field]: value } : v
    );
    update({ variables });
  };

  return (
    <>
      <SectionHeader title="Variables" onAdd={addVar} />
      {config.variables.map((v, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            label="Key"
            value={v.key}
            onChange={(e) => setVar(i, 'key', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Value"
            value={v.value}
            onChange={(e) => setVar(i, 'value', e.target.value)}
            sx={{ flex: 1 }}
          />
          <IconButton size="small" onClick={() => removeVar(i)} sx={{ color: 'grey.500' }}>
            <Iconify icon="solar:minus-circle-bold" width={18} />
          </IconButton>
        </Box>
      ))}
    </>
  );
}

// ── Small shared pieces ──────────────────────────────────────────────

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="subtitle2" sx={{ color: 'grey.300' }}>
        {title}
      </Typography>
      <IconButton size="small" onClick={onAdd} sx={{ color: 'primary.main' }}>
        <Iconify icon="solar:add-circle-bold" width={20} />
      </IconButton>
    </Box>
  );
}
