import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps, FormControlLabel } from '@mui/material';

export interface SwitchProps extends MuiSwitchProps {
  /**
   * Label for the switch
   */
  label?: string;
}

/**
 * Custom Switch component built on MUI Switch
 */
export function Switch({ label, ...props }: SwitchProps) {
  if (label) {
    return <FormControlLabel control={<MuiSwitch {...props} />} label={label} />;
  }
  return <MuiSwitch {...props} />;
}
