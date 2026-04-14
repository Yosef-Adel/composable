import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { TEMPLATE_CATEGORIES } from '../data/serviceTemplates';
import type { ServiceConfig } from '../types';

interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  defaults: Partial<ServiceConfig>;
}

interface SaveTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  config: ServiceConfig;
}

const STORAGE_KEY = 'composable-custom-templates';

export function getCustomTemplates(): SavedTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteCustomTemplate(id: string) {
  const templates = getCustomTemplates().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function SaveTemplateDialog({ open, onClose, config }: SaveTemplateDialogProps) {
  const [name, setName] = useState(config.name || '');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Custom');

  const allCategories = [...new Set([...TEMPLATE_CATEGORIES, 'Custom'])];

  const handleSave = () => {
    const template: SavedTemplate = {
      id: `custom-${Date.now()}`,
      name: name.trim() || 'Untitled',
      description: description.trim(),
      category,
      icon: 'solar:bookmark-bold',
      defaults: {
        name: config.name,
        image: config.image,
        ports: config.ports,
        environment: config.environment,
        volumes: config.volumes,
        command: config.command,
        restart: config.restart,
      },
    };

    const existing = getCustomTemplates();
    existing.push(template);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Save as Template</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        <TextField
          label="Template Name"
          size="small"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <TextField
          label="Description (optional)"
          size="small"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {allCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!name.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
