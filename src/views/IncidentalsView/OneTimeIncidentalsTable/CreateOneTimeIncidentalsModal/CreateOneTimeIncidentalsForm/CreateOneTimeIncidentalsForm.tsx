import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  CreateOneTimeIncidentalsInput,
  createOneTimeIncidentalsFormValidationSelector,
} from '../../states/create_one_time_incidentals_state';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import DeductionTypeSelect from '_/components/form/DeductionTypeSelect/DeductionTypeSelect';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import { DeductionType } from '_/models/incidentals/deduction_type';

/**
 * Form to submit new ongoing incidentals
 */
function CreateOneTimeIncidentalsForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    createOneTimeIncidentalsFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;

  function onChange<T>(
    field: keyof CreateOneTimeIncidentalsInput,
    value: T,
  ): void {
    setFormValidationState((state) => ({
      ...state,
      formInput: { ...state.formInput, [field]: value },
    }));
  }

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          required
          id="name"
          label="Name"
          variant="outlined"
          value={formInput.name}
          onChange={(event) => {
            onChange<string>('name', event.target.value);
          }}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid item xs={6}>
        <CurrencyInputField
          required
          id="cost"
          label="Kosten"
          value={formInput.cost}
          onChange={(cost) => {
            onChange<number | undefined>('cost', cost);
          }}
          errorMessage={errors.cost}
        />
      </Grid>
      <Grid item xs={6}>
        <DeductionTypeSelect
          value={formInput.deductionType}
          onChange={(deductionType) => {
            onChange<DeductionType>('deductionType', deductionType);
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <StandardDateField
          required
          label="Rechnungsdatum"
          id="billingDate"
          value={formInput.billingDate}
          onChange={(date) => {
            onChange<Date | undefined>('billingDate', date);
          }}
          errorMessage={errors.billingDate}
        />
      </Grid>
      <Grid item xs={6}>
        <StandardDateField
          label="Zahlungsdatum"
          id="paymentDate"
          value={formInput.paymentDate}
          onChange={(date) => {
            onChange<Date | undefined>('paymentDate', date);
          }}
          errorMessage={errors.paymentDate}
        />
      </Grid>
    </Grid>
  );
}

export default CreateOneTimeIncidentalsForm;
