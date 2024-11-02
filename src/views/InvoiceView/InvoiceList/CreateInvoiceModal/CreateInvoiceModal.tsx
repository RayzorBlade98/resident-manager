import { Grid } from '@mui/material';
import React from 'react';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import MonthYearDateField from '_/components/form/MonthYearDateField/MonthYearDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';

interface CreateInvoiceModalProps {
  /**
   * Whether to show the modal
   */
  showModal: boolean;

  /**
   * Callback when the modal is closed
   */
  onCloseModal: () => void;
}

/**
 * All values that can be submitted in the form
 */
interface CreateInvoiceModalInput {
  /**
   * First month of the invoice
   */
  invoiceStart: MonthYear;

  /**
   * Last month of the invoice
   */
  invoiceEnd: MonthYear;

  /**
   * First month the new incidentals should be deducted
   */
  newDeductionStart: MonthYear;
}

/**
 * Modal that contains an input form to create a new invoice
 */
function CreateInvoiceModal(props: CreateInvoiceModalProps): JSX.Element {
  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateInvoiceModalInput>({
    formValidator: new Validator<CreateInvoiceModalInput>({
      invoiceStart: ValidationConstraint.Defined,
      invoiceEnd: ValidationConstraint.Defined,
      newDeductionStart: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      invoiceStart: undefined,
      invoiceEnd: undefined,
      newDeductionStart: undefined,
    },
    onSubmitSuccess: (_values) => {
      props.onCloseModal();
    },
    submitButtonLabel: 'Generieren',
  });

  return (
    <GenericModal
      title="Neue Nebenkostenabrechnung"
      show={props.showModal}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={6}>
          <MonthYearDateField
            required
            id="invoiceStart"
            label="Abrechnungsstart"
            value={formInput.invoiceStart}
            onChange={formInputSetters.invoiceStart}
            errorMessage={formErrors.invoiceStart}
          />
        </Grid>
        <Grid item xs={6}>
          <MonthYearDateField
            required
            id="invoiceEnd"
            label="Abrechnungsende"
            value={formInput.invoiceEnd}
            onChange={formInputSetters.invoiceEnd}
            errorMessage={formErrors.invoiceEnd}
          />
        </Grid>
        <Grid item xs={6}>
          <MonthYearDateField
            required
            id="newDeductionStart"
            label="Start des neuen Abschlags"
            value={formInput.newDeductionStart}
            onChange={formInputSetters.newDeductionStart}
            errorMessage={formErrors.newDeductionStart}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateInvoiceModal;
