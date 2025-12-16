import { Divider as MuiDivider, DividerProps as MuiDividerProps } from '@mui/material';

export interface DividerProps extends MuiDividerProps {
  // Add any custom props here
}

/**
 * Custom Divider component built on MUI Divider
 */
export function Divider(props: DividerProps) {
  return <MuiDivider {...props} />;
}
