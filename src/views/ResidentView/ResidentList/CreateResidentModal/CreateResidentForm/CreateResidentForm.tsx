import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  CreateResidentInput,
  createResidentFormValidationSelector,
} from '../../states/create_resident_state';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import MonthYear from '_/extensions/date/month_year.extension';

/**
 * Form to submit new resident
 */
function CreateResidentForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    createResidentFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;

  function onChange<T>(field: keyof CreateResidentInput, value: T): void {
    setFormValidationState((state) => ({
      ...state,
      formInput: { ...state.formInput, [field]: value },
    }));
  }

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={6}>
        <TextField
          required
          id="firstName"
          label="Vorname"
          variant="outlined"
          value={formInput.firstName}
          onChange={(event) => onChange<string>('firstName', event.target.value)} // eslint-disable-line max-len
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          required
          id="lastName"
          label="Nachname"
          variant="outlined"
          value={formInput.lastName}
          onChange={(event) => onChange<string>('lastName', event.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName || ''}
        />
      </Grid>
      <Grid item xs={6}>
        <CurrencyInputField
          required
          id="rent"
          label="Miete"
          value={formInput.rent}
          onChange={(rent) => onChange<number | undefined>('rent', rent)}
          errorMessage={errors.rent}
        />
      </Grid>
      <Grid item xs={6}>
        <CurrencyInputField
          required
          id="incidentals"
          label="Nebenkosten"
          value={formInput.incidentals}
          onChange={(incidentals) => onChange<number | undefined>('incidentals', incidentals)} // eslint-disable-line max-len
          errorMessage={errors.incidentals}
        />
      </Grid>
      <Grid item xs={6}>
        <NumberTextField
          required
          id="numberOfResidents"
          label="Anzahl der Mieter"
          min={1}
          value={formInput.numberOfResidents}
          onChange={(residents) => {
            onChange<number | undefined>('numberOfResidents', residents);
          }}
          errorMessage={errors.numberOfResidents}
        />
      </Grid>
      <Grid item xs={6}>
        <NumberTextField
          required
          id="waterMeter"
          label="Wasserzählerstand"
          min={1}
          value={formInput.waterMeter}
          onChange={(meter) => {
            onChange<number | undefined>('waterMeter', meter);
          }}
          errorMessage={errors.waterMeter}
        />
      </Grid>
      <Grid item xs={6}>
        <MonthYearDateField
          required
          id="contractStart"
          label="Vertragsbeginn"
          value={formInput.contractStart}
          onChange={(month) => {
            onChange<MonthYear | undefined>('contractStart', month);
          }}
          errorMessage={errors.contractStart}
        />
      </Grid>
    </Grid>
  );
}

export default CreateResidentForm;
