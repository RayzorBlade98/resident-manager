import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import {
  addRentPaymentFormValidationSelector,
  RentPaymentInput,
} from '_/components/shared/RentInformationTable/states/add_rent_payment_state';

/**
 * Form to submit payment information
 */
function AddRentPaymentForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    addRentPaymentFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;

  function onChange<T>(field: keyof RentPaymentInput, value: T): void {
    setFormValidationState((state) => ({
      ...state,
      formInput: {
        ...state.formInput,
        [field]: value,
      },
    }));
  }

  return (
    <form>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <CurrencyInputField
            required
            id="paymentAmount"
            label="Zahlungssumme"
            value={formInput.paymentAmount}
            onChange={(value) => {
              onChange<number | undefined>('paymentAmount', value);
            }}
            errorMessage={errors.paymentAmount}
          />
        </Grid>
        <Grid item xs={12}>
          <StandardDateField
            required
            id="paymentDate"
            label="Zahlungsempfang"
            value={formInput.paymentDate}
            onChange={(value) => {
              onChange<Date | undefined>('paymentDate', value);
            }}
            errorMessage={errors.paymentDate}
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default AddRentPaymentForm;
