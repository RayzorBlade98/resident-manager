import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  PropertyInitializationInput,
  propertyInitializationFormValidationSelector,
} from '../states/property_initialization_state';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';

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
function PropertyInitializationForm(): JSX.Element {
  const [formValidationState, setFormValidationState] = useRecoilState(
    propertyInitializationFormValidationSelector,
  );
  const formInput = formValidationState.formInput;
  const errors = formValidationState.formErrors;

  function onChange<T>(
    field: keyof PropertyInitializationInput,
    value: T,
  ): void {
    setFormValidationState((state) => ({
      ...state,
      formInput: { ...state.formInput, [field]: value as number },
    }));
  }

  return (
    <Grid container columnSpacing={2} rowSpacing={2} sx={styles.container}>
      <Grid item xs={2}>
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
  );
}

export default PropertyInitializationForm;
