import { InputAdornment, TextField } from '@mui/material';
import React from 'react';
import {
  CurrencyInCents,
  convertCurrencyCentsToEuros,
  convertCurrencyEurosToCents,
} from '../../../utils/currency/currency.utils';

interface CurrencyInputFieldProps {
  /**
   * Label of the input field
   */
  label: string;

  /**
   * Current currency value of the field
   */
  value: CurrencyInCents | undefined;

  /**
   * Callback when the input changes
   */
  onChange: (value: CurrencyInCents | undefined) => void;

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
    const value = event.target.value !== ''
      ? convertCurrencyEurosToCents(Number(event.target.value))
      : undefined;
    props.onChange(value);
  };

  return (
    <TextField
      fullWidth
      required={props.required}
      id={props.id}
      label={props.label}
      type="number"
      value={
        props.value ? convertCurrencyCentsToEuros(props.value).toString() : ''
      }
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
