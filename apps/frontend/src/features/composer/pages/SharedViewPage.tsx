import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, AppBar, Toolbar, Typography, Chip, CircularProgress } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import { ServiceNode } from '../components/ServiceNode';
import { YamlPanel } from '../components/YamlPanel';
import { generateYaml } from '../utils/yamlGenerator';

const nodeTypes = {
  service: ServiceNode,
  volume: ServiceNode,
  network: ServiceNode,
  environment: ServiceNode,
};

interface SharedProject {
  name: string;
  description: string;
  composerData: {
    nodes: any[];
    edges: any[];
    nodeConfigs: Record<string, any>;
  };
}

function SharedViewInner() {
  const { token } = useParams<{ token: string }>();
  const [project, setProject] = useState<SharedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showYaml, setShowYaml] = useState(false);

  useEffect(() => {
    if (!token) return;
    const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
    fetch(`${baseUrl}/shared/${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Project not found');
        const json = await res.json();
        setProject(json.data ?? json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const nodes = project?.composerData?.nodes ?? [];
  const edges = project?.composerData?.edges ?? [];
  const nodeConfigs = project?.composerData?.nodeConfigs ?? {};
  const yaml = useMemo(() => generateYaml(nodeConfigs, edges), [nodeConfigs, edges]);

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a', flexDirection: 'column', gap: 2 }}>
        <Iconify icon="solar:link-broken-bold" width={64} sx={{ color: 'grey.600' }} />
        <Typography variant="h5" color="text.secondary">
          {error || 'Project not found'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This share link may have been revoked or doesn't exist.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
      <AppBar position="static" sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', borderBottom: 1, borderColor: 'grey.800' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify icon="solar:box-bold" width={20} sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>{project.name}</Typography>
              <Typography variant="caption" color="text.secondary">Shared Compose Project</Typography>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Chip label="Read Only" size="small" sx={{ mr: 1, bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }} />
          <Chip
            label={showYaml ? 'Hide YAML' : 'Show YAML'}
            size="small"
            onClick={() => setShowYaml((v) => !v)}
            sx={{ cursor: 'pointer', bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            style={{ background: '#0f172a' }}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
            <Controls style={{ background: '#1e293b', border: '1px solid #334155' }} />
            <MiniMap style={{ background: '#1e293b', border: '1px solid #334155' }} nodeColor="#3b82f6" maskColor="rgba(15, 23, 42, 0.7)" />
          </ReactFlow>
        </Box>

        <YamlPanel yaml={yaml} open={showYaml} onClose={() => setShowYaml(false)} />
      </Box>
    </Box>
  );
}

export function SharedViewPage() {
  return (
    <ReactFlowProvider>
      <SharedViewInner />
    </ReactFlowProvider>
  );
}
