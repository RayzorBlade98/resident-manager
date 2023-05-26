import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { CurrencyInCents, convertCurrencyEurosToCents } from '_/utils/currency';

interface CurrencyInputFieldProps {
  /**
   * Id of the input field
   */
  id: string;

  /**
   * Label of the input field
   */
  label: string;

  /**
   * Callback when the input changes
   */
  onChange: (value: CurrencyInCents | undefined) => void;

  /**
   * Error message that is getting displayed
   */
  errorMessage?: string;
}

/**
 * Generic currency input field
 */
function CurrencyInputField(props: CurrencyInputFieldProps): JSX.Element {
  /**
   * Parses the input to a number and calls the callback provided by the props
   */
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    let value: number | undefined;
    if (event.target.value === '') {
      value = undefined;
    } else {
      value = Number(event.target.value);
      value = Number.isNaN(value)
        ? undefined
        : convertCurrencyEurosToCents(value);
    }
    props.onChange(value);
  };

  return (
    <TextField
      id={props.id}
      label={props.label}
      type="number"
      required
      onChange={onChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">€</InputAdornment>,
      }}
      error={!!props.errorMessage}
      helperText={props.errorMessage || ''}
    />
  );
}

export default CurrencyInputField;
