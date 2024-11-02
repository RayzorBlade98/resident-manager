import { TextField } from '@mui/material';
import React from 'react';

interface TextInputFieldProps {
  /**
   * Label of the input field
   */
  label: string;

  /**
   * Current value of the field
   */
  value: string | undefined;

  /**
   * Callback when the input changes
   */
  onChange: (value: string | undefined) => void;

  /**
   * Error message that is getting displayed
   */
  errorMessage?: string;

  /**
   * Id of the input field
   */
  id?: string;

  /**
   * Whether the field is required or not
   */
  required?: boolean;

  /**
   * Multiline configuration
   */
  multiline?: {
    /**
     * Whether to enable multiline
     */
    enabled: true

    /**
     * Number of rows to display
     */
    rows?: number
  }
}

/**
 * Generic text input field
 */
function TextInputField(props: TextInputFieldProps): JSX.Element {
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    props.onChange(event.target.value === '' ? undefined : event.target.value);
  };

  return (
    <TextField
      fullWidth
      required={props.required}
      label={props.label}
      id={props.id}
      value={props.value ?? ''}
      onChange={onChange}
      error={!!props.errorMessage}
      helperText={props.errorMessage}
      multiline={props.multiline?.enabled}
      rows={props.multiline?.rows}
    />
  );
}

export default TextInputField;
