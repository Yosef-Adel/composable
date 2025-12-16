import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@mui/material';

export interface TooltipProps extends MuiTooltipProps {
  // Add any custom props here
}

/**
 * Custom Tooltip component built on MUI Tooltip
 */
export function Tooltip(props: TooltipProps) {
  return <MuiTooltip {...props} />;
}
