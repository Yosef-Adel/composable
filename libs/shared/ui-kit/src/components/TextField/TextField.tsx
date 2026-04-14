import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material';

export type TextFieldProps = MuiTextFieldProps & {
  // Add any custom props here
};

/**
 * Custom TextField component built on MUI TextField
 */
export function TextField(props: TextFieldProps) {
  return <MuiTextField {...props} />;
}
