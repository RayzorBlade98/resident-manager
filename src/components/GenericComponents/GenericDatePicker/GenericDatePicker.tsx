import { TextField } from '@mui/material';
import React from 'react';

interface GenericDatePickerProps {
  /**
   * Id of the datepicker field
   */
  id: string;

  /**
   * Label of the datepicker field
   */
  label: string;

  /**
   * Callback when selecting a date
   * @param date selected date
   */
  onChange: (date: Date) => void;

  /**
   * Errormessage that should be displayed
   */
  errorMessage?: string;
}

/**
 * Generic date picker component
 */
function GenericDatePicker(props: GenericDatePickerProps): JSX.Element {
  function convertDateToInput(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  return (
    <TextField
      id={props.id}
      label={props.label}
      type="date"
      required
      defaultValue={convertDateToInput(new Date())}
      onChange={(event) => props.onChange(new Date(event.target.value))}
      InputLabelProps={{
        shrink: true,
      }}
      error={!!props.errorMessage}
      helperText={props.errorMessage || ''}
    />
  );
}

export default GenericDatePicker;
