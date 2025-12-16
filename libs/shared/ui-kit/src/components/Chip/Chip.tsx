import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';

export interface ChipProps extends MuiChipProps {
  // Add any custom props here
}

/**
 * Custom Chip component built on MUI Chip
 */
export function Chip(props: ChipProps) {
  return <MuiChip {...props} />;
}
