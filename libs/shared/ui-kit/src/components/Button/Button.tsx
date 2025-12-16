import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  /**
   * Button label
   */
  label: string;
}

/**
 * Custom Button component built on MUI Button
 */
export function Button({ label, ...props }: ButtonProps) {
  return (
    <MuiButton {...props}>
      {label}
    </MuiButton>
  );
}
