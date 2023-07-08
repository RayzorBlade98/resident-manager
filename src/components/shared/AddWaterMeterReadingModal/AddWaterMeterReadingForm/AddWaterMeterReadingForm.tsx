import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  WaterMeterReadingInput,
  addWaterMeterReadingFormValidationSelector,
  residentForAddWaterMeterReadingSelector,
} from '../states/add_water_reading_state';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';

/**
 * Form to submit water meter reading information
 */
function AddWaterMeterReadingForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    addWaterMeterReadingFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;
  const resident = useRecoilValue(residentForAddWaterMeterReadingSelector);

  function onChange<T>(field: keyof WaterMeterReadingInput, value: T): void {
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
          <NumberTextField
            required
            id="waterMeterCount"
            label="Wasserzählerstand"
            value={formInput.waterMeterCount}
            onChange={(value) => {
              onChange<number | undefined>('waterMeterCount', value);
            }}
            errorMessage={errors.waterMeterCount}
            onlyInteger
            min={(resident?.waterMeterReadings.at(0)?.waterMeterCount ?? 0) + 1}
          />
        </Grid>
        <Grid item xs={12}>
          <StandardDateField
            required
            id="readingDate"
            label="Ablesedatum"
            value={formInput.readingDate}
            onChange={(value) => {
              onChange<Date | undefined>('readingDate', value);
            }}
            errorMessage={errors.readingDate}
          />
        </Grid>
      </Grid>
    </form>
  );
}

export default AddWaterMeterReadingForm;
