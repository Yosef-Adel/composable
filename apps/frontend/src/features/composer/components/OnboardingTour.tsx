import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Popper } from '@mui/material';
import { Iconify } from '@composable/ui-kit';

const STORAGE_KEY = 'composable-onboarding-done';

interface TourStep {
  title: string;
  description: string;
  anchorId: string;
  placement: 'right' | 'left' | 'bottom' | 'top';
}

const STEPS: TourStep[] = [
  {
    title: 'Service Catalog',
    description: 'Welcome! This is the Service Catalog — drag services to add them to your canvas.',
    anchorId: 'onboarding-left-panel',
    placement: 'right',
  },
  {
    title: 'Properties Panel',
    description: 'Click a node to configure its properties here.',
    anchorId: 'onboarding-right-panel',
    placement: 'left',
  },
  {
    title: 'Canvas',
    description: 'Drag between colored handles to connect services.',
    anchorId: 'onboarding-canvas',
    placement: 'bottom',
  },
  {
    title: 'Toolbar',
    description: 'Press Ctrl+S to save, or use the toolbar buttons.',
    anchorId: 'onboarding-toolbar',
    placement: 'bottom',
  },
];

export function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = document.getElementById(STEPS[step].anchorId);
    setAnchorEl(el);
  }, [active, step]);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setActive(false);
  }, []);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);

  if (!active || !anchorEl) return null;

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={finish}
        sx={{
          position: 'fixed',
          inset: 0,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1400,
        }}
      />

      <Popper
        open
        anchorEl={anchorEl}
        placement={currentStep.placement}
        sx={{ zIndex: 1500 }}
        modifiers={[{ name: 'offset', options: { offset: [0, 12] } }]}
      >
        <Paper
          sx={{
            p: 2.5,
            maxWidth: 320,
            bgcolor: 'grey.900',
            border: 1,
            borderColor: 'primary.main',
            boxShadow: '0 0 24px rgba(59,130,246,0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Iconify icon="solar:info-circle-bold" width={20} sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle2" sx={{ color: 'primary.light' }}>
              {currentStep.title}
            </Typography>
            <Typography variant="caption" sx={{ ml: 'auto', color: 'grey.500' }}>
              {step + 1}/{STEPS.length}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: 'grey.300', mb: 2 }}>
            {currentStep.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" onClick={finish} sx={{ color: 'grey.400' }}>
              Skip
            </Button>
            <Button size="small" variant="contained" onClick={handleNext}>
              {isLast ? 'Done' : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Popper>
    </>
  );
}
