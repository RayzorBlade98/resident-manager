import { MenuItem, TextField } from '@mui/material';
import {
  Month,
  MonthYear,
  MonthYearString,
  convertMonthYearToString,
  getCurrentMonthYear,
  parseMonthYearString,
} from '_/types/date';
import { cartesianProduct, range } from '_/utils/array';
import React, { useState } from 'react';

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
 * Select component that provides a choice of `MonthYear` objects
 */
function MonthYearInput(props: MonthYearInputProps): JSX.Element {
  // Current input
  const [input, setInput] = useState<MonthYearString>(
    convertMonthYearToString(getCurrentMonthYear()),
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const monthYearString = event.target.value as MonthYearString;
    setInput(monthYearString);
    const monthYear = parseMonthYearString(monthYearString);
    props.onChange(monthYear);
  }

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
  const currentMonthYear: MonthYear = getCurrentMonthYear();

  // number of prior and future years possibly included in the selction
  const numPriorYears: number = Math.ceil(priorMonths / 12);
  const numFutureYears: number = Math.ceil(futureMonths / 12);

  const years: number[] = range(
    currentMonthYear.year - numPriorYears,
    currentMonthYear.year + numFutureYears,
  );
  const months: number[] = range(0, 11);

  // Create the cartesian product of all possible months and years and map them to their respective `MonthYearString`
  const monthYears = cartesianProduct(years, months).map<MonthYearString>(
    (yearMonth: number[]) =>
      `${Object.values(Month)[yearMonth[1]] as Month} ${yearMonth[0]}`,
  );

  // Find the index of the current month
  const currentMonthYearIndex: number = monthYears.findIndex(
    (monthYear: MonthYearString) =>
      monthYear === convertMonthYearToString(currentMonthYear),
  );

  // Only included the specified number of months around the current month
  return monthYears.slice(
    currentMonthYearIndex - priorMonths,
    currentMonthYearIndex + futureMonths + 1,
  );
}

export default MonthYearInput;
