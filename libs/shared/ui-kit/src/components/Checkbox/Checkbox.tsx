import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, FormControlLabel } from '@mui/material';

export interface CheckboxProps extends MuiCheckboxProps {
  /**
   * Label for the checkbox
   */
  label?: string;
}

/**
 * Custom Checkbox component built on MUI Checkbox
 */
export function Checkbox({ label, ...props }: CheckboxProps) {
  if (label) {
    return <FormControlLabel control={<MuiCheckbox {...props} />} label={label} />;
  }
  return <MuiCheckbox {...props} />;
}
