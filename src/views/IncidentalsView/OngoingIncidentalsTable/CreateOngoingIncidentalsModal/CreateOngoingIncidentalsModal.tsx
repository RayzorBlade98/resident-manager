import { Grid, TextField } from '@mui/material';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ValidationConstraint } from '../../../../utils/validation/constraints';
import Validator from '../../../../utils/validation/validator';
import CurrencyInputField from '_/components/form/CurrencyInputField/CurrencyInputField';
import DeductionTypeSelect from '_/components/form/DeductionTypeSelect/DeductionTypeSelect';
import NumberTextField from '_/components/form/NumberTextField/NumberTextField';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import MonthYear from '_/extensions/date/month_year.extension';
import useFormValidation from '_/hooks/useFormValidation/useFormValidation';
import useIncidentalsState from '_/hooks/useIncidentalsState/useIncidentalsState';
import { DeductionType } from '_/models/incidentals/deduction_type';
import { CurrencyInCents } from '_/utils/currency/currency.utils';

interface CreateOngoingIncidentalsModalProps {
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
interface CreateOngoingIncidentalsInput {
  /**
   * Name of the new incidentals
   */
  name: string;

  /**
   * Cost of the new incidentals
   */
  currentCost: CurrencyInCents;

  /**
   * Deduction type of the new incidentals
   */
  deductionType: DeductionType;

  /**
   * Interval in which the new incidentals need to be payed
   */
  invoiceInterval: number;
}

/**
 * Modal that contains an input form to create new ongoing incidentals.
 */
function CreateOngoingIncidentalsModal(props: CreateOngoingIncidentalsModalProps): JSX.Element {
  const { addOngoingIncidentals } = useIncidentalsState();

  const {
    formInput,
    formErrors,
    formInputSetters,
    resetFormInput,
    FormSubmitButton,
  } = useFormValidation<CreateOngoingIncidentalsInput>({
    formValidator: new Validator<CreateOngoingIncidentalsInput>({
      name: ValidationConstraint.NoEmptyString,
      currentCost: ValidationConstraint.Currency,
      invoiceInterval: ValidationConstraint.Defined,
    }),
    defaultFormInput: {
      name: '',
      currentCost: undefined,
      deductionType: DeductionType.PerApartment,
      invoiceInterval: undefined,
    },
    onSubmitSuccess: (values) => {
      addOngoingIncidentals({
        id: uuid(),
        name: values.name,
        costs: [
          {
            cost: values.currentCost,
            date: new MonthYear().addMonths(-12),
          },
        ],
        deductionType: values.deductionType,
        invoiceInterval: values.invoiceInterval,
      });
      props.onCloseModal();
    },
    submitButtonLabel: 'Erstellen',
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
            onChange={(event) => formInputSetters.name(event.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
        </Grid>
        <Grid item xs={6}>
          <CurrencyInputField
            required
            id="cost"
            label="Kosten"
            value={formInput.currentCost}
            onChange={formInputSetters.currentCost}
            errorMessage={formErrors.currentCost}
          />
        </Grid>
        <Grid item xs={6}>
          <DeductionTypeSelect
            value={formInput.deductionType as DeductionType}
            onChange={formInputSetters.deductionType}
          />
        </Grid>
        <Grid item xs={6}>
          <NumberTextField
            required
            label="Abrechnungszeitraum"
            id="invoiceInterval"
            value={formInput.invoiceInterval}
            onChange={formInputSetters.invoiceInterval}
            errorMessage={formErrors.invoiceInterval}
            min={1}
            max={12}
            onlyInteger
          />
        </Grid>
      </Grid>

      {/* Footer */}
      <FormSubmitButton />
    </GenericModal>
  );
}

export default CreateOngoingIncidentalsModal;
