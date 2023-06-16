import { Grid } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  InvoiceGenerationInput,
  generateInvoiceFormValidationSelector,
} from '../states/invoice_generation_view_state';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import MonthYear from '_/extensions/date/month_year.extension';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

/**
 * Form for selecting the start and end of the invoice
 */
function MonthSelection(): JSX.Element {
  const [formValidation, setFormValidation] = useRecoilState(
    generateInvoiceFormValidationSelector,
  );

  function onChange<T>(field: keyof InvoiceGenerationInput, value: T): void {
    setFormValidation((state) => ({
      ...state,
      formInput: { ...state.formInput, [field]: value },
    }));
  }

  return (
    <Grid container sx={styles.container}>
      <Grid item>
        <MonthYearDateField
          required
          id="invoiceStart"
          label="Abrechnungsstart"
          value={formValidation.formInput.invoiceStart}
          onChange={(month) => {
            onChange<MonthYear | undefined>('invoiceStart', month);
          }}
          errorMessage={formValidation.formErrors.invoiceStart}
        />
      </Grid>
      <Grid item>
        <MonthYearDateField
          required
          id="invoiceEnd"
          label="Abrechnungsende"
          value={formValidation.formInput.invoiceEnd}
          onChange={(month) => {
            onChange<MonthYear | undefined>('invoiceEnd', month);
          }}
          errorMessage={formValidation.formErrors.invoiceEnd}
        />
      </Grid>
    </Grid>
  );
}

export default MonthSelection;
