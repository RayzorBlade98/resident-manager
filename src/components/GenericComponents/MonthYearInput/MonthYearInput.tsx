import { MenuItem, TextField } from '@mui/material';
import { range } from 'lodash';
import React, { useState } from 'react';
import {
  Month,
  MonthYear,
  MonthYearString,
  MonthYearUtils,
} from '_/types/date';
import { cartesianProduct } from '_/utils/array';

interface MonthYearInputProps {
  /**
   * Gets called when the input is changed.
   * @param input selected `MonthYear`
   */
  onChange: (input: MonthYear) => void;

  /**
   * Number of months before the current month that should be included into the selection. (Optional)
   *
   * `Default`: 6
   */
  priorMonthChoices?: number;

  /**
   * Number of months after the current month that should be included into the selection. (Optional)
   *
   * `Default`: 6
   */
  futureMonthChoices?: number;

  /**
   * Id of the component. (Optional)
   */
  id?: string;

  /**
   * Label of the select component. (Optional)
   */
  label?: string;

  /**
   * Error message of the component. (Optional)
   */
  error?: string;
}

/**
 * Creates a list of `MonthYearString` that contain the specified months
 * before and after the current month.
 * @param priorMonths number of months before the current month that should be included
 * @param futureMonths number of months after the current month that should be included
 * @returns list of created `MonthYearString`
 */
function createInputChoices(
  priorMonths: number,
  futureMonths: number,
): MonthYearString[] {
  const currentMonthYear: MonthYear = MonthYearUtils.getCurrentMonthYear();

  // number of prior and future years possibly included in the selction
  const numPriorYears: number = Math.ceil(priorMonths / 12);
  const numFutureYears: number = Math.ceil(futureMonths / 12);

  const years: number[] = range(
    currentMonthYear.year - numPriorYears,
    currentMonthYear.year + numFutureYears + 1,
  );
  const months: number[] = range(0, 12);

  // Create the cartesian product of all possible months and years and map them to their respective `MonthYearString`
  const monthYears = cartesianProduct(years, months).map<MonthYearString>(
    // eslint-disable-next-line max-len
    (yearMonth: number[]) => `${Object.values(Month)[yearMonth[1]] as Month} ${yearMonth[0]}`,
  );

  // Find the index of the current month
  const currentMonthYearIndex: number = monthYears.findIndex(
    // eslint-disable-next-line max-len
    (monthYear: MonthYearString) => monthYear === MonthYearUtils.toString(currentMonthYear),
  );

  // Only included the specified number of months around the current month
  return monthYears.slice(
    currentMonthYearIndex - priorMonths,
    currentMonthYearIndex + futureMonths + 1,
  );
}

/**
 * Select component that provides a choice of `MonthYear` objects
 */
function MonthYearInput(props: MonthYearInputProps): JSX.Element {
  // Current input
  const [input, setInput] = useState<MonthYearString>(
    MonthYearUtils.toString(MonthYearUtils.getCurrentMonthYear()),
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const monthYearString = event.target.value as MonthYearString;
    setInput(monthYearString);
    const monthYear = MonthYearUtils.parseString(monthYearString);
    props.onChange(monthYear);
  };

  const choices = createInputChoices(
    props.priorMonthChoices || 6,
    props.futureMonthChoices || 6,
  );

  return (
    <TextField
      id={props.id || 'monthYearInput'}
      select
      required
      label={props.label || ''}
      value={input}
      onChange={onChange}
      error={!!props.error}
      helperText={props.error || ''}
    >
      {choices.map((choice: MonthYearString) => (
        <MenuItem key={choice} value={choice}>
          {choice}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default MonthYearInput;
