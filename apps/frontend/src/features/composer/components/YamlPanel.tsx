import { useCallback, useRef, useState, useEffect } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Box, Typography, IconButton, Tooltip, Divider, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

type YamlMode = 'preview' | 'edit';

interface YamlPanelProps {
  yaml: string;
  open: boolean;
  onClose: () => void;
  onApplyYaml?: (yaml: string) => void;
  width?: number;
}

export function YamlPanel({ yaml, open, onClose, onApplyYaml, width = 420 }: YamlPanelProps) {
  const editorRef = useRef<any>(null);
  const [mode, setMode] = useState<YamlMode>('preview');
  const [editedYaml, setEditedYaml] = useState(yaml);

  // Keep editedYaml in sync when switching to edit mode or when yaml changes in preview mode
  useEffect(() => {
    if (mode === 'preview') {
      setEditedYaml(yaml);
    }
  }, [yaml, mode]);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleModeChange = useCallback((_: React.MouseEvent, newMode: YamlMode | null) => {
    if (newMode) {
      if (newMode === 'edit') {
        setEditedYaml(yaml);
      }
      setMode(newMode);
    }
  }, [yaml]);

  const handleApply = useCallback(() => {
    onApplyYaml?.(editedYaml);
  }, [editedYaml, onApplyYaml]);

  const handleCopy = useCallback(() => {
    const content = mode === 'edit' ? editedYaml : yaml;
    if (content) {
      navigator.clipboard.writeText(content);
    }
  }, [yaml, editedYaml, mode]);

  const handleDownload = useCallback(() => {
    const content = mode === 'edit' ? editedYaml : yaml;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    a.click();
    URL.revokeObjectURL(url);
  }, [yaml, editedYaml, mode]);

  if (!open) return null;

  const isEditing = mode === 'edit';
  const editorValue = isEditing ? editedYaml : yaml;

  return (
    <Box
      sx={{
        width,
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
        <Box sx={{ display: 'flex', gap: 0.25, alignItems: 'center' }}>
          <Tooltip title="Copy to clipboard">
            <IconButton size="small" onClick={handleCopy} disabled={!editorValue} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:copy-bold" width={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" onClick={handleDownload} disabled={!editorValue} sx={{ color: 'grey.400' }}>
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

      {/* Mode toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 0.75, borderBottom: 1, borderColor: 'grey.800' }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 1.5, py: 0.25, fontSize: '0.75rem', textTransform: 'none',
              color: 'grey.400', borderColor: 'grey.700',
              '&.Mui-selected': { color: 'primary.main', bgcolor: 'rgba(56, 189, 248, 0.08)' },
            },
          }}
        >
          <ToggleButton value="preview">Preview</ToggleButton>
          <ToggleButton value="edit">Edit</ToggleButton>
        </ToggleButtonGroup>
        {isEditing && onApplyYaml && (
          <Button
            size="small"
            variant="contained"
            onClick={handleApply}
            disabled={!editedYaml.trim()}
            startIcon={<Iconify icon="solar:check-circle-bold" width={16} />}
            sx={{ fontSize: '0.75rem', textTransform: 'none', py: 0.25 }}
          >
            Apply
          </Button>
        )}
      </Box>

      {/* Monaco Editor */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {editorValue ? (
          <Editor
            height="100%"
            language="yaml"
            value={editorValue}
            theme="vs-dark"
            onMount={handleEditorMount}
            onChange={(value) => { if (isEditing) setEditedYaml(value ?? ''); }}
            options={{
              readOnly: !isEditing,
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
