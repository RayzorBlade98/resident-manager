import { DateField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import '_/extensions/date/date.extension';
import MonthYear from '_/extensions/date/month_year.extension';

interface MonthYearDateFieldProps {
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
  onChange: (date: MonthYear | undefined) => void;

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
function MonthYearDateField(props: MonthYearDateFieldProps): JSX.Element {
  const onChange = (date: Dayjs | null) => {
    let parsedDate: Date | undefined = date?.toDate();
    if (parsedDate) {
      if (Number.isNaN(parsedDate.valueOf())) {
        parsedDate = undefined;
      } else {
        parsedDate = MonthYear.fromDate(parsedDate.toUTC());
      }
    }
    props.onChange(parsedDate as MonthYear);
  };

  return (
    <DateField
      required={props.required}
      label={props.label}
      format="MM.YYYY"
      defaultValue={props.value ? dayjs(props.value) : undefined}
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

export default MonthYearDateField;
