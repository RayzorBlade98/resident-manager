import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';

interface SelectFieldProps<T extends string | number | symbol> {
  /**
   * Label of the select field
   */
  label: string;

  /**
   * Id of the select field
   */
  id: string;

  /**
   * Currently selected value
   */
  value: T | undefined;

  /**
   * Callback when a value is selected
   */
  onChange: (value: T) => void;

  /**
   * Record of the selectable values to their display labels
   */
  values: Record<T, string>;

  /**
   * Error message that is getting displayed
   */
  errorMessage?: string;

  /**
   * Whether the field is required or not
   */
  required?: boolean;
}

/**
 * Select component to choose a value from a given list of values
 */
function SelectField<T extends string | number | symbol>(
  props: SelectFieldProps<T>,
): JSX.Element {
  const labelId = `${props.id}Label`;
  return (
    <FormControl fullWidth error={!!props.errorMessage}>
      <InputLabel id={labelId}>{props.label}</InputLabel>
      <Select
        required={props.required}
        fullWidth
        labelId={labelId}
        id={props.id}
        label={props.label}
        value={props.value ?? ''}
        onChange={(event) => props.onChange(event.target.value as T)}
      >
        {Object.entries(props.values).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label as string}
          </MenuItem>
        ))}
      </Select>
      {props.errorMessage && (
        <FormHelperText>{props.errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
}

export default SelectField;
