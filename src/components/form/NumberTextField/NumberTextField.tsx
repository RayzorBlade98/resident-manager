import { TextField } from '@mui/material';
import React from 'react';

interface NumberTextFieldProps {
  /**
   * Label of the input field
   */
  label: string;

  /**
   * Current number value of the field
   */
  value: number | undefined;

  /**
   * Callback when the input changes
   */
  onChange: (value: number | undefined) => void;

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
   * Minimal allowed number
   */
  min?: number;

  /**
   * Maximal allowed number
   */
  max?: number;

  /**
   * Whether only integer values are allowed
   */
  onlyInteger?: boolean;
}

/**
 * Generic number input field
 */
function NumberTextField(props: NumberTextFieldProps): JSX.Element {
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    if (event.target.value === '') {
      props.onChange(undefined);
      return;
    }

    let value = Number(event.target.value);

    // Convert float to int
    if (props.onlyInteger) {
      value = Math.floor(value);
    }

    // Cap value
    if (props.min !== undefined && value < props.min) {
      value = props.min;
    }
    if (props.max !== undefined && value > props.max) {
      value = props.max;
    }

    props.onChange(value);
  };

  return (
    <TextField
      fullWidth
      required={props.required}
      label={props.label}
      id={props.id}
      type="number"
      value={props.value ?? ''}
      onChange={onChange}
      error={!!props.errorMessage}
      helperText={props.errorMessage}
      inputProps={{ min: props.min, max: props.max }}
    />
  );
}

export default NumberTextField;
