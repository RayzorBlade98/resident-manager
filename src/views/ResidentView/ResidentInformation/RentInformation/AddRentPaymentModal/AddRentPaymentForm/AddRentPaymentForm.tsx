import { Grid, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  addRentPaymentFormErrorSelector,
  addRentPaymentFormInputSelector,
} from '../../states/add_rent_payment_state';
import GenericDatePicker from '_/components/GenericComponents/GenericDatePicker/GenericDatePicker';
import { convertCurrencyEurosToCents } from '_/utils/currency';

function AddRentPaymentForm(): JSX.Element {
  const setFormInput = useSetRecoilState(addRentPaymentFormInputSelector);
  const errors = useRecoilValue(addRentPaymentFormErrorSelector);

  function setPaymentField<T>(field: string, value: T): void {
    setFormInput((input) => ({ ...input, [field]: value }));
  }

  function paymentUpdater<T>(field: string) {
    function updatePayment(event: React.ChangeEvent<HTMLInputElement>): void {
      let value: number | string = event.target.value;
      if (field === 'paymentAmount') {
        value = Number(value);
        value = convertCurrencyEurosToCents(value);
      }
      setPaymentField<T>(field, value as T);
    }
    return updatePayment;
  }

  return (
    <form>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <TextField
            id="paymentAmount"
            label="Zahlungssumme"
            type="number"
            required
            onChange={paymentUpdater<number>('paymentAmount')}
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            }}
            error={!!errors.paymentAmount}
            helperText={errors.paymentAmount || ''}
          />
        </Grid>
        <Grid item xs={12}>
          <GenericDatePicker
            id="paymentDate"
            label="Zahlungsempfang"
            // eslint-disable-next-line max-len
            onChange={(date: Date) => setPaymentField<Date>('paymentDate', date)}
            errorMessage={errors.paymentDate}
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default AddRentPaymentForm;
