import { useCallback, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Box, Typography, IconButton, Tooltip, Divider } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

interface YamlPanelProps {
  yaml: string;
  open: boolean;
  onClose: () => void;
}

export function YamlPanel({ yaml, open, onClose }: YamlPanelProps) {
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopy = useCallback(() => {
    if (yaml) {
      navigator.clipboard.writeText(yaml);
    }
  }, [yaml]);

  const handleDownload = useCallback(() => {
    if (!yaml) return;
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    a.click();
    URL.revokeObjectURL(url);
  }, [yaml]);

  if (!open) return null;

  return (
    <Box
      sx={{
        width: 420,
        borderLeft: 1,
        borderColor: 'grey.800',
        bgcolor: 'rgba(15, 23, 42, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'grey.800',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:code-bold" width={18} sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>
            docker-compose.yml
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <Tooltip title="Copy to clipboard">
            <IconButton size="small" onClick={handleCopy} disabled={!yaml} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:copy-bold" width={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" onClick={handleDownload} disabled={!yaml} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:download-bold" width={16} />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'grey.700' }} />
          <Tooltip title="Close panel">
            <IconButton size="small" onClick={onClose} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:close-circle-line-duotone" width={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Monaco Editor */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {yaml ? (
          <Editor
            height="100%"
            language="yaml"
            value={yaml}
            theme="vs-dark"
            onMount={handleEditorMount}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              folding: true,
              automaticLayout: true,
              padding: { top: 8, bottom: 8 },
              renderLineHighlight: 'gutter',
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
            }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Iconify icon="solar:code-bold" width={40} sx={{ color: 'grey.700', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Add services to see YAML
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
