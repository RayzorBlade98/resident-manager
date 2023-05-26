import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  addRentPaymentFormErrorSelector,
  addRentPaymentFormInputSelector,
} from '../../states/add_rent_payment_state';
import CurrencyInputField from '_/components/GenericComponents/CurrencyInputField/CurrencyInputField';
import GenericDatePicker from '_/components/GenericComponents/GenericDatePicker/GenericDatePicker';

/**
 *
 */
function AddRentPaymentForm(): JSX.Element {
  const setFormInput = useSetRecoilState(addRentPaymentFormInputSelector);
  const errors = useRecoilValue(addRentPaymentFormErrorSelector);

  const onChangePaymentAmount = (value: number | undefined) => {
    setFormInput((input) => ({ ...input, paymentAmount: value }));
  };

  const onChangePaymentDate = (date: Date) => {
    setFormInput((input) => ({ ...input, paymentDate: date }));
  };

  return (
    <form>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <CurrencyInputField
            id="paymentAmount"
            label="Zahlungssumme"
            onChange={onChangePaymentAmount}
            errorMessage={errors.paymentAmount}
          />
        </Grid>
        <Grid item xs={12}>
          <GenericDatePicker
            id="paymentDate"
            label="Zahlungsempfang"
            onChange={onChangePaymentDate}
            errorMessage={errors.paymentDate}
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default AddRentPaymentForm;
