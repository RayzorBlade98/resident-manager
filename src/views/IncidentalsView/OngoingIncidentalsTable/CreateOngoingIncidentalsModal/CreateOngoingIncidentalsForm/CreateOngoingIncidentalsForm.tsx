import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  CreateOngoingIncidentalsInput,
  createOngoingIncidentalsFormValidationSelector,
} from '../../states/create_ongoing_incidentals_state';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import DeductionTypeSelect from '_/components/form/DeductionTypeSelect/DeductionTypeSelect';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import { DeductionType } from '_/models/incidentals/deduction_type';

/**
 * Form to submit new ongoing incidentals
 */
function CreateOngoingIncidentalsForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    createOngoingIncidentalsFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;

  function onChange<T>(
    field: keyof CreateOngoingIncidentalsInput,
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
          value={formInput.currentCost}
          onChange={(currentPrice) => {
            onChange<number | undefined>('currentCost', currentPrice);
          }}
          errorMessage={errors.currentCost}
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
        <NumberTextField
          required
          label="Abrechnungszeitraum"
          id="invoiceInterval"
          value={formInput.invoiceInterval}
          onChange={(invoiceInterval) => {
            onChange<number | undefined>('invoiceInterval', invoiceInterval);
          }}
          errorMessage={errors.invoiceInterval}
          min={1}
          max={12}
          onlyInteger
        />
      </Grid>
    </Grid>
  );
}

export default CreateOngoingIncidentalsForm;
