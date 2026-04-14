import { useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Box, Typography, IconButton, Tooltip, Divider } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

interface DocsPanelProps {
  docs: string;
  open: boolean;
  onClose: () => void;
  width?: number;
}

export function DocsPanel({ docs, open, onClose, width = 420 }: DocsPanelProps) {
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docs);
  };

  const handleDownload = () => {
    const blob = new Blob([docs], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>
          Documentation
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Copy">
            <IconButton size="small" onClick={handleCopy} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:copy-bold" width={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download README.md">
            <IconButton size="small" onClick={handleDownload} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:download-bold" width={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose} sx={{ color: 'grey.400' }}>
              <Iconify icon="solar:close-circle-bold" width={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* Editor */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language="markdown"
          value={docs}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            lineNumbers: 'off',
            renderLineHighlight: 'none',
            padding: { top: 12 },
          }}
        />
      </Box>
    </Box>
  );
}
