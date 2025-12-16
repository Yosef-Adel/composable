import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

export interface IconButtonProps extends MuiIconButtonProps {
  // Add any custom props here
}

/**
 * Custom IconButton component built on MUI IconButton
 */
export function IconButton(props: IconButtonProps) {
  return <MuiIconButton {...props} />;
}
