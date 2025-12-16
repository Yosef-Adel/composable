import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

export interface TextFieldProps extends MuiTextFieldProps {
  // Add any custom props here
}

/**
 * Custom TextField component built on MUI TextField
 */
export function TextField(props: TextFieldProps) {
  return <MuiTextField {...props} />;
}
