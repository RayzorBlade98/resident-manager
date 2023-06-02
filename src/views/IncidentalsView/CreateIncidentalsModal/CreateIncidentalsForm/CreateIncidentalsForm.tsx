import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import { DeductionType } from '../../../../types/incidentals';
import {
  CreateIncidentalsInput,
  createIncidentalsFormValidationSelector,
} from '../../states/create_incidentals_state';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';

/**
 * Form to submit new incidentals
 */
function CreateIncidentalsForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    createIncidentalsFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;

  function onChange<T>(field: keyof CreateIncidentalsInput, value: T): void {
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
          value={formInput.currentPrice}
          onChange={(currentPrice) => {
            onChange<number | undefined>('currentPrice', currentPrice);
          }}
          errorMessage={errors.currentPrice}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="deductionTypeLabel">Abrechnungsart</InputLabel>
          <Select
            required
            labelId="deductionTypeLabel"
            id="deductionType"
            label="Abrechnungsart"
            value={formInput.deductionType}
            onChange={(event) => {
              onChange<DeductionType>(
                'deductionType',
                event.target.value as DeductionType,
              );
            }}
          >
            {Object.values(DeductionType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default CreateIncidentalsForm;
