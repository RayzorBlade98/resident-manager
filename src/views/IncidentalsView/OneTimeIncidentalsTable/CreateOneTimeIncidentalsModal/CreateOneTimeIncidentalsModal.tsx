import { Button, Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import DeductionTypeSelect from '_/components/form/DeductionTypeSelect/DeductionTypeSelect';
import StandardDateField from '_/components/form/StandardDateField/StandardDateField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useIncidentalsState from '_/hooks/useIncidentalsState/useIncidentalsState';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { CurrencyInCents } from '_/utils/currency/currency.utils';
import Validator from '_/utils/validation/validator';

interface CreateOneTimeIncidentalsModalProps {
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
interface CreateOneTimeIncidentalsInput {
  /**
   * Name of the new incidentals
   */
  name: string;

  /**
   * Cost of the new incidentals
   */
  cost: CurrencyInCents;

  /**
   * Billing date of the new incidentals
   */
  billingDate: Date;

  /**
   * Payment date of the new incidentals
   */
  paymentDate: Date | undefined;

  /**
   * Deduction type of the new incidentals
   */
  deductionType: DeductionType;
}

/**
 * Modal that contains an input form to create new one-time incidentals.
 */
function CreateOneTimeIncidentalsModal(
  props: CreateOneTimeIncidentalsModalProps,
): JSX.Element {
  const { addOneTimeIncidentals } = useIncidentalsState();

  const {
    formInput,
    formErrors,
    formInputSetters,
    submitForm,
    resetFormInput,
    isFormInputValid,
  } = useFormValidation<CreateOneTimeIncidentalsInput>({
    formValidator: new Validator<CreateOneTimeIncidentalsInput>({
      name: ValidationConstraint.NoEmptyString,
      cost: ValidationConstraint.Currency,
      billingDate: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      name: '',
      cost: undefined,
      billingDate: new Date().toUTC(),
      paymentDate: undefined,
      deductionType: DeductionType.PerApartment,
    },
    onSubmitSuccess: (values) => {
      addOneTimeIncidentals({
        id: uuid(),
        name: values.name,
        cost: values.cost,
        billingDate: values.billingDate,
        paymentDate: values.paymentDate,
        deductionType: values.deductionType,
      });
      props.onCloseModal();
    },
  });

  return (
    <GenericModal
      title="Neue Nebenkosten"
      show={props.showModal}
      onClose={() => {
        props.onCloseModal();
        resetFormInput();
      }}
    >
      {/* Body */}
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
              formInputSetters.name(event.target.value);
            }}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
        </Grid>
        <Grid item xs={6}>
          <CurrencyInputField
            required
            id="cost"
            label="Kosten"
            value={formInput.cost}
            onChange={formInputSetters.cost}
            errorMessage={formErrors.cost}
          />
        </Grid>
        <Grid item xs={6}>
          <DeductionTypeSelect
            value={formInput.deductionType as DeductionType}
            onChange={formInputSetters.deductionType}
          />
        </Grid>
        <Grid item xs={6}>
          <StandardDateField
            required
            label="Rechnungsdatum"
            id="billingDate"
            value={formInput.billingDate}
            onChange={formInputSetters.billingDate}
            errorMessage={formErrors.billingDate}
          />
        </Grid>
        <Grid item xs={6}>
          <StandardDateField
            label="Zahlungsdatum"
            id="paymentDate"
            value={formInput.paymentDate}
            onChange={formInputSetters.paymentDate}
            errorMessage={formErrors.paymentDate}
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <Button
        variant="contained"
        color={isFormInputValid ? 'primary' : 'error'}
        onClick={submitForm}
      >
        Erstellen
      </Button>
    </GenericModal>
  );
}

export default CreateOneTimeIncidentalsModal;
