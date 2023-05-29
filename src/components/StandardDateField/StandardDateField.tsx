import { DateField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import '_/extensions/date/date.extension';

interface StandardDateFieldProps {
  /**
   * Label of the datepicker field
   */
  label: string;

  /**
   * Current date value of the field
   */
  value: Date | undefined;

  /**
   * Callback when selecting a date
   * @param date selected date
   */
  onChange: (date: Date | undefined) => void;

  /**
   * Error message displayed below the field
   */
  errorMessage?: string;

  /**
   * Id of the date field
   */
  id?: string;

  /**
   * Whether the field is required or not
   */
  required?: boolean;
}

/**
 * Generic date field component
 */
function StandardDateField(props: StandardDateFieldProps): JSX.Element {
  const onChange = (date: Dayjs | null) => {
    let parsedDate: Date | undefined = date?.toDate();
    if (parsedDate) {
      if (Number.isNaN(parsedDate.valueOf())) {
        parsedDate = undefined;
      } else {
        parsedDate = parsedDate.toUTC();
      }
    }
    props.onChange(parsedDate);
  };

  return (
    <DateField
      required={props.required}
      label={props.label}
      format="DD.MM.YYYY"
      value={props.value ? dayjs(props.value) : undefined}
      onChange={onChange}
      slotProps={{
        textField: {
          helperText: props.errorMessage,
          error: !!props.errorMessage,
          id: props.id,
        },
      }}
    />
  );
}

export default StandardDateField;
