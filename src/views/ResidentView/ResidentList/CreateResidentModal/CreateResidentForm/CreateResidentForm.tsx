import { Grid, TextField } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  CreateResidentInput,
  createResidentFormErrorSelector,
  createResidentFormInputSelector,
} from '../../states/create_resident_state';
import CurrencyInputField from '_/components/CurrencyInputField/CurrencyInputField';
import MonthYearInput from '_/components/GenericComponents/MonthYearInput/MonthYearInput';
import { MonthYear } from '_/types/date';

function CreateResidentForm(): JSX.Element {
  const [formInput, setFormInput] = useRecoilState(
    createResidentFormInputSelector,
  );
  const errors = useRecoilValue(createResidentFormErrorSelector);

  function onChange<T>(field: keyof CreateResidentInput, value: T): void {
    setFormInput((state) => ({ ...state, [field]: value }));
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
          id="incidentals"
          label="Nebenkosten"
          value={formInput.incidentals}
          onChange={(incidentals) => onChange<number | undefined>('incidentals', incidentals)} // eslint-disable-line max-len
          errorMessage={errors.incidentals}
        />
      </Grid>
      <Grid item xs={6}>
        <MonthYearInput
          id="contractStart"
          label="Vertragsbeginn"
          priorMonthChoices={6}
          futureMonthChoices={6}
          onChange={(month) => onChange<MonthYear>('contractStart', month)}
        />
      </Grid>
    </Grid>
  );
}

export default CreateResidentForm;
