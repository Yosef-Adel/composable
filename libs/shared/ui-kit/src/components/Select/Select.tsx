import { Select as MuiSelect, SelectProps as MuiSelectProps, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ReactNode } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<MuiSelectProps, 'children'> {
  /**
   * Select options
   */
  options: SelectOption[];
  /**
   * Label for the select
   */
  label?: string;
}

/**
 * Custom Select component built on MUI Select
 */
export function Select({ options, label, ...props }: SelectProps) {
  const labelId = label ? `${props.id || 'select'}-label` : undefined;

  return (
    <FormControl fullWidth={props.fullWidth}>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect labelId={labelId} label={label} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
