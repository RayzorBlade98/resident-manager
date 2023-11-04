import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  InitializationInput,
  initializationFormValidationSelector,
} from '../states/initialization_state';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

const styles = {
  container: {
    width: '100%',
    paddingTop: '20px',
    paddingBottom: '20px',
  },
};

/**
 * Form to submit new property
 */
function InitializationForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    initializationFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;

  function onChange<T>(field: keyof InitializationInput, value: T): void {
    setFormValidationState((state) => ({
      ...state,
      formInput: { ...state.formInput, [field]: value as number },
    }));
  }

  return (
    <>
      <h1>Immobilieninformationen</h1>
      <Grid container columnSpacing={2} rowSpacing={2} sx={styles.container}>
        <Grid item xs={3}>
          <NumberTextField
            required
            id="numberOfApartments"
            label="Anzahl der Wohnungen"
            value={formInput.numberOfApartments}
            onChange={(amount) => {
              onChange<number | undefined>('numberOfApartments', amount);
            }}
            errorMessage={errors.numberOfApartments}
            min={1}
          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} rowSpacing={2} sx={styles.container}>
        <Grid item xs={3}>
          <NumberTextField
            required
            id="zipCode"
            label="Postleitzahl"
            value={formInput.zipCode}
            onChange={(zipCode) => {
              onChange<number | undefined>('zipCode', zipCode);
            }}
            errorMessage={errors.zipCode}
            min={1}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="city"
            label="Stadt"
            value={formInput.city}
            onChange={(event) => {
              onChange<string>('city', event.target.value);
            }}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="street"
            label="Straße"
            value={formInput.street}
            onChange={(event) => {
              onChange<string>('street', event.target.value);
            }}
            error={!!errors.street}
            helperText={errors.street}
          />
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            required
            id="houseNumber"
            label="Hausnummer"
            value={formInput.houseNumber}
            onChange={(houseNumber) => {
              onChange<number | undefined>('houseNumber', houseNumber);
            }}
            errorMessage={errors.houseNumber}
            min={1}
          />
        </Grid>
      </Grid>
      <h1>Wasserkosten</h1>
      <Grid container columnSpacing={2} rowSpacing={2} sx={styles.container}>
        <Grid item xs={3}>
          <CurrencyInputField
            required
            id="waterUsageCost"
            label="Wasserkosten (pro m³)"
            value={formInput.waterUsageCost}
            onChange={(cost) => {
              onChange<CurrencyInCents | undefined>('waterUsageCost', cost);
            }}
            errorMessage={errors.waterUsageCost}
          />
        </Grid>
        <Grid item xs={3}>
          <CurrencyInputField
            required
            id="sewageCost"
            label="Abwasserkosten (pro m³)"
            value={formInput.sewageCost}
            onChange={(cost) => {
              onChange<CurrencyInCents | undefined>('sewageCost', cost);
            }}
            errorMessage={errors.sewageCost}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default InitializationForm;
