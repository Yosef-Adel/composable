import { LinearProgress as MuiLinearProgress, CircularProgress as MuiCircularProgress, LinearProgressProps as MuiLinearProgressProps, CircularProgressProps as MuiCircularProgressProps } from '@mui/material';

export interface LinearProgressProps extends MuiLinearProgressProps {
  // Add any custom props here
}

export interface CircularProgressProps extends MuiCircularProgressProps {
  // Add any custom props here
}

/**
 * Custom LinearProgress component built on MUI LinearProgress
 */
export function LinearProgress(props: LinearProgressProps) {
  return <MuiLinearProgress {...props} />;
}

/**
 * Custom CircularProgress component built on MUI CircularProgress
 */
export function CircularProgress(props: CircularProgressProps) {
  return <MuiCircularProgress {...props} />;
}
