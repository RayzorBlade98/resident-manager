import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  addRentPaymentFormErrorSelector,
  addRentPaymentFormInputSelector,
} from '../../states/add_rent_payment_state';
import CurrencyInputField from '_/components/CurrencyInputField/CurrencyInputField';
import StandardDateField from '_/components/StandardDateField/StandardDateField';

/**
 * Form to submit payment information
 */
function AddRentPaymentForm(): JSX.Element {
  const [formInput, setFormInput] = useRecoilState(
    addRentPaymentFormInputSelector,
  );
  const errors = useRecoilValue(addRentPaymentFormErrorSelector);

  const onChangePaymentAmount = (value: number | undefined) => {
    setFormInput((input) => ({ ...input, paymentAmount: value }));
  };

  const onChangePaymentDate = (date: Date | undefined) => {
    setFormInput((input) => ({ ...input, paymentDate: date }));
  };

  return (
    <form>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <CurrencyInputField
            required
            id="paymentAmount"
            label="Zahlungssumme"
            value={formInput.paymentAmount}
            onChange={onChangePaymentAmount}
            errorMessage={errors.paymentAmount}
          />
        </Grid>
        <Grid item xs={12}>
          <StandardDateField
            required
            id="paymentDate"
            label="Zahlungsempfang"
            value={formInput.paymentDate}
            onChange={onChangePaymentDate}
            errorMessage={errors.paymentDate}
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default AddRentPaymentForm;
