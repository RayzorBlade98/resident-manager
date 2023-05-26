import { DateField } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import React from 'react';

interface StandardDateFieldProps {
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
   * Whether the date field should be shown in error state
   */
  error?: boolean;
}

/**
 * Generic date field component
 */
function StandardDateField(props: StandardDateFieldProps): JSX.Element {
  return (
    <DateField
      required
      label={props.label}
      format="DD.MM.YYYY"
      onChange={(date) => props.onChange((date as Dayjs).toDate())}
      color={props.error ? 'error' : 'primary'}
    />
  );
}

export default StandardDateField;
