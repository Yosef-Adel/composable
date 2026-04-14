import { Radio as MuiRadio, RadioProps as MuiRadioProps, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

export interface RadioProps extends MuiRadioProps {
  /**
   * Label for the radio button
   */
  label?: string;
}

export interface RadioGroupProps {
  /**
   * Label for the radio group
   */
  label?: string;
  /**
   * Radio options
   */
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  /**
   * Default value
   */
  defaultValue?: string;
  /**
   * Value
   */
  value?: string;
  /**
   * onChange handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Name for the radio group
   */
  name?: string;
}

/**
 * Custom Radio component built on MUI Radio
 */
export function Radio({ label, ...props }: RadioProps) {
  if (label) {
    return <FormControlLabel control={<MuiRadio {...props} />} label={label} />;
  }
  return <MuiRadio {...props} />;
}

/**
 * Custom RadioGroup component
 */
export function RadioGroupComponent({ label, options, defaultValue, value, onChange, name }: RadioGroupProps) {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup defaultValue={defaultValue} value={value} onChange={onChange} name={name}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<MuiRadio />}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
