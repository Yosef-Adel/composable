import { useState, useMemo } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Divider, Chip, Collapse } from '@mui/material';
import { Iconify } from '@composable/ui-kit';
import type { BuildingBlockType, ServiceConfig } from '../types';
import { SERVICE_TEMPLATES, TEMPLATE_CATEGORIES, type ServiceTemplate } from '../data/serviceTemplates';

interface ServicePaletteProps {
  onAddService: (serviceType: BuildingBlockType, template?: Partial<ServiceConfig>) => void;
}

const infraBlocks = [
  {
    id: 'volume' as const,
    name: 'Volume',
    icon: 'solar:database-bold',
    color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    description: 'Named volume',
  },
  {
    id: 'network' as const,
    name: 'Network',
    icon: 'solar:wi-fi-router-bold',
    color: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
    description: 'Docker network',
  },
  {
    id: 'environment' as const,
    name: 'Environment',
    icon: 'solar:box-minimalistic-bold',
    color: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    description: 'Environment group',
  },
];

function TemplateCard({ template, onClick }: { template: ServiceTemplate; onClick: () => void }) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 1.25,
        bgcolor: 'rgba(30, 41, 59, 0.5)',
        border: 1,
        borderColor: 'grey.700',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(59, 130, 246, 0.08)',
          transform: 'translateX(2px)',
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          borderRadius: 0.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Iconify icon={template.icon} width={18} sx={{ color: 'white' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
          {template.name}
        </Typography>
        <Typography variant="caption" noWrap color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          {template.description}
        </Typography>
      </Box>
    </Paper>
  );
}

export function ServicePalette({ onAddService }: ServicePaletteProps) {
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    if (!search.trim()) return SERVICE_TEMPLATES;
    const q = search.toLowerCase();
    return SERVICE_TEMPLATES.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [search]);

  const groupedTemplates = useMemo(() => {
    const groups = new Map<string, ServiceTemplate[]>();
    for (const cat of TEMPLATE_CATEGORIES) {
      const items = filteredTemplates.filter((t) => t.category === cat);
      if (items.length > 0) groups.set(cat, items);
    }
    return groups;
  }, [filteredTemplates]);

  const handleTemplateClick = (template: ServiceTemplate) => {
    onAddService('service', template.defaults);
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <Box
      sx={{
        width: 280,
        borderRight: 1,
        borderColor: 'grey.800',
        bgcolor: 'rgba(15, 23, 42, 0.5)',
        overflow: 'auto',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Typography variant="h6" sx={{ mb: 0.5, fontSize: '1rem' }}>
          Service Catalog
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          Click to add to canvas
        </Typography>

        <TextField
          size="small"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-bold" width={16} sx={{ color: 'grey.500' }} />
                </InputAdornment>
              ),
              sx: { fontSize: '0.8rem', bgcolor: 'rgba(30, 41, 59, 0.5)' },
            },
          }}
        />
      </Box>

      {/* Service Templates */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 1 }}>
        {search.trim() ? (
          // Flat list when searching
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {filteredTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} onClick={() => handleTemplateClick(t)} />
            ))}
            {filteredTemplates.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No services found
              </Typography>
            )}
          </Box>
        ) : (
          // Categorized accordion
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...groupedTemplates.entries()].map(([category, templates]) => (
              <Box key={category}>
                <Box
                  onClick={() => toggleCategory(category)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    py: 0.5,
                    '&:hover': { '& .cat-label': { color: 'grey.200' } },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography className="cat-label" variant="caption" sx={{ fontWeight: 600, color: 'grey.400', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                      {category}
                    </Typography>
                    <Chip label={templates.length} size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'rgba(255,255,255,0.06)' }} />
                  </Box>
                  <Iconify
                    icon="solar:alt-arrow-down-line-duotone"
                    width={14}
                    sx={{ color: 'grey.500', transform: expandedCategory === category ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </Box>
                <Collapse in={expandedCategory === category}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, pt: 0.5, pb: 1 }}>
                    {templates.map((t) => (
                      <TemplateCard key={t.id} template={t} onClick={() => handleTemplateClick(t)} />
                    ))}
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'grey.800' }} />

      {/* Infrastructure blocks */}
      <Box sx={{ p: 2, pt: 1.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'grey.400', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
          Infrastructure
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {infraBlocks.map((block) => (
            <Paper
              key={block.id}
              onClick={() => onAddService(block.id)}
              sx={{
                flex: 1,
                p: 1,
                bgcolor: 'rgba(30, 41, 59, 0.5)',
                border: 1,
                borderColor: 'grey.700',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
                '&:hover': { borderColor: 'grey.500', transform: 'translateY(-1px)' },
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  background: block.color,
                  borderRadius: 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 0.5,
                }}
              >
                <Iconify icon={block.icon} width={14} sx={{ color: 'white' }} />
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'grey.400' }}>
                {block.name}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Tips */}
      <Paper
        sx={{
          mx: 2,
          mb: 2,
          p: 1.5,
          bgcolor: 'rgba(59, 130, 246, 0.06)',
          border: 1,
          borderColor: 'rgba(59, 130, 246, 0.15)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'primary.light', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, fontWeight: 600, fontSize: '0.7rem' }}>
          <Iconify icon="solar:lightbulb-bolt-bold" width={14} />
          Tips
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2, '& li': { mb: 0.25, fontSize: '0.65rem', color: 'grey.400' } }}>
          <li>Drag from colored dots to connect</li>
          <li>Volume/Network connect to matching handles</li>
          <li>Click a node to edit properties</li>
        </Box>
      </Paper>
    </Box>
  );
}
