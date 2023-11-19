import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  InitializationInput,
  initializationFormValidationSelector,
} from '../states/initialization_state';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import SalutationSelect from '_/components/form/SalutationSelect/SalutationSelect';
import { Salutation } from '_/models/name';
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
      <h1>Vermieter</h1>
      <Grid container columnSpacing={2} rowSpacing={2} sx={styles.container}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            id="companyLandlord"
            label="Vermietungsunternehmen / Gemeinschaft"
            value={formInput.companyLandlord}
            onChange={(event) => {
              onChange<string>('companyLandlord', event.target.value);
            }}
            error={!!errors.companyLandlord}
            helperText={errors.companyLandlord}
          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} rowSpacing={2} sx={styles.container}>
        <Grid item xs={3}>
          <SalutationSelect
            value={formInput.salutationLandlord}
            onChange={(salutation) => onChange<Salutation>('salutationLandlord', salutation)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="firstNameLandlord"
            label="Vorname"
            variant="outlined"
            value={formInput.firstNameLandlord}
            onChange={(event) => onChange<string>('firstNameLandlord', event.target.value)} // eslint-disable-line max-len
            error={!!errors.firstNameLandlord}
            helperText={errors.firstNameLandlord}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="lastNameLandlord"
            label="Nachname"
            variant="outlined"
            value={formInput.lastNameLandlord}
            onChange={(event) => onChange<string>('lastNameLandlord', event.target.value)}
            error={!!errors.lastNameLandlord}
            helperText={errors.lastNameLandlord}
          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} rowSpacing={2} sx={styles.container}>
        <Grid item xs={3}>
          <NumberTextField
            required
            id="zipCodeLandlord"
            label="Postleitzahl"
            value={formInput.zipCodeLandlord}
            onChange={(zipCode) => {
              onChange<number | undefined>('zipCodeLandlord', zipCode);
            }}
            errorMessage={errors.zipCodeLandlord}
            min={1}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="cityLandlord"
            label="Stadt"
            value={formInput.cityLandlord}
            onChange={(event) => {
              onChange<string>('cityLandlord', event.target.value);
            }}
            error={!!errors.cityLandlord}
            helperText={errors.cityLandlord}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="streetLandlord"
            label="Straße"
            value={formInput.streetLandlord}
            onChange={(event) => {
              onChange<string>('streetLandlord', event.target.value);
            }}
            error={!!errors.streetLandlord}
            helperText={errors.streetLandlord}
          />
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            required
            id="houseNumberLandlord"
            label="Hausnummer"
            value={formInput.houseNumberLandlord}
            onChange={(houseNumber) => {
              onChange<number | undefined>('houseNumberLandlord', houseNumber);
            }}
            errorMessage={errors.houseNumberLandlord}
            min={1}
          />
        </Grid>
      </Grid>
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
            id="zipCodeProperty"
            label="Postleitzahl"
            value={formInput.zipCodeProperty}
            onChange={(zipCode) => {
              onChange<number | undefined>('zipCodeProperty', zipCode);
            }}
            errorMessage={errors.zipCodeProperty}
            min={1}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="cityProperty"
            label="Stadt"
            value={formInput.cityProperty}
            onChange={(event) => {
              onChange<string>('cityProperty', event.target.value);
            }}
            error={!!errors.cityProperty}
            helperText={errors.cityProperty}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            required
            fullWidth
            id="streetProperty"
            label="Straße"
            value={formInput.streetProperty}
            onChange={(event) => {
              onChange<string>('streetProperty', event.target.value);
            }}
            error={!!errors.streetProperty}
            helperText={errors.streetProperty}
          />
        </Grid>
        <Grid item xs={3}>
          <NumberTextField
            required
            id="houseNumberProperty"
            label="Hausnummer"
            value={formInput.houseNumberProperty}
            onChange={(houseNumber) => {
              onChange<number | undefined>('houseNumberProperty', houseNumber);
            }}
            errorMessage={errors.houseNumberProperty}
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
